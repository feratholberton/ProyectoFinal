import type { IConsultationRepository } from "../../infrastructure/adapters/persistence/IConsultationRepository.ts";
import type { IAIService } from "../../infrastructure/adapters/ai/IAIService.ts";

export class GenerateSummaryUseCase {
  constructor(private repo: IConsultationRepository, private aiService: IAIService) {}

  async execute(id: string) {
    const consultation = await this.repo.get(id);
    if (!consultation) {
      const { NotFoundError } = await import('../../domain/errors/NotFoundError.ts');
      throw new NotFoundError('No existe la sesión');
    }

    const partialState = consultation.getPartialState();
    const resumen = await this.aiService.generateSummary(partialState);

    return { resumen, partialState };
  }
}

