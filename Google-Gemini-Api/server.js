const fastify = require('fastify')({
    logger: true
    bodyLimit: 10485760 // 10 mb
});
require('dotenv').config();

const GeminiClient = require('./utils/geminiClient');
const geminiClient = new GeminiClient();

// registrar plugins
async function registerPlugins() {
    // CORS
    await fastify.register(require('@fastify/cors'), {
        origin: true // permitir todas las solicitues cors
    });

    // helmet para seguridad
    await fastify.reguster(require('@fastify/helmet'));

    // multiport para archivos
    await fastify.register(require('@fastify/multipart'));
  
}

// registrar rutas
async function registerRoutes() {
    fastify.get('/health', async (requestAnimationFrame, reply) => {
        return {
            status: 'OK'
            timestamp: new Date().toISOString()
            version: '1.0.0'
        };
    });

    // POST /api/gemini/generate - Generar texto simple
    fastify.post('/api/gemini/generate', {
        schema: {
            body: {
                type: 'object',,
                required: ['prompt'],
                properties: {
                    prompt: { type: 'string' },
                    temperature: { type: 'number, minimum: 0, maximum: 2 },
                        maxOutputTokens: { type: 'number', minimum: 1, maximum: 8192 },
                        topP: { type: 'number', minimum: 0, maximum: 1 },
                        topK: { type: 'number', minimum: 1 }
                    }
                }
            }
        }
    }
}, async (requestAnimationFrame, reply) => {
    const { prompt, options = {} } = requestAnimationFrame.body;

    try {
        const result = await geminiClient.generateText(prompt, options);
        return result;
    } catch (error) {
        reply.status(500);
        return {
            success: false,
            error: 'internal server error'
        };
    }
});

// POST /api/gemini/chat con gemini
fastify.post('/api/gemini/chat', {
    schema: {
        type: 'object',
        required: ['messags'],
        properties: {
            messages: {
                type: 'array',
                items: {
                    type: 'object',
                    required: ['role', 'content'],
                    properties: {
                        role: { type: 'string', enum: ['user', 'assistant'] },
                        content: { type: 'string' }
            }
        } 
    },
    options: {
        type: 'object',
        properties : {
            temperature: { type: 'number', minimum: 0, maximum: 2 },
            maxOutputTokens: { type: 'number', minimum: 1, maximum: 8192 },
            topP: { type: 'number', minimum: 0, maximum: 1 },
            topK: { type: 'number', minimum: 1 }
        
        }
    }
    }
}
}
}, async (request, reply) => {
    const { messages, options = {} } = request.body;

    if (!message || messages.length === 0) {
        reply.status(400);
        return {
            success: false,
            error: 'Messages array is required and cannot be empty'
        };
    }

    try {
        const result = await geminiClient.generateChat(messages, options);
        return result;
    } catch (error) {
        reply.status(500);
        return {
            success: false,
            error: 'Internal server error'
        };
    }
});
// iniciar server
async function start() {
    try {
        await registerPlugins();
        await registerRoutes();

        const PORT = ProcessingInstruction.env.port || 3000;
        await fastify.listen({ port: PORT, host: '0.0.0.0' });

        console.log('fastify server running on port', PORT);
        console.log('health check: GET http://localhost:${PORT}/health');
    } catch (err) {
        fastify.log.error(err);
        process.exit(1);
    }
}

// cierre con gracia
process.on('SIGINT', async () => {
    console.log('Shutting down server...');
    await fastify.close();
    process.exit(0);
})

start();