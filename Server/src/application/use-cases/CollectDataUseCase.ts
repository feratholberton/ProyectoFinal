import type { IConsultationRepository } from '../../infrastructure/adapters/persistence/IConsultationRepository.ts';
import type { PartialState } from '../../session.ts';

export class CollectDataUseCase {
  constructor(private repo: IConsultationRepository) {}

  async execute(patientID: string, opciones: string[]) {
    const consultation = await this.repo.get(patientID);
    if (!consultation) throw new Error('NOT_FOUND');
    const opcionesObj = (opciones ?? [])
      .map((label: any) => ({ label: String(label ?? '').trim(), checked: false }))
      .filter((o: any) => o.label.length > 0);
    consultation.savePartialState({ opciones: opcionesObj });
    await this.repo.save(patientID, consultation);
    return { patientID, pasoActual: consultation.getCurrentStep(), partialState: consultation.getPartialState() };
  }
}
