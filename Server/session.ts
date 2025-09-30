// session.ts

// Tipos y estado parcial
export type ConsultationStep =
  | "consulta"
  | "antecedentes"
  | "alergias"
  | "farmacos"
  | "examenFisico"
  | "resumen";

export interface PartialState {
  motivo_consulta?: string;
  antecedentes_personales?: string[];
  alergias?: string[];
  farmacos_habituales?: string[];
  examen_fisico?: string;
  resumen_clinico?: string;
}

// Clase principal
export class ConsultationController {
  private steps: ConsultationStep[] = [
    "consulta",
    "antecedentes",
    "alergias",
    "farmacos",
    "examenFisico",
    "resumen",
  ];
  private pasoActual: ConsultationStep;
  private patientID: string;
  private partialState: PartialState;

  constructor(patientID: string) {
    this.patientID = patientID;
    this.pasoActual = "consulta";
    this.partialState = {};
  }

  // Avanzar al siguiente paso
  nextStep(): void {
    const currentIndex = this.steps.indexOf(this.pasoActual);
    if (currentIndex < this.steps.length - 1) {
      this.pasoActual = this.steps[currentIndex + 1];
    } else {
      this.pasoActual = "resumen";
    }
  }

  // Guardar estado parcial
  savePartialState(update: Partial<PartialState>): void {
    this.partialState = { ...this.partialState, ...update };
  }

  // Método público para obtener el estado parcial
  getPartialState(): PartialState {
    return this.partialState;
  }

  // Método público para obtener el paso actual
  getCurrentStep(): ConsultationStep {
    return this.pasoActual;
  }
}
