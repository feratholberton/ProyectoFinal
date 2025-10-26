
export type ConsultationStep =
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

export type PartialState = Record<string, any>;
