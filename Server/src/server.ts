import Fastify from 'fastify';
import cors from '@fastify/cors';
import registerRoutes from './infrastructure/http/routes/index.ts';
import 'dotenv/config';

const fastify = Fastify({ logger: true });

(async () => {
	try {
	// Parse CORS_ORIGIN env var: allow 'true'|'*' => boolean true, 'false' => boolean false, otherwise treat as origin string
	let corsOrigin: any = true;
	if (typeof process.env.CORS_ORIGIN === 'string') {
		const v = process.env.CORS_ORIGIN.trim();
		if (v === '' || v === '*' || v.toLowerCase() === 'true') {
			corsOrigin = true;
		} else if (v.toLowerCase() === 'false') {
			corsOrigin = false;
		} else {
			// allow comma separated origins
			corsOrigin = v.split(',').map(s => s.trim()).filter(Boolean);
		}
	}
	await fastify.register(cors, { origin: corsOrigin });
	fastify.log.info({ corsOrigin }, 'CORS origin configured');

	// startup debug: log PORT and SWAGGER_BASE_URL presence (do not print secrets)
	const port = process.env.PORT ? Number(process.env.PORT) : 10000;
	const swaggerBase = process.env.SWAGGER_BASE_URL;
	fastify.log.info({ port, swaggerBase }, 'startup config');

	await registerRoutes(fastify);

	await fastify.listen({ port, host: '0.0.0.0' });
	console.log(`Server listening at http://0.0.0.0:${port}`);
  } catch (err) {
	console.error('Error starting server:', err);
	process.exit(1);
  }
})();

