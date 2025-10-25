import Fastify from 'fastify';
import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import registerRoutes from '../../src/infrastructure/http/routes/index';
import { createContainer as createRealContainer } from '../../src/infrastructure/config/di-container.ts';
import type { IAIService } from '../../src/infrastructure/adapters/ai/IAIService.ts';
class MockAIService implements IAIService {
  async generateOptions(_state: any, tipo: string) {

    return [`${tipo}-opt-1`, `${tipo}-opt-2`, `${tipo}-opt-3`];
  }

  async generateSummary(state: any) {

    const keys = Object.keys(state || {}).join(',');
    return `Resumen basado en: ${keys}`;
  }
}

describe('integration - full flow', () => {
  let fastify: ReturnType<typeof Fastify>;

  beforeEach(async () => {
    fastify = Fastify();

    // build a small test container manually to avoid requiring external API keys
  const { InMemoryConsultationRepository } = await import('../../src/infrastructure/adapters/persistence/InMemoryConsultationRepository.ts');
  const { RandomUuidGenerator } = await import('../../src/infrastructure/adapters/id/RandomUuidGenerator.ts');
  const { StartConsultationUseCase } = await import('../../src/application/use-cases/StartConsultationUseCase.ts');
  const { CollectDataUseCase } = await import('../../src/application/use-cases/CollectDataUseCase.ts');
  const { GenerateOptionsUseCase } = await import('../../src/application/use-cases/GenerateOptionsUseCase.ts');
  const { GenerateSummaryUseCase } = await import('../../src/application/use-cases/GenerateSummaryUseCase.ts');
  const { AdvanceStepUseCase } = await import('../../src/application/use-cases/AdvanceStepUseCase.ts');
  const { GetConsultationUseCase } = await import('../../src/application/use-cases/GetConsultationUseCase.ts');

    const repo = new InMemoryConsultationRepository();
    const idGenerator = new RandomUuidGenerator();
    const aiService = new MockAIService();

    const startUseCase = new StartConsultationUseCase(repo, aiService, idGenerator);
    const collectUseCase = new CollectDataUseCase(repo);
    const generateOptionsUseCase = new GenerateOptionsUseCase(repo, aiService);
    const generateSummaryUseCase = new GenerateSummaryUseCase(repo, aiService);
    const advanceStepUseCase = new AdvanceStepUseCase(repo);
    const getConsultationUseCase = new GetConsultationUseCase(repo);

  // register routes with our test use-cases
  await import('../../src/infrastructure/http/routes/start.ts').then(m => m.default(fastify, startUseCase));
  await import('../../src/infrastructure/http/routes/collect.ts').then(m => m.default(fastify, collectUseCase));
  await import('../../src/infrastructure/http/routes/consulta.ts').then(m => m.default(fastify, repo, advanceStepUseCase, getConsultationUseCase));
  await import('../../src/infrastructure/http/routes/end.ts').then(m => m.default(fastify, generateSummaryUseCase));

    await fastify.ready();
  });

  afterEach(async () => {
    await fastify.close();
  });

  it('happy path: start -> generator -> collect -> consulta -> end', async () => {
    // 1) Start
    const startRes = await fastify.inject({ method: 'POST', url: '/start', payload: { motivo_consulta: 'Dolor de cabeza' } });
    expect(startRes.statusCode).toBe(200);
    const startBody = JSON.parse(startRes.payload);
    expect(startBody.patientID).toBeTypeOf('string');
    const id = startBody.patientID as string;
    expect(startBody.opciones).toBeInstanceOf(Array);

  // 2) Generator (should generate deterministic options for the current step 'consulta')
  const genRes = await fastify.inject({ method: 'GET', url: `/generator/${id}` });
  expect(genRes.statusCode).toBe(200);
  const genBody = JSON.parse(genRes.payload);
  expect(genBody.opciones).toBeInstanceOf(Array);
  expect(genBody.opciones.map((o: any) => o.label)).toEqual(['antecedentes-opt-1', 'antecedentes-opt-2', 'antecedentes-opt-3']);

  // 3) Collect - select first option from the initial options returned by /start
  const startOptionLabel = (startBody.opciones && startBody.opciones[0] && startBody.opciones[0].label) || 'antecedentes-opt-1';
  const collectRes = await fastify.inject({ method: 'POST', url: '/api/collect', payload: { patientID: id, opciones: [startOptionLabel] } });
    expect(collectRes.statusCode).toBe(200);
    const collectBody = JSON.parse(collectRes.payload);
    expect(collectBody.partialState).toBeDefined();

    // 4) Consulta POST -> advance step
    const consultaRes = await fastify.inject({ method: 'POST', url: `/consulta/${id}`, payload: { antecedentes_personales: ['hipertension'] } });
    expect(consultaRes.statusCode).toBe(200);
    const consultaBody = JSON.parse(consultaRes.payload);
    expect(consultaBody.pasoActual).toBeDefined();
    expect(consultaBody.partialState).toBeDefined();

    // 5) End -> generate summary
    // Advance the session until 'resumen' step by calling the consulta endpoint repeatedly
    // (the flow implementation advances through predefined steps)
    for (let i = 0; i < 16; i++) {
      await fastify.inject({ method: 'POST', url: `/consulta/${id}`, payload: {} });
    }

    const endRes = await fastify.inject({ method: 'POST', url: '/api/end', payload: { id } });
    expect(endRes.statusCode).toBe(200);
    const endBody = JSON.parse(endRes.payload);
    expect(endBody.resumen).toBeTypeOf('string');
    expect(endBody.partialState).toBeDefined();
    expect((endBody.resumen as string).startsWith('Resumen basado en')).toBe(true);
  });

  it('returns 400 when motivo_consulta is invalid', async () => {
    const res = await fastify.inject({ method: 'POST', url: '/start', payload: { motivo_consulta: '' } });
    expect(res.statusCode).toBe(400);
    const body = JSON.parse(res.payload);
    // message should come from ValidationError thrown by MotivoConsulta
    expect(body.error).toBeDefined();
    expect(typeof body.error).toBe('string');
    expect(body.error).toMatch(/Motivo de consulta requerido/);
  });
});
