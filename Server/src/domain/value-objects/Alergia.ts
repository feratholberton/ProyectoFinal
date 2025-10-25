import { ValidationError } from '../errors/ValidationError.ts';

export class Alergia {
  private readonly value: string;

  constructor(value: string) {
    const trimmedValue = String(value ?? '').trim();
    if (!trimmedValue) throw new ValidationError('Alergia vacía');
    if (trimmedValue.length > 200) throw new ValidationError('Alergia demasiado larga');
    this.value = trimmedValue;
  }

  toString() {
    return this.value;
  }
}
