import type { FastifyInstance } from 'fastify';
import { Option } from '../../../session.ts';
import type { GenerateOptionsUseCase } from '../../../application/use-cases/GenerateOptionsUseCase.ts';

export default function registerGeneratorEndpoint(fastify: FastifyInstance, useCase: GenerateOptionsUseCase) {
  fastify.get<{ Params: { id: string } }>(
    '/generator/:id',
    {
      schema: {
        description: 'Generar opciones para el paso actual basado en partialState',
        params: {
          type: 'object',
          properties: { id: { type: 'string', description: 'ID de la sesión' } },
          required: ['id'],
        },
        response: {
          200: {
            type: 'object',
            properties: {
              opciones: { type: 'array', items: { type: 'object', properties: { label: { type: 'string' }, checked: { type: 'boolean' } } } },
            },
          },
          404: { type: 'object', properties: { error: { type: 'string' } } },
        },
      },
    },
    async (req, reply) => {
      try {
        const { id } = req.params;
        const result = await useCase.execute(id);
        return result;
      } catch (err: any) {
        const { mapDomainErrorToHttp } = await import('../errorMapper.ts');
        const handled = await mapDomainErrorToHttp(reply, err);
        if (handled) return;
        throw err;
      }
    }
  );
}
