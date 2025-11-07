import fp from 'fastify-plugin'
import { getOrCreateChatSession } from '../agents/patient-intake-agent.js';

export default fp(async (fastify) => {
  fastify.decorate('getOrCreateChatSession', getOrCreateChatSession);
});

declare module 'fastify' {
  interface FastifyInstance {
    getOrCreateChatSession: typeof getOrCreateChatSession;
  }
}
