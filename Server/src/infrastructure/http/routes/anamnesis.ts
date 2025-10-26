import type { FastifyInstance } from 'fastify';
import type { CollectAnamnesisUseCase } from '../../../application/use-cases/CollectAnamnesisUseCase.ts';

export default function registerAnamnesisEndpoint(fastify: FastifyInstance, useCase: CollectAnamnesisUseCase) {
  fastify.post(
    '/api/anamnesis',
    {
      schema: {
        description: 'Recibe un batch de respuestas de anamnesis tipadas y las guarda en partialState',
        body: {
          type: 'object',
          required: ['patientID', 'answers'],
          properties: {
            patientID: { type: 'string' },
            answers: {
              type: 'array',
              items: {
                type: 'object',
                required: ['key', 'type', 'value'],
                properties: {
                  key: { type: 'string' },
                  type: { type: 'string', enum: ['text', 'boolean', 'single', 'multi', 'number', 'date'] },
                  value: {
                    anyOf: [
                      { type: 'string' },
                      { type: 'boolean' },
                      { type: 'number' },
                      { type: 'array', items: { type: 'string' } },
                      { type: 'null' }
                    ]
                  },
                },
              },
            },
          },
        },
        response: {
          200: { type: 'object', properties: { patientID: { type: 'string' }, pasoActual: { type: 'string' }, partialState: { type: 'object' } } },
        },
      },
    },
    async (req, reply) => {
      try {
        const { AnamnesisCollectRequestFromHttp } = await import('../../../application/dtos/AnamnesisCollectRequest.ts');
        const dto = AnamnesisCollectRequestFromHttp(req.body);
        const result = await useCase.execute(dto);
        return reply.status(200).send(result);
      } catch (err: any) {
        const { mapDomainErrorToHttp } = await import('../errorMapper.ts');
        const handled = await mapDomainErrorToHttp(reply, err);
        if (handled) return;
        throw err;
      }
    }
  );
}
