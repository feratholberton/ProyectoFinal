import type { FastifyReply } from 'fastify';

export function healthHandler(reply: FastifyReply) {
  reply.status(200).send({ status: 'ok' });
}
