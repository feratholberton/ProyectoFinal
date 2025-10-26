import { ValidationError } from '../errors/ValidationError.ts';

export class AntecedentePersonal {
  private readonly value: string;

  constructor(value: string) {
    const trimmedValue = String(value ?? '').trim();
    if (!trimmedValue) throw new ValidationError('Antecedente vacío');
    if (trimmedValue.length > 500) throw new ValidationError('Antecedente demasiado largo');
    this.value = trimmedValue;
  }

  toString() {
    return this.value;
  }
}
