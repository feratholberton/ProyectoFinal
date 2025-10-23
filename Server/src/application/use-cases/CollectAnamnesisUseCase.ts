import type { IConsultationRepository } from '../../domain/ports/IConsultationRepository.ts';
import type { PartialState } from '../../session.ts';
import { NotFoundError } from '../../domain/errors/NotFoundError.ts';
import type { AnamnesisCollectRequest, AnamnesisAnswer } from '../dtos/AnamnesisCollectRequest.ts';

export class CollectAnamnesisUseCase {
  constructor(private repo: IConsultationRepository) {}

  async execute(req: AnamnesisCollectRequest) {
  const consultation = await this.repo.get(req.patientID);
  if (!consultation) throw new NotFoundError('Consulta no encontrada');

    const existing: PartialState = consultation.getPartialState() || {};

  const update: Record<string, any> = {};

    const applyAnswer = (answer: AnamnesisAnswer) => {
      const key = answer.key;
      try {
        switch (answer.type) {
          case 'boolean':
            update[key] = Boolean(answer.value);
            break;
          case 'number':
            update[key] = typeof answer.value === 'number' ? answer.value : Number(answer.value);
            break;
          case 'multi':
            update[key] = Array.isArray(answer.value) ? answer.value.map((v: any) => String(v)) : String(answer.value).split(',').map((s: string) => s.trim());
            break;
          case 'date':
            update[key] = String(answer.value);
            break;
          case 'single':
          case 'text':
          default:
            update[key] = answer.value != null ? String(answer.value) : '';
        }
      } catch (e) {
        // best-effort: skip invalid conversion
      }
    };

  for (const answerItem of req.answers ?? []) applyAnswer(answerItem as AnamnesisAnswer);

    consultation.savePartialState({ ...existing, ...update });
    await this.repo.save(req.patientID, consultation);

    return { patientID: req.patientID, pasoActual: consultation.getCurrentStep(), partialState: consultation.getPartialState() };
  }
}
