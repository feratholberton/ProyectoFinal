import { describe, it, expect } from 'vitest';
import { CollectDataUseCase } from '../src/application/use-cases/CollectDataUseCase.ts';
import type { IConsultationRepository } from '../src/domain/ports/IConsultationRepository.ts';

describe('CollectDataUseCase', () => {
  it('returns 404 when consultation not found', async () => {
    const repo: Partial<IConsultationRepository> = {
      get: async (id: string) => null,
    };

    const useCase = new CollectDataUseCase(repo as IConsultationRepository);
  await expect(useCase.execute('nope', ['a'])).rejects.toThrowError();
  });
});
