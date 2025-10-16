// session.ts (canonical in src)

export type ConsultationStep =
  | 'consulta'
  | 'antecedentes'
  | 'alergias'
  | 'farmacos'
  // Anamnesis subsections as independent steps
  | 'inicioCuadro'
  | 'evolucion'
  | 'localizacion'
  | 'caracteristicas'
  | 'sintomasAsociados'
  | 'factoresDesencadenantes'
  | 'antecedentesRecientes'
  | 'repercusiones'
  | 'tratamientosPrevios'
  | 'sintomasAlarma'
  // 'consideracionesUruguay' is a contextual prompt, not a separate step
  // 'examenFisico' removed — replaced by structured examen_fisico_sections
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
  /**
   * Structured sections for examen físico. New field to replace the legacy single string `examen_fisico`.
   * Keys correspond to the UI textboxes requested by the user.
   */
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

