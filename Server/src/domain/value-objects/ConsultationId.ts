export class ConsultationId {
  private readonly id: string;

  constructor(id: string) {
    if (!id || id.trim() === '') throw new Error('Invalid ConsultationId');
    this.id = id;
  }

  toString(): string {
    return this.id;
  }
}
