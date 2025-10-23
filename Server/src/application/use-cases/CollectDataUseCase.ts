import type { IConsultationRepository } from '../../domain/ports/IConsultationRepository.ts';
import type { PartialState } from '../../session.ts';

export class CollectDataUseCase {
  constructor(private repo: IConsultationRepository) {}

  async execute(patientID: string, opciones: string[], additional?: string) {
    const MAX_RETRIES = 3;
    const allowedForAdditional = new Set(['antecedentes', 'alergias', 'farmacos']);

    const normalize = (s: any) => {
      try {
        return String(s ?? '').trim().normalize('NFKC').replace(/\s+/g, ' ');
      } catch (e) {
        return String(s ?? '').trim();
      }
    };

    // build incoming list normalized and filtered, keep original label casing for storage
    const incomingList = (opciones ?? [])
      .map((lbl: any) => ({ raw: String(lbl ?? ''), label: String(lbl ?? '').trim() }))
      .filter((x: any) => x.label.length > 0);

    // include additional as last of incoming if allowed
    if (additional) {
      const addLabel = String(additional).trim();
      const low = addLabel.toLowerCase();
      const PLACEHOLDERS = new Set(['string', 'placeholder', 'n/a', 'na', 'x', '-', '_', 'test', 'abc', 'lorem', 'todo']);
      if (addLabel.length > 1 && !PLACEHOLDERS.has(low)) incomingList.push({ raw: addLabel, label: addLabel });
    }

    // read-modify-write with retry: re-read before save to handle concurrent updates
    for (let attempt = 0; attempt < MAX_RETRIES; attempt++) {
      const consultation = await this.repo.get(patientID);
      if (!consultation) throw new Error('NOT_FOUND');

      const currentStep = consultation.getCurrentStep();

      const existingPartial: PartialState = consultation.getPartialState() || {};
      const existingOpciones = Array.isArray(existingPartial.opciones) ? existingPartial.opciones : [];

      // maps for quick normalization-based lookup
      const existingMap = new Map<string, { label: string; checked: boolean }>();
      existingOpciones.forEach((o: any) => existingMap.set(normalize(o.label), { label: o.label, checked: !!o.checked }));

      // Build result: start with incoming in order (normalized dedupe), then append existing checked that are not in incoming
      const result: Array<{ label: string; checked: boolean }> = [];
      const seen = new Set<string>();

      for (const inc of incomingList) {
        const key = normalize(inc.label);
        if (seen.has(key)) continue; // dedupe incoming duplicates
        seen.add(key);
        const existing = existingMap.get(key);
        const checked = true; // incoming are selections
        // prefer existing casing if present, else use incoming label
        const label = existing ? existing.label : inc.label;
        result.push({ label, checked });
      }

      // preserve previously checked items not present in incoming (append after incoming)
      for (const ex of existingOpciones) {
        const key = normalize(ex.label);
        if (seen.has(key)) continue;
        if (ex.checked) {
          seen.add(key);
          result.push({ label: ex.label, checked: true });
        }
      }

      // Persist only opciones as source of truth
      consultation.savePartialState({ opciones: result });
      await this.repo.save(patientID, consultation);

      // Verify saved state matches expected result (simple equality on labels+checked)
      const after = await this.repo.get(patientID);
      const afterOpc = Array.isArray(after?.getPartialState()?.opciones) ? after!.getPartialState()!.opciones! : [];
      const equal = JSON.stringify(afterOpc) === JSON.stringify(result);
      if (equal) {
        return { patientID, pasoActual: consultation.getCurrentStep(), partialState: consultation.getPartialState() };
      }

      // otherwise a concurrent mutation happened; retry
    }

    // If we reach here, saving failed due to concurrent updates
    throw new Error('CONCURRENT_MODIFICATION');
  }
}
