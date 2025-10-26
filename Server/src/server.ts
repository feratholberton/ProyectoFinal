import Fastify from 'fastify';
import cors from '@fastify/cors';
import { logger } from './infrastructure/logging/logger.ts';
import registerRoutes from './infrastructure/http/routes/index.ts';
import 'dotenv/config';

const fastify = Fastify({ logger: true });

(async () => {
	try {

	let corsOrigin: any = true;
	if (typeof process.env.CORS_ORIGIN === 'string') {
		const corsEnvValue = process.env.CORS_ORIGIN.trim();
		if (corsEnvValue === '' || corsEnvValue === '*' || corsEnvValue.toLowerCase() === 'true') {
			corsOrigin = true;
		} else if (corsEnvValue.toLowerCase() === 'false') {
			corsOrigin = false;
		} else {

			corsOrigin = corsEnvValue.split(',').map(s => s.trim()).filter(Boolean);
		}
	}
	await fastify.register(cors, { origin: corsOrigin });
	fastify.log.info({ corsOrigin }, 'CORS origin configured');


	const port = process.env.PORT ? Number(process.env.PORT) : 10000;
	const swaggerBase = process.env.SWAGGER_BASE_URL;
	fastify.log.info({ port, swaggerBase }, 'startup config');

	await registerRoutes(fastify);

	await fastify.listen({ port, host: '0.0.0.0' });
		logger.info && logger.info(`Server listening at http://0.0.0.0:${port}`);
  } catch (err) {
	logger.error('Error starting server:', err);
	process.exit(1);
  }
})();

