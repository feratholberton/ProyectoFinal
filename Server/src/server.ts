import Fastify from 'fastify';
import cors from '@fastify/cors';
import registerRoutes from './infrastructure/http/routes/index.ts';
import 'dotenv/config';

// inicializar instancia de Fastify
const fastify = Fastify({ logger: true });

// Configurar el swagger and register routes
(async () => {
  try {
	await fastify.register(cors, { origin: 'https://proyectofinal-87zc.onrender.com' });
	await registerRoutes(fastify);

	const port = process.env.PORT ? Number(process.env.PORT) : 10000;
	await fastify.listen({ port, host: '0.0.0.0' });
	console.log(`Server listening at http://0.0.0.0:${port}`);
  } catch (err) {
	console.error('Error starting server:', err);
	process.exit(1);
  }
})();

