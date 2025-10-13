import { ValidationError } from '../errors/ValidationError.ts';

export class ExamenFisico {
  private readonly value: string;

  constructor(value: string) {
    const v = String(value ?? '').trim();
    if (!v) throw new ValidationError('Examen físico vacío');
    if (v.length > 2000) throw new ValidationError('Examen físico demasiado largo');
    this.value = v;
  }

  toString() {
    return this.value;
  }
}
