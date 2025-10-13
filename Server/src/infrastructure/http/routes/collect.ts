import type { FastifyInstance } from 'fastify';
import type { CollectDataUseCase } from '../../../application/use-cases/CollectDataUseCase.ts';
import type { CollectOptionsRequest } from '../../../application/dtos/CollectOptionsRequest.ts';

export default function registerCollectEndpoint(fastify: FastifyInstance, useCase: CollectDataUseCase) {
  fastify.post<{ Body: CollectOptionsRequest }>(
    '/api/collect',
    {
      schema: {
        description: 'Recibe opciones seleccionadas (array) y las guarda en partialState',
        body: {
          type: 'object',
          anyOf: [
            { required: ['patientID', 'opciones'] },
            { required: ['id', 'opciones'] },
          ],
          properties: {
            patientID: { type: 'string', description: 'ID de la consulta/paciente' },
            id: { type: 'string', description: 'Alias for patientID (backwards compatibility)' },
            opciones: { type: 'array', description: 'Array de labels seleccionados', items: { type: 'string' } },
          },
        },
        response: {
          200: {
            type: 'object',
            properties: {
              patientID: { type: 'string' },
              pasoActual: { type: 'string' },
              partialState: { type: 'object' },
            },
          },
        },
      },
    },
    async (req, reply) => {
      try {
  const { CollectOptionsRequestFromHttp } = await import('../../../application/dtos/CollectOptionsRequest.ts');
        const dto = CollectOptionsRequestFromHttp(req.body);
        const result = await useCase.execute(dto.patientID, dto.opciones);
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
