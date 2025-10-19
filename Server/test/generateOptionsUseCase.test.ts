import { describe, it, expect } from 'vitest';
import { GenerateOptionsUseCase } from '../src/application/use-cases/GenerateOptionsUseCase.ts';

describe('GenerateOptionsUseCase', () => {
  it('returns NOT_FOUND when consultation missing', async () => {
    const repo: any = { get: async (id: string) => null };
    const aiService: any = { generateOptions: async () => [] };
    const useCase = new GenerateOptionsUseCase(repo, aiService);
  await expect(useCase.execute('missing')).rejects.toThrowError();
  });

  it('returns opciones from aiService mapped', async () => {
    const fakeConsultation: any = {
      getCurrentStep: () => 'antecedentes',
      getPartialState: () => ({ motivo_consulta: 'x' }),
    };
    const repo: any = { get: async (id: string) => fakeConsultation };
    const aiService: any = { generateOptions: async () => ['a', 'b'] };
    const useCase = new GenerateOptionsUseCase(repo, aiService);
    const res = await useCase.execute('id1');
    expect(res).toEqual({ opciones: [{ label: 'a', checked: false }, { label: 'b', checked: false }] });
  });
});
