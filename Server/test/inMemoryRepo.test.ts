import { describe, it, expect } from 'vitest';
import { InMemoryConsultationRepository } from '../infrastructure/adapters/persistence/InMemoryConsultationRepository';
import { Consultation } from '../domain/entities/Consultation.ts';
import { ConsultationId } from '../domain/value-objects/ConsultationId.ts';
import { MotivoConsulta } from '../domain/value-objects/MotivoConsulta.ts';

describe('InMemoryConsultationRepository', () => {
  it('saves and retrieves a consultation', async () => {
    const repo = new InMemoryConsultationRepository();
    const id = new ConsultationId('abc-123');
    const motivo = new MotivoConsulta('dolor de cabeza');
    const consultation = Consultation.create(id, motivo);

    await repo.save(id.toString(), consultation);
    const got = await repo.get(id.toString());
    expect(got).not.toBeNull();
    expect(got?.getId().toString()).toBe(id.toString());
  });
});
