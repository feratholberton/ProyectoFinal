import type { IConsultationRepository } from "../../domain/ports/IConsultationRepository.ts";
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
      .map((label: any) => {
        if (label && typeof label === 'object') {
          const maybe = (label as any).label ?? (label as any).text ?? JSON.stringify(label);
          return { label: String(maybe ?? '').trim(), checked: false };
        }
        return { label: String(label ?? '').trim(), checked: false };
      })
      .filter(o => o && typeof o.label === 'string' && o.label.length > 0);

    return { opciones };
  }
}

