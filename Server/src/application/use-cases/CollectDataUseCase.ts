import type { IConsultationRepository } from '../../infrastructure/adapters/persistence/IConsultationRepository.ts';
import type { PartialState } from '../../session.ts';

export class CollectDataUseCase {
  constructor(private repo: IConsultationRepository) {}

  async execute(patientID: string, opciones: string[], additional?: string) {
    const consultation = await this.repo.get(patientID);
    if (!consultation) throw new Error('NOT_FOUND');

    const currentStep = consultation.getCurrentStep();

    // pasos donde se permite additional
    const allowedForAdditional = new Set(['antecedentes', 'alergias', 'farmacos']);

    // existing partial options (merge instead of replace)
    const existingPartial: PartialState = consultation.getPartialState() || {};
    const existingOpciones = Array.isArray(existingPartial.opciones) ? existingPartial.opciones : [];

    // Convertir las opciones enviadas (son seleccionadas): checked = true
    const incomingOpciones = (opciones ?? [])
      .map((label: any) => ({ label: String(label ?? '').trim(), checked: true }))
      .filter((o: any) => o.label.length > 0);

    // Start with existing options, overwrite checked state if incoming provides same label
    const mergedMap = new Map<string, { label: string; checked: boolean }>();
    existingOpciones.forEach((o: any) => mergedMap.set(o.label, { label: o.label, checked: !!o.checked }));
    incomingOpciones.forEach((o: any) => mergedMap.set(o.label, { label: o.label, checked: true }));

    // If additional is provided and allowed in current step, add it as checked
    if (additional && allowedForAdditional.has(currentStep)) {
      const label = String(additional).trim();
      if (label.length > 0) mergedMap.set(label, { label, checked: true });
    }

    const opcionesObj = Array.from(mergedMap.values());

    consultation.savePartialState({ opciones: opcionesObj });
    await this.repo.save(patientID, consultation);
    return { patientID, pasoActual: consultation.getCurrentStep(), partialState: consultation.getPartialState() };
  }
}
