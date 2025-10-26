import { DomainError } from './DomainError.ts';

export class NotFoundError extends DomainError {
  constructor(message = 'Not Found') {
    super(message);
    this.name = 'NotFoundError';
  }
}
