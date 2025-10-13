import type { FastifyReply } from 'fastify';

export async function mapDomainErrorToHttp(reply: FastifyReply, err: any): Promise<boolean> {
	if (!err) return false;

	// import domain errors dynamically to avoid root circular deps
	const { ValidationError } = await import('../../domain/errors/ValidationError.ts');
	const { NotFoundError } = await import('../../domain/errors/NotFoundError.ts');

	if (err instanceof ValidationError) {
		reply.status(400).send({ error: err.message });
		return true;
	}

	if (err instanceof NotFoundError) {
		reply.status(404).send({ error: 'No existe la sesión' });
		return true;
	}

	return false;
}
