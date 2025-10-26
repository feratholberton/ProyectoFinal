import type { IConsultationRepository } from "../../domain/ports/IConsultationRepository.ts";

export class RecedeStepUseCase {
  constructor(private repo: IConsultationRepository) {}

  async execute(id: string) {
    const consultation = await this.repo.get(id);
    if (!consultation) {
      const { NotFoundError } = await import('../../domain/errors/NotFoundError.ts');
      throw new NotFoundError('No existe la sesión');
    }

    if (!consultation.canRecede || !consultation.canRecede()) {
      const { DomainError } = await import('../../domain/errors/DomainError.ts');
      throw new DomainError('No se puede retroceder el paso');
    }

    consultation.recedeStep();
    await this.repo.save(id, consultation);

    return {
      pasoActual: consultation.getCurrentStep(),
      partialState: consultation.getPartialState(),
    };
  }
}
