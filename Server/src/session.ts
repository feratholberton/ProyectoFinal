
export type ConsultationStep =
  | 'consulta'
  | 'antecedentes'
  | 'alergias'
  | 'farmacos'
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
  examen_fisico_sections?: {
    estado_general?: string;
    cardiovascular?: string;
    abdomen?: string;
    miembros_inferiores?: string;
    signos_vitales?: string;
    pleuro_pulmonar?: string;
    neurologico?: string;
    fosas_lumbares?: string;
    osteoarticular_vascular_periferico?: boolean;
  };
  resumen_clinico?: string;
  opciones?: Option[];
}

