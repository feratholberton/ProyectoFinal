export class ConsultationId {
  private readonly id: string;

  constructor(id: string) {
    const trimmedId = String(id ?? '').trim();
    if (!trimmedId) throw new Error('Invalid ConsultationId');
    this.id = trimmedId;
  }

  toString(): string {
    return this.id;
  }
}
