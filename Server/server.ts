// Require the framework and instantiate it

// ESM
import Fastify from 'fastify'

const fastify = Fastify({
  logger: true
})

// estado simulado en la memoria
let consultationData: PartialState = {};

// Endpoint GET para leer estado de consulta
fastify.get('/consulta', async (request, reply) => {
  return consultationData;
});

import type { PartialState } from './session'; // importo el tipo
let consultationState: PartialState = {}; // estado inicial vacio

//endpoint Post para actualizar estado de consulta
fastify.post<{ Body: PartialState }>('/consulta', async (request, reply) => {
  const update = request.body; // partial state y no unknown
  if (typeof consultationData === 'object' && consultationData !== null && typeof update === 'object' && update !== null) {
    consultationData = { ...consultationData, ...update }; // mergear estados
  } else {
    consultationData = update;
  }
  return { message: 'update recibido', state: consultationData };
});

// Declare a route
fastify.get('/', function (request, reply) {
  reply.send({ hello: 'world' })
})

// Run the server!
fastify.listen({ port: 10000, host: '0.0.0.0' }, function (err, address) {
  if (err) {
    fastify.log.error(err)
    process.exit(1)
  }
  fastify.log.info(`server listening on ${address}`)
  // Server is now listening on ${address}
})