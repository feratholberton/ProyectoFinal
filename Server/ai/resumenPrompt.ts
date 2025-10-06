import { PartialState } from "../session.ts";

export function buildClinicalPrompt(state: PartialState) {
	return  `
Eres un médico clínico profesional redactando una nota médica.

Usa **únicamente** la información proporcionada a continuación. 
Si falta algún dato, **no lo inventes** ni agregues suposiciones. 
Si un campo está vacío, simplemente omítelo en la redacción final.

### Instrucciones:
- Escribe el resumen de forma profesional, clara y concisa.
- Usa subtítulos y formato de lista cuando corresponda.
- NO incluyas texto fuera del contexto clínico.
- Al final, redacta una breve **Nota clínica** en párrafo, que resuma la situación actual y el plan, sin inventar datos.

### Estructura esperada:
1. **Datos del paciente** (si están disponibles)
2. **Motivo de consulta**
3. **Antecedentes personales**
4. **Alergias**
5. **Fármacos habituales**
6. **Examen físico**
7. **Nota clínica final**

### Datos reales de la consulta:
${JSON.stringify(state, null, 2)}

Genera la nota siguiendo las instrucciones anteriores.
  `;
}
