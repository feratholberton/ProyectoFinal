import type { IConsultationRepository } from "../../domain/ports/IConsultationRepository.ts";

export class GetConsultationUseCase {
  constructor(private repo: IConsultationRepository) {}

  async execute(id: string) {
    const consultation = await this.repo.get(id);
    if (!consultation) {
      const { NotFoundError } = await import('../../domain/errors/NotFoundError.ts');
      throw new NotFoundError('No existe la sesión');
    }

    return {
      patientID: consultation.getId().toString(),
      pasoActual: consultation.getCurrentStep(),
      partialState: consultation.getPartialState(),
    };
  }
}

