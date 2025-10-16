import type { FastifyReply } from 'fastify';

export async function mapDomainErrorToHttp(reply: FastifyReply, err: any): Promise<boolean> {
	if (!err) return false;

	const { ValidationError } = await import('../../domain/errors/ValidationError.ts');
	const { NotFoundError } = await import('../../domain/errors/NotFoundError.ts');
	const { DomainError } = await import('../../domain/errors/DomainError.ts');

	if (err instanceof ValidationError) {
		reply.status(400).send({ error: err.message });
		return true;
	}

	if (err instanceof NotFoundError) {
		reply.status(404).send({ error: 'No existe la sesión' });
		return true;
	}

	if (err instanceof DomainError) {
		reply.status(409).send({ error: err.message });
		return true;
	}

	return false;
}
