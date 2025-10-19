import type { IConsultationRepository } from '../../domain/ports/IConsultationRepository.ts';
import type { PartialState } from '../../session.ts';

export class CollectDataUseCase {
  constructor(private repo: IConsultationRepository) {}

  async execute(patientID: string, opciones: string[], additional?: string) {
    const consultation = await this.repo.get(patientID);
    if (!consultation) throw new Error('NOT_FOUND');

    const currentStep = consultation.getCurrentStep();

    const allowedForAdditional = new Set(['antecedentes', 'alergias', 'farmacos']);

    const existingPartial: PartialState = consultation.getPartialState() || {};
    const existingOpciones = Array.isArray(existingPartial.opciones) ? existingPartial.opciones : [];


    const incomingOpciones = (opciones ?? [])
      .map((label: any) => ({ label: String(label ?? '').trim(), checked: true }))
      .filter((o: any) => o.label.length > 0);

    const mergedMap = new Map<string, { label: string; checked: boolean }>();
    existingOpciones.forEach((o: any) => mergedMap.set(o.label, { label: o.label, checked: !!o.checked }));
    incomingOpciones.forEach((o: any) => mergedMap.set(o.label, { label: o.label, checked: true }));

    if (additional && allowedForAdditional.has(currentStep)) {
      const label = String(additional).trim();
      const low = label.toLowerCase();
      const PLACEHOLDERS = new Set(['string', 'placeholder', 'n/a', 'na', 'x', '-', '_', 'test', 'abc', 'lorem', 'todo']);
      if (label.length > 1 && !PLACEHOLDERS.has(low)) mergedMap.set(label, { label, checked: true });
    }

  const opcionesObj = Array.from(mergedMap.values());

 
  const opcionesSeleccionadas = opcionesObj.filter((o: any) => !!o.checked);

  consultation.savePartialState({ opciones: opcionesSeleccionadas });
  await this.repo.save(patientID, consultation);
  return { patientID, pasoActual: consultation.getCurrentStep(), partialState: consultation.getPartialState() };
  }
}
