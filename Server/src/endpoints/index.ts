import type { FastifyInstance } from 'fastify';
import registerRoutes from '../infrastructure/http/routes/index';

export default async function registerEndpoints(fastify: FastifyInstance) {
	return registerRoutes(fastify);
}

