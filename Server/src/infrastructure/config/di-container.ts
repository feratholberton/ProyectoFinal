import { GeminiAIService } from '../adapters/ai/GeminiAIService.ts';
import { InMemoryConsultationRepository } from '../adapters/persistence/InMemoryConsultationRepository.ts';
import { RandomUuidGenerator } from '../adapters/id/RandomUuidGenerator.ts';
import { StartConsultationUseCase } from '../../application/use-cases/StartConsultationUseCase.ts';
import { CollectDataUseCase } from '../../application/use-cases/CollectDataUseCase.ts';
import { CollectAnamnesisUseCase } from '../../application/use-cases/CollectAnamnesisUseCase.ts';
import { GenerateOptionsUseCase } from '../../application/use-cases/GenerateOptionsUseCase.ts';
import { GenerateSummaryUseCase } from '../../application/use-cases/GenerateSummaryUseCase.ts';
import { AdvanceStepUseCase } from '../../application/use-cases/AdvanceStepUseCase.ts';
import { GetConsultationUseCase } from '../../application/use-cases/GetConsultationUseCase.ts';

export function createContainer() {
  const aiService = new GeminiAIService(process.env.GEMINI_API_KEY);
  const repo = new InMemoryConsultationRepository();
  const idGenerator = new RandomUuidGenerator();

  const startUseCase = new StartConsultationUseCase(repo, aiService, idGenerator);
  const collectUseCase = new CollectDataUseCase(repo);
  const collectAnamnesisUseCase = new CollectAnamnesisUseCase(repo);
  const generateOptionsUseCase = new GenerateOptionsUseCase(repo, aiService);
  const generateSummaryUseCase = new GenerateSummaryUseCase(repo, aiService);
  const advanceStepUseCase = new AdvanceStepUseCase(repo, generateOptionsUseCase);
  const getConsultationUseCase = new GetConsultationUseCase(repo);


  return {
    aiService,
    repo,
    idGenerator,
    startUseCase,
    collectUseCase,
  collectAnamnesisUseCase,
    generateOptionsUseCase,
    generateSummaryUseCase,
    advanceStepUseCase,
    getConsultationUseCase,

  } as const;
}
