export class DomainError extends Error {
  readonly isDomain = true;
  constructor(message?: string) {
    super(message);
    this.name = 'DomainError';
  }
}
