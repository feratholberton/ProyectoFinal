import type { IConsultationRepository } from '../../infrastructure/adapters/persistence/IConsultationRepository.ts';
import type { ExamenFisicoSections } from '../dtos/SaveExamenFisicoRequest.ts';
import { normalizeSections } from '../services/ExamenFisicoNormalizer.ts';

export class GetExamenFisicoUseCase {
  constructor(private repo: IConsultationRepository) {}

  async execute(sessionId: string): Promise<{ sections: ExamenFisicoSections; flags: Record<string, boolean> } | null> {
    const session = await this.repo.get(sessionId);
    if (!session) return null;
    const state: any = session.getPartialState();

    // Use existing stored sections if present, otherwise fallback to legacy examen_fisico
    const existing = state.examen_fisico_sections ?? {};
    const payload = {
      estado_general: existing.estado_general ?? state.examen_fisico,
      cardiovascular: existing.cardiovascular,
      abdomen: existing.abdomen,
      miembros_inferiores: existing.miembros_inferiores,
      signos_vitales: existing.signos_vitales,
      pleuro_pulmonar: existing.pleuro_pulmonar,
      neurologico: existing.neurologico,
      fosas_lumbares: existing.fosas_lumbares,
      osteoarticular_vascular_periferico: existing.osteoarticular_vascular_periferico,
    };

    const { sections, flags } = normalizeSections(payload as any);
    return { sections, flags };
  }
}
