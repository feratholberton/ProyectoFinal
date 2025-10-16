import { ConsultationId } from '../value-objects/ConsultationId.ts';
import type { PartialState, ConsultationStep } from '../../session.ts';
import { MotivoConsulta } from '../value-objects/MotivoConsulta.ts';

export class Consultation {
  private steps: ConsultationStep[] = [
    'consulta',
    'antecedentes',
    'alergias',
    'farmacos',
    'inicioCuadro',
    'evolucion',
    'localizacion',
    'caracteristicas',
    'sintomasAsociados',
    'factoresDesencadenantes',
    'antecedentesRecientes',
    'repercusiones',
    'tratamientosPrevios',
    'sintomasAlarma',

    'resumen',
  ];
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
      this.pasoActual = 'resumen';
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
}
