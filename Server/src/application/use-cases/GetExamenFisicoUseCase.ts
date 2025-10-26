import type { IConsultationRepository } from '../../domain/ports/IConsultationRepository.ts';

export class GetExamenFisicoUseCase {
  constructor(private repo: IConsultationRepository) {}

  async execute(id: string) {
    const consultation = await this.repo.get(id);
    if (!consultation) {
      const { NotFoundError } = await import('../../domain/errors/NotFoundError.ts');
      throw new NotFoundError('No existe la sesión');
    }

    const state: any = consultation.getPartialState() || {};

    const sections = state.examen_fisico_sections ? { ...state.examen_fisico_sections } : {};

    if (!Object.keys(sections).length && state.examen_fisico) {
      sections.estado_general = state.examen_fisico;
    }

    const flags: Record<string, boolean> = {};
    Object.keys(sections).forEach((k) => {
      const v = (sections as any)[k];
      flags[k] = v !== null && v !== undefined && v !== '';
    });

    if (!sections.estado_general) {
      sections.estado_general = sections.estado_general || '';
      flags.estado_general = !!sections.estado_general;
    }

    return { sections, flags };
  }
}
