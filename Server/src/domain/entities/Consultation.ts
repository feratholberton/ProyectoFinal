import { ConsultationId } from '../value-objects/ConsultationId.ts';
import type { PartialState } from '../../session.ts';
import type { ConsultationStep, ClinicalStep } from './ClinicalStep.ts';
import { ALL_CLINICAL_STEPS } from './ClinicalStep.ts';
import { MotivoConsulta } from '../value-objects/MotivoConsulta.ts';
import { ValidationError } from '../errors/ValidationError.ts';

export class Consultation {
  private steps: ClinicalStep[] = ALL_CLINICAL_STEPS;
  private pasoActual: ConsultationStep;
  private partialState: PartialState;

  constructor(private id: ConsultationId, motivo: MotivoConsulta) {
    this.pasoActual = 'consulta';
    this.partialState = { motivo_consulta: motivo.toString() };
  }

  static create(id: ConsultationId, motivo: MotivoConsulta) {
    return new Consultation(id, motivo);
  }

  getId(): ConsultationId {
    return this.id;
  }

  nextStep(): void {
    const currentIndex = this.steps.indexOf(this.pasoActual);
    if (currentIndex < this.steps.length - 1) {
      this.pasoActual = this.steps[currentIndex + 1];
    } else {
      throw new ValidationError("No se puede avanzar la consulta: ya está en el último paso 'resumen'");
    }
  }

  savePartialState(update: Partial<PartialState>): void {
    this.partialState = { ...this.partialState, ...update };
  }

  getPartialState(): PartialState {

    return JSON.parse(JSON.stringify(this.partialState ?? {}));
  }

  getCurrentStep(): ConsultationStep {
    return this.pasoActual;
  }

  canRecede(): boolean {
    const currentIndex = this.steps.indexOf(this.pasoActual);
    return currentIndex > 0;
  }

  recedeStep(): void {
    const currentIndex = this.steps.indexOf(this.pasoActual);
    if (currentIndex <= 0) {
      throw new Error('No se puede retroceder: ya está en el primer paso');
    }
    this.pasoActual = this.steps[currentIndex - 1];
  }
}
