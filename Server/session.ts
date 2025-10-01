// session.ts

// Tipos y estado parcial
export type ConsultationStep =
  | "consulta"
  | "antecedentes"
  | "alergias"
  | "farmacos"
  | "examenFisico"
  | "resumen";

export interface Option {
  label: string;
  checked: boolean;
}

export interface PartialState {
  motivo_consulta?: string;
  antecedentes_personales?: string[];
  alergias?: string[];
  farmacos_habituales?: string[];
  examen_fisico?: string;
  resumen_clinico?: string;
  opciones?: Option[]; 
}


// Funcion para simular las opciones que tira gemini
export function simulateGeminiOptions(context: string): Option[] {
  return Array.from({ length: 8 }, (_, i) => ({
    label: `Opción ${i + 1} para ${context}`,
    checked: false,
  }));
}