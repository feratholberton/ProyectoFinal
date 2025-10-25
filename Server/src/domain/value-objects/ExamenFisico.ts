import { ValidationError } from '../errors/ValidationError.ts';

export class ExamenFisico {
  private readonly value: string;

  constructor(value: string) {
    const trimmedValue = String(value ?? '').trim();
    if (!trimmedValue) throw new ValidationError('Examen físico vacío');
    if (trimmedValue.length > 2000) throw new ValidationError('Examen físico demasiado largo');
    this.value = trimmedValue;
  }

  toString() {
    return this.value;
  }
}
