import type { FastifyInstance } from 'fastify';
import type { GenerateSummaryUseCase } from '../../../application/use-cases/GenerateSummaryUseCase.ts';

export default function registerEndEndpoint(fastify: FastifyInstance, useCase: GenerateSummaryUseCase) {
  fastify.post<{ Body: { id: string } }>(
    '/api/end',
    {
      schema: {
        description: 'Finaliza la consulta y devuelve un resumen clínico simulado',
        body: {
          type: 'object',
          required: ['id'],
          properties: { id: { type: 'string', description: 'ID de la sesión' } },
        },
        response: {
          200: {
            type: 'object',
            properties: { resumen: { type: 'string' }, partialState: { type: 'object' } },
          },
          404: { type: 'object', properties: { error: { type: 'string' } } },
        },
      },
    },
    async (req, reply) => {
      try {
        const { id } = req.body;
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
