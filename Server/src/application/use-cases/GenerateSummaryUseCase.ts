import type { IConsultationRepository } from "../../domain/ports/IConsultationRepository.ts";
import type { IAIService } from "../../infrastructure/adapters/ai/IAIService.ts";

export class GenerateSummaryUseCase {
  constructor(private repo: IConsultationRepository, private aiService: IAIService) {}

  async execute(id: string) {
    const consultation = await this.repo.get(id);
    if (!consultation) {
      const { NotFoundError } = await import('../../domain/errors/NotFoundError.ts');
      throw new NotFoundError('No existe la sesi\u00f3n');
    }

  const currentStep = typeof consultation.getCurrentStep === 'function' ? consultation.getCurrentStep() : null;
    if (currentStep !== 'resumen') {
      const { ValidationError } = await import('../../domain/errors/ValidationError.ts');
      throw new ValidationError("No se puede generar el resumen: el paso actual no es 'resumen'");
    }

    const partialState = consultation.getPartialState();
    const resumen = await this.aiService.generateSummary(partialState);

    return { resumen, partialState };
  }
}

