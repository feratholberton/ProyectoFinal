import type { Consultation } from '../../../domain/entities/Consultation.ts';

export interface IConsultationRepository {
  save(id: string, session: Consultation): Promise<void>;
  get(id: string): Promise<Consultation | null>;
  delete(id: string): Promise<void>;
}
