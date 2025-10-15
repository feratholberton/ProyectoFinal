import { FastifyInstance } from 'fastify';
import type { SaveExamenFisicoUseCase } from '../../../application/use-cases/SaveExamenFisicoUseCase.ts';
import type { GetExamenFisicoUseCase } from '../../../application/use-cases/GetExamenFisicoUseCase.ts';
import type { ExamenFisicoSections } from '../../../application/dtos/SaveExamenFisicoRequest.ts';

export default function registerExamenFisicoRoutes(
  fastify: FastifyInstance,
  saveUseCase: SaveExamenFisicoUseCase,
  getUseCase: GetExamenFisicoUseCase,
) {

  fastify.get('/session/:id/examen-fisico', async (request, reply) => {
    const { id } = request.params as any;
    // Delegate full responsibility to application layer
    const result = await getUseCase.execute(id);
    if (!result) return reply.status(404).send({ error: 'session_not_found' });
    // We force textual flags true at application layer, but keep checkbox from flags
    return { sections: result.sections, examen_fisico_flags: result.flags };
  });

  fastify.post('/session/:id/examen-fisico', {
    schema: {
      body: {
        type: 'object',
        properties: {
          estado_general: { type: 'string', maxLength: 2000, description: "Ejemplo: 'sin alteraciones'" },
          cardiovascular: { type: 'string', maxLength: 2000, description: "Ejemplo: 'sin alteraciones'" },
          abdomen: { type: 'string', maxLength: 2000, description: "Ejemplo: 'sin alteraciones'" },
          miembros_inferiores: { type: 'string', maxLength: 2000, description: "Ejemplo: 'sin alteraciones'" },
          signos_vitales: { type: 'string', maxLength: 2000, description: "Ejemplo: 'sin alteraciones'" },
          pleuro_pulmonar: { type: 'string', maxLength: 2000, description: "Ejemplo: 'sin alteraciones'" },
          neurologico: { type: 'string', maxLength: 2000, description: "Ejemplo: 'sin alteraciones'" },
          fosas_lumbares: { type: 'string', maxLength: 2000, description: "Ejemplo: 'sin alteraciones'" },
          osteoarticular_vascular_periferico: { type: 'boolean', description: 'Ejemplo: false' },
        },
      },
    },
  }, async (request, reply) => {
    const { id } = request.params as any;
    const body = request.body as ExamenFisicoSections;

    try {
      // Delegate normalization and persistence to application use-case
      const { session, flags } = await saveUseCase.execute({ sessionId: id, sections: body } as any);
      const ps = session.getPartialState();
      return { ok: true, partialState: ps, examen_fisico_flags: flags };
    } catch (e: any) {
      if (e.message === 'session_not_found') return reply.status(404).send({ error: 'session_not_found' });
      return reply.status(500).send({ error: 'internal_error', details: String(e) });
    }
  });
}
