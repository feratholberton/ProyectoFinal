import { GeminiAIService } from '../adapters/ai/GeminiAIService.ts';
import { InMemoryConsultationRepository } from '../adapters/persistence/InMemoryConsultationRepository.ts';
import { RandomUuidGenerator } from '../adapters/id/RandomUuidGenerator.ts';
import { StartConsultationUseCase } from '../../application/use-cases/StartConsultationUseCase.ts';
import { CollectDataUseCase } from '../../application/use-cases/CollectDataUseCase.ts';
import { GenerateOptionsUseCase } from '../../application/use-cases/GenerateOptionsUseCase.ts';
import { GenerateSummaryUseCase } from '../../application/use-cases/GenerateSummaryUseCase.ts';
import { AdvanceStepUseCase } from '../../application/use-cases/AdvanceStepUseCase.ts';
import { GetConsultationUseCase } from '../../application/use-cases/GetConsultationUseCase.ts';
import { SaveExamenFisicoUseCase } from '../../application/use-cases/SaveExamenFisicoUseCase.ts';
import { GetExamenFisicoUseCase } from '../../application/use-cases/GetExamenFisicoUseCase.ts';

export function createContainer() {
  const aiService = new GeminiAIService(process.env.GEMINI_API_KEY);
  const repo = new InMemoryConsultationRepository();
  const idGenerator = new RandomUuidGenerator();

  const startUseCase = new StartConsultationUseCase(repo, aiService, idGenerator);
  const collectUseCase = new CollectDataUseCase(repo);
  const generateOptionsUseCase = new GenerateOptionsUseCase(repo, aiService);
  const generateSummaryUseCase = new GenerateSummaryUseCase(repo, aiService);
  const advanceStepUseCase = new AdvanceStepUseCase(repo);
  const getConsultationUseCase = new GetConsultationUseCase(repo);
  const saveExamenFisicoUseCase = new SaveExamenFisicoUseCase(repo as any);
  const getExamenFisicoUseCase = new GetExamenFisicoUseCase(repo as any);

  return {
    aiService,
    repo,
    idGenerator,
    startUseCase,
    collectUseCase,
    generateOptionsUseCase,
    generateSummaryUseCase,
    advanceStepUseCase,
    getConsultationUseCase,
    saveExamenFisicoUseCase,
    getExamenFisicoUseCase,
  } as const;
}
