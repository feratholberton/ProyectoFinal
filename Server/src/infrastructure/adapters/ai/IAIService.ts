import type { PartialState } from '../../../session.ts';

export interface IAIService {
  generateOptions(state: PartialState, tipo: string): Promise<string[]>;
  generateSummary(state: PartialState): Promise<string>;
}
