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
  // 'consideracionesUruguay' is contextual only
  // 'examenFisico' removed — replaced by structured examen_fisico_sections
  | 'resumen';
