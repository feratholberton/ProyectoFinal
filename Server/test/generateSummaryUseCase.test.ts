import { describe, it, expect } from 'vitest';
import { GenerateSummaryUseCase } from '../src/application/use-cases/GenerateSummaryUseCase.ts';

describe('GenerateSummaryUseCase', () => {
  it('throws NOT_FOUND when missing', async () => {
    const repo: any = { get: async (id: string) => null };
    const ai: any = { generateSummary: async () => 'x' };
    const useCase = new GenerateSummaryUseCase(repo, ai);
  await expect(useCase.execute('nope')).rejects.toThrowError();
  });

  it('returns resumen and partialState', async () => {
    const fakeConsultation: any = {
      getPartialState: () => ({ motivo_consulta: 'x' }),
      getCurrentStep: () => 'resumen',
    };
    const repo: any = { get: async (id: string) => fakeConsultation };
    const ai: any = { generateSummary: async (state: any) => 'resumen!' };
    const useCase = new GenerateSummaryUseCase(repo, ai);
    const res = await useCase.execute('id1');
    expect(res).toEqual({ resumen: 'resumen!', partialState: { motivo_consulta: 'x' } });
  });
});
