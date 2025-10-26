import { describe, it, expect } from 'vitest';
import { GetConsultationUseCase } from '../src/application/use-cases/GetConsultationUseCase.ts';

describe('GetConsultationUseCase', () => {
  it('throws NOT_FOUND when missing', async () => {
    const repo: any = { get: async (id: string) => null };
    const useCase = new GetConsultationUseCase(repo);
  await expect(useCase.execute('nope')).rejects.toThrowError();
  });

  it('returns current state when present', async () => {
    const fakeConsultation: any = {
      getId: () => 'id1',
      getCurrentStep: () => 'consulta',
      getPartialState: () => ({ motivo_consulta: 'x' }),
    };
    const repo: any = { get: async (id: string) => fakeConsultation };
    const useCase = new GetConsultationUseCase(repo);
    const res = await useCase.execute('id1');
    expect(res).toEqual({ patientID: 'id1', pasoActual: 'consulta', partialState: { motivo_consulta: 'x' } });
  });
});
