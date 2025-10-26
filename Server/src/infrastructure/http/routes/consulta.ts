import type { FastifyInstance } from 'fastify';
import type { IConsultationRepository } from '../../../domain/ports/IConsultationRepository.ts';
import type { AdvanceStepUseCase } from '../../../application/use-cases/AdvanceStepUseCase.ts';
import type { GetConsultationUseCase } from '../../../application/use-cases/GetConsultationUseCase.ts';
import { PartialState } from '../../../session.ts';

export default function registerConsultaEndpoint(fastify: FastifyInstance, repo: IConsultationRepository, advanceUseCase?: AdvanceStepUseCase, getUseCase?: GetConsultationUseCase) {
  fastify.post<{ Body: PartialState; Params: { id: string } }>(
    '/consulta/:id',
    {},
    async (req, reply) => {
      try {
        const { id } = req.params;
  const useCase = advanceUseCase ?? new (await import('../../../application/use-cases/AdvanceStepUseCase.ts')).AdvanceStepUseCase(repo);
  const { AdvanceStepRequest } = await import('../../../application/dtos/AdvanceStepRequest.ts');
  const dto = AdvanceStepRequest.fromHttp(req.body, req.params);
  const result = await useCase.execute(id, dto.partial as PartialState);
        return reply.status(200).send(result);
      } catch (err: any) {
  const { mapDomainErrorToHttp } = await import('../errorMapper.ts');
        const handled = await mapDomainErrorToHttp(reply, err);
        if (handled) return;
        throw err;
      }
    }
  );

  fastify.get<{ Params: { id: string } }>(
    '/consulta/:id',
    {},
    async (req, reply) => {
      try {
        const { id } = req.params;
  const useCase = getUseCase ?? new (await import('../../../application/use-cases/GetConsultationUseCase.ts')).GetConsultationUseCase(repo);
  const result = await useCase.execute(id);
  const { ConsultationResponse } = await import('../../../application/dtos/ConsultationResponse.ts');
        return reply.status(200).send(ConsultationResponse.toHttp(result));
      } catch (err: any) {
  const { mapDomainErrorToHttp } = await import('../errorMapper.ts');
        const handled = await mapDomainErrorToHttp(reply, err);
        if (handled) return;
        throw err;
      }
    }
  );

  fastify.post<{ Params: { id: string } }>(
    '/consulta/:id/recede',
    {},
    async (req, reply) => {
      try {
        const { id } = req.params;
        const useCase = new (await import('../../../application/use-cases/RecedeStepUseCase.ts')).RecedeStepUseCase(repo);
        const result = await useCase.execute(id);
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
