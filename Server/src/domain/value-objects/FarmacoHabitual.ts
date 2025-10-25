import { ValidationError } from '../errors/ValidationError.ts';

export class FarmacoHabitual {
  private readonly value: string;

  constructor(value: string) {
    const trimmedValue = String(value ?? '').trim();
    if (!trimmedValue) throw new ValidationError('Fármaco vacío');
    if (trimmedValue.length > 200) throw new ValidationError('Fármaco demasiado largo');
    this.value = trimmedValue;
  }

  toString() {
    return this.value;
  }
}
