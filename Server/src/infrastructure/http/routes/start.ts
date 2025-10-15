import type { FastifyInstance } from 'fastify';
import type { StartConsultationUseCase } from '../../../application/use-cases/StartConsultationUseCase.ts';
import { StartConsultationRequest } from '../../../application/dtos/StartConsultationRequest.ts';

export default function registerStartEndpoint(fastify: FastifyInstance, startUseCase: StartConsultationUseCase) {
  fastify.post<{ Body: { motivo_consulta: string } }>(
    '/start',
    {
      schema: {
        description: 'Crear una nueva consulta para un paciente',
        body: {
          type: 'object',
          required: ['motivo_consulta'],
          properties: { motivo_consulta: { type: 'string', description: 'Motivo de la consulta' } },
        },
        response: {
          200: {
            type: 'object',
            properties: {
              patientID: { type: 'string' },
              pasoActual: { type: 'string' },
              opciones: { type: 'array', items: { type: 'object', properties: { label: { type: 'string' }, checked: { type: 'boolean' } } } },
            },
          },
        },
      },
    },
    async (req, reply) => {
      try {
        const dto = StartConsultationRequest.fromHttp(req.body);
        const result = await startUseCase.execute(dto);
        const { ConsultationResponse } = await import('../../../application/dtos/ConsultationResponse.ts');
        const responseObj = ConsultationResponse.toHttp(result);
        try {
          fastify.log.debug({ msg: '[start route] result raw', result });
          if (Array.isArray(result.opciones)) {
            result.opciones.forEach((o: any, i: number) => {
              try {
                // Avoid serializing potentially sensitive nested objects as raw strings
                fastify.log.debug({ msg: 'start route option', index: i, type: typeof o, keys: Object.keys(o), value: o });
              } catch (e) {
                fastify.log.debug({ msg: 'start route option inspect', index: i, inspect: o });
              }
            });
          }
          fastify.log.debug({ msg: '[start route] responseObj', response: responseObj });
        } catch (e) {
          fastify.log.debug({ msg: '[start route] responseObj (inspect)', responseObj });
        }
        return reply.status(200).send(responseObj);
      } catch (err) {
  const { mapDomainErrorToHttp } = await import('../errorMapper.ts');
        const handled = await mapDomainErrorToHttp(reply, err);
        if (handled) return;
        return reply.status(400).send({ error: (err as Error).message });
      }
    }
  );
}
