import { describe, it, expect } from 'vitest';
import { AdvanceStepUseCase } from '../src/application/use-cases/AdvanceStepUseCase.ts';

describe('AdvanceStepUseCase', () => {
  it('throws NOT_FOUND when missing', async () => {
    const repo: any = { get: async (id: string) => null };
    const useCase = new AdvanceStepUseCase(repo);
  await expect(useCase.execute('nope', {} as any)).rejects.toThrowError();
  });

  it('saves partial state and advances step', async () => {
    const fakeConsultation: any = {
      savePartialState: (u: any) => { /* mutate internal for test */ },
      nextStep: () => { /* advance */ },
      getCurrentStep: () => 'antecedentes',
      getPartialState: () => ({ motivo_consulta: 'x' }),
    };
    let savedSession: any = null;
    const repo: any = {
      get: async (id: string) => fakeConsultation,
      save: async (id: string, session: any) => { savedSession = session; },
    };
    const useCase = new AdvanceStepUseCase(repo);
    const res = await useCase.execute('id1', { motivo_consulta: 'x' } as any);
    expect(res.pasoActual).toBe('antecedentes');
    expect(res.partialState).toEqual({ motivo_consulta: 'x' });
  });
});
