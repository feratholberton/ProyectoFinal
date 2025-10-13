import { randomUUID } from 'crypto';
import type { IIdGenerator } from '../../../domain/ports/IIdGenerator.ts';

export class RandomUuidGenerator implements IIdGenerator {
  generate(): string {
    return randomUUID();
  }
}
