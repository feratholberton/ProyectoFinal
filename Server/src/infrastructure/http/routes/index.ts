import type { FastifyInstance } from 'fastify';
import registerStartEndpoint from './start.ts';
import registerCollectEndpoint from './collect.ts';
import registerConsultaEndpoint from './consulta.ts';
import registerEndEndpoint from './end.ts';
import swagger from '@fastify/swagger';
import swaggerUI from '@fastify/swagger-ui';
import { createContainer } from '../../config/di-container.ts';

export default async function registerRoutes(fastify: FastifyInstance) {

  fastify.get('/', async (_req, reply) => {
    return reply.status(200).send({ status: 'ok', docs: '/docs' });
  });
  const swaggerBase = process.env.SWAGGER_BASE_URL;
  const openapi: any = {
    info: { title: 'Elio', version: '1.0.0', description: 'API de testing' },
  };
  if (swaggerBase) {
    openapi.servers = [{ url: swaggerBase, description: 'Base URL (env: SWAGGER_BASE_URL)' }];
    fastify.log.info({ swaggerBase }, 'Swagger base URL configured');
  } else {
    fastify.log.info('No SWAGGER_BASE_URL set — Swagger UI will use request origin');
  }

  await fastify.register(swagger, { openapi });

  await fastify.register(swaggerUI, {
    routePrefix: '/docs',
    uiConfig: { docExpansion: 'list' },
  });

  const container = createContainer();

  registerStartEndpoint(fastify, container.startUseCase);
  registerCollectEndpoint(fastify, container.collectUseCase);
  fastify.log.info('Registering anamnesis route (dynamic import)');
  const anam = await import('./anamnesis.ts');
  fastify.log.info('Imported anamnesis module, registering endpoint');
  anam.default(fastify, container.collectAnamnesisUseCase);
  registerConsultaEndpoint(fastify, container.repo, container.advanceStepUseCase, container.getConsultationUseCase);
  registerEndEndpoint(fastify, container.generateSummaryUseCase);
}
