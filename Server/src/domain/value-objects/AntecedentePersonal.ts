import { ValidationError } from '../errors/ValidationError.ts';

export class AntecedentePersonal {
  private readonly value: string;

  constructor(value: string) {
    const v = String(value ?? '').trim();
    if (!v) throw new ValidationError('Antecedente vacío');
    if (v.length > 500) throw new ValidationError('Antecedente demasiado largo');
    this.value = v;
  }

  toString() {
    return this.value;
  }
}
