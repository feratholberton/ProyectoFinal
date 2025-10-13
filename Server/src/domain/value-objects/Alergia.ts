import { ValidationError } from '../errors/ValidationError.ts';

export class Alergia {
  private readonly value: string;

  constructor(value: string) {
    const v = String(value ?? '').trim();
    if (!v) throw new ValidationError('Alergia vacía');
    if (v.length > 200) throw new ValidationError('Alergia demasiado larga');
    this.value = v;
  }

  toString() {
    return this.value;
  }
}
