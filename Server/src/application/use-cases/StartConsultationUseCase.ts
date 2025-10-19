import type { IConsultationRepository } from '../../domain/ports/IConsultationRepository.ts';
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
    const consultationId = { toString: () => id } as any; 

    const consultation = Consultation.create(consultationId, motivo);

  const baseState = { motivo_consulta: motivo.toString() } as any;

  const demographics: any = {};
  if ((input as any).edad != null) demographics.edad = (input as any).edad;
  if ((input as any).genero != null) demographics.genero = (input as any).genero;

  const initialState: PartialState = { ...baseState, ...demographics };

  const opcionesRaw = await this.aiService.generateOptions(initialState, 'antecedentes');
  initialState.opciones = opcionesRaw
    .map((label: any) => ({ label: String(label ?? '').trim(), checked: false }))
    .filter(o => o.label.length > 0);

  consultation.savePartialState(initialState);

  consultation.nextStep();
  await this.repo.save(id, consultation);

  return { patientID: id, pasoActual: consultation.getCurrentStep(), opciones: consultation.getPartialState().opciones };
  }
}
 
