import { PartialState } from "../../../session.ts";

export const prompts = {
  antecedentes: (state: PartialState) => `Motivo de consulta: ${state.motivo_consulta || 'no especificado'}.
Genera 8 posibles antecedentes relevantes para este motivo.
Responde únicamente con UN SOLO array JSON válido de strings, sin texto adicional, sin explicación, sin encabezados, ni código. Ejemplo exacto: ["antecedente1","antecedente2","antecedente3"]
IMPORTANTE: Si no hay suficientes antecedentes, responde con un array vacío [].`,

  alergias: (state: PartialState) => `Antecedentes del paciente: ${state.antecedentes_personales?.join(', ') || 'no especificados'}.
Genera 8 posibles alergias farmacológicas o ambientales relevantes.
Responde únicamente con UN SOLO array JSON válido de strings, sin texto adicional, sin explicación, ni encabezados, ni código. Ejemplo exacto: ["alergia1","alergia2"]
IMPORTANTE: Si no hay alergias conocidas, responde con un array vacío [].`,

  farmacos: (state: PartialState) => `Antecedentes: ${state.antecedentes_personales?.join(', ') || 'no especificados'}.
Genera una lista de 8 posibles fármacos habituales que podría usar este paciente.
Responde únicamente con UN SOLO array JSON válido de strings, sin texto adicional, sin explicación, ni encabezados, ni código. Ejemplo exacto: ["paracetamol","ibuprofeno"]
IMPORTANTE: Si no hay fármacos habituales, responde con un array vacío [].`,

  anamnesis: (state: PartialState, anamnesisPrompt: string) => `Motivo de consulta: ${state.motivo_consulta || 'no especificado'}.
${anamnesisPrompt}

Responde únicamente con UN SOLO array JSON válido de strings (las preguntas), sin texto adicional, sin explicación, ni encabezados, ni código. Ejemplo exacto: ["¿Dónde duele?","¿Desde cuándo?"]
IMPORTANTE: Si no se requieren preguntas adicionales, responde con un array vacío [].`,

  examen_fisico: (state: PartialState) => `Contexto clínico: ${JSON.stringify(state)}.
Genera una lista de hallazgos posibles para el examen físico por sistemas.
Responde únicamente con UN SOLO array JSON válido de strings, sin texto adicional, sin explicación, ni encabezados, ni código. Ejemplo exacto: ["taquicardia","hipertensión"]
IMPORTANTE: Si no hay hallazgos relevantes, responde con un array vacío [].`,
};
