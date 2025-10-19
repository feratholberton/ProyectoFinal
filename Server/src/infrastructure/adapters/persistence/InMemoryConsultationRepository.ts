import type { Consultation } from '../../../domain/entities/Consultation.ts';
import { IConsultationRepository } from './IConsultationRepository.ts';
import { logger, safeSnippet } from '../../logging/logger.ts';

export class InMemoryConsultationRepository implements IConsultationRepository {
  private store = new Map<string, Consultation>();

  async save(id: string, session: Consultation): Promise<void> {
    const prev = this.store.get(id) ?? null;
    const prevState = prev?.getPartialState?.() ?? null;
    this.store.set(id, session);
    try {
      const nextState = session.getPartialState?.() ?? null;

  logger.debug('[InMemoryRepo] save', safeSnippet(JSON.stringify({ id, prev: prevState, next: nextState }, null, 2), 1000));
    } catch (e) {

    }
  }

  async get(id: string): Promise<Consultation | null> {
    return this.store.get(id) ?? null;
  }

  async delete(id: string): Promise<void> {
    this.store.delete(id);
  }
}
