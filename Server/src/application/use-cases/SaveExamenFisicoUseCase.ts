import type { IConsultationRepository } from '../../infrastructure/adapters/persistence/IConsultationRepository.ts';
import type { SaveExamenFisicoRequest, ExamenFisicoSections } from '../dtos/SaveExamenFisicoRequest.ts';
import type { Consultation } from '../../domain/entities/Consultation.ts';
import { normalizeSections } from '../services/ExamenFisicoNormalizer.ts';

const MAX_LEN = 2000;

function sanitizeText(s?: string) {
  if (!s) return undefined;
  const t = s.replace(/\s+/g, ' ').trim();
  return t.length > MAX_LEN ? t.slice(0, MAX_LEN) : t;
}

export class SaveExamenFisicoUseCase {
  constructor(private repo: IConsultationRepository) {}

  async execute(req: SaveExamenFisicoRequest): Promise<{ session: Consultation; flags: Record<string, boolean> }> {
    const session = await this.repo.get(req.sessionId);
    if (!session) throw new Error('session_not_found');

    const { sections, flags } = normalizeSections(req.sections as any);

    session.savePartialState({ examen_fisico_sections: sections });
    await this.repo.save(req.sessionId, session);
    return { session, flags };
  }
}
