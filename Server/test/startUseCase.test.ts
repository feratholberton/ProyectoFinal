import { describe, it, expect } from 'vitest';
import { StartConsultationUseCase } from '../src/application/use-cases/StartConsultationUseCase.ts';
import { Consultation } from '../src/domain/entities/Consultation.ts';
import { ConsultationId } from '../src/domain/value-objects/ConsultationId.ts';
import { MotivoConsulta } from '../src/domain/value-objects/MotivoConsulta.ts';

describe('StartConsultationUseCase', () => {
  it('creates a consultation and returns initial opciones', async () => {
    const repo: any = {
      save: async (id: string, session: any) => {},
    };
    const aiService: any = {
      generateOptions: async (state: any, tipo: string) => ['uno', 'dos'],
    };
    const idGenerator: any = { generate: () => 'generated-id' };

    const useCase = new StartConsultationUseCase(repo, aiService, idGenerator);
    const res = await useCase.execute({ motivo_consulta: 'dolor' } as any);
    expect(res.patientID).toBe('generated-id');
    expect(res.opciones).toBeDefined();
    expect(res.pasoActual).toBeDefined();
  });

  it('throws when motivo_consulta is invalid', async () => {
    const repo: any = { save: async () => {} };
    const aiService: any = { generateOptions: async () => [] };
    const idGenerator: any = { generate: () => 'x' };
    const useCase = new StartConsultationUseCase(repo, aiService, idGenerator);
    await expect(useCase.execute({ motivo_consulta: '' } as any)).rejects.toThrow();
  });
});
