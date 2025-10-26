export type ClinicalStep =
  | 'consulta'
  | 'antecedentes'
  | 'alergias'
  | 'farmacos'
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
  | 'resumen';

export const ALL_CLINICAL_STEPS: ClinicalStep[] = [
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

export type ConsultationStep = ClinicalStep;
