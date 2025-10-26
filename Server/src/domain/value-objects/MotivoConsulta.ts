import { ValidationError } from '../errors/ValidationError.ts';

export class MotivoConsulta {
  private readonly value: string;

  constructor(motivo: string) {
    const trimmed = String(motivo ?? '').trim();
    if (!trimmed) {
      throw new ValidationError('Motivo de consulta requerido');
    }
    if (trimmed.length > 500) {
      throw new ValidationError('Motivo demasiado largo');
    }
    this.value = trimmed;
  }

  toString(): string {
    return this.value;
  }
}
