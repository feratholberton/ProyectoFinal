import type { IConsultationRepository } from "../../infrastructure/adapters/persistence/IConsultationRepository.ts";
import type { IAIService } from "../../infrastructure/adapters/ai/IAIService.ts";

export class GenerateOptionsUseCase {
  constructor(private repo: IConsultationRepository, private aiService: IAIService) {}

  async execute(id: string) {
    const consultation = await this.repo.get(id);
    if (!consultation) {
      const { NotFoundError } = await import('../../domain/errors/NotFoundError.ts');
      throw new NotFoundError('No existe la sesión');
    }

    const tipo = consultation.getCurrentStep();
    const state = consultation.getPartialState();

    const opcionesRaw = await this.aiService.generateOptions(state, tipo);
    const opciones = opcionesRaw
      .map((label: any) => ({ label: String(label ?? '').trim(), checked: false }))
      .filter(o => o.label.length > 0);

    return { opciones };
  }
}

