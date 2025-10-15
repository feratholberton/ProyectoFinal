export type StepType =
  | 'consulta'
  | 'antecedentes'
  | 'alergias'
  | 'farmacos'
  // 'examenFisico' removed (archived) - use examen_fisico_sections in session partial state instead
  | 'resumen';
