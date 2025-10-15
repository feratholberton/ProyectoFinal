import type { IConsultationRepository } from '../../infrastructure/adapters/persistence/IConsultationRepository.ts';
import type { IAIService } from '../../infrastructure/adapters/ai/IAIService.ts';
import type { IIdGenerator } from '../../domain/ports/IIdGenerator.ts';
import type { StartConsultationRequest } from '../dtos/StartConsultationRequest.ts';
import { MotivoConsulta } from '../../domain/value-objects/MotivoConsulta.ts';
import { Consultation } from '../../domain/entities/Consultation.ts';
import type { PartialState } from '../../session.ts';

export class StartConsultationUseCase {
  constructor(
    private repo: IConsultationRepository,
    private aiService: IAIService,
    private idGenerator: IIdGenerator
  ) {}

  async execute(input: StartConsultationRequest) {
    const motivo = new MotivoConsulta(input.motivo_consulta);

    const id = this.idGenerator.generate();
    const consultationId = { toString: () => id } as any; // lightweight wrapper for now

    const consultation = Consultation.create(consultationId, motivo);

    const initialState: PartialState = { motivo_consulta: motivo.toString() };
    const opcionesRaw = await this.aiService.generateOptions(initialState, 'antecedentes');
    initialState.opciones = opcionesRaw
      .map((label: any) => ({ label: String(label ?? '').trim(), checked: false }))
      .filter(o => o.label.length > 0);

  consultation.savePartialState(initialState);
  // advance immediately so the session starts at 'antecedentes' (skip initial 'consulta' step)
  consultation.nextStep();
  await this.repo.save(id, consultation);

  return { patientID: id, pasoActual: consultation.getCurrentStep(), opciones: consultation.getPartialState().opciones };
  }
}
 
