// session.ts (canonical in src)

export type ConsultationStep =
  | 'consulta'
  | 'antecedentes'
  | 'alergias'
  | 'farmacos'
  | 'examenFisico'
  | 'resumen';

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

