import { ValidationError } from '../errors/ValidationError.ts';

export class FarmacoHabitual {
  private readonly value: string;

  constructor(value: string) {
    const v = String(value ?? '').trim();
    if (!v) throw new ValidationError('Fármaco vacío');
    if (v.length > 200) throw new ValidationError('Fármaco demasiado largo');
    this.value = v;
  }

  toString() {
    return this.value;
  }
}
