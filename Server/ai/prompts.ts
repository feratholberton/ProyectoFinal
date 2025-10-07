import { PartialState } from "../session.ts";

export const prompts = {
  antecedentes: (state: PartialState) => `Motivo de consulta: ${state.motivo_consulta || 'no especificado'}.
Genera 8 posibles antecedentes relevantes para este motivo.
Responde únicamente con un array JSON válido de strings, sin texto adicional ni explicaciones. Por ejemplo: ["antecedente1", "antecedente2", ...]`,

  alergias: (state: PartialState) => `Antecedentes del paciente: ${state.antecedentes_personales?.join(', ') || 'no especificados'}.
Genera 8 posibles alergias farmacológicas o ambientales relevantes.
Responde únicamente con un array JSON válido de strings, sin texto adicional ni explicaciones.`,

  farmacos: (state: PartialState) => `Antecedentes: ${state.antecedentes_personales?.join(', ') || 'no especificados'}.
Genera una lista de 8 posibles fármacos habituales que podría usar este paciente.
Responde únicamente con un array JSON válido de strings, sin texto adicional ni explicaciones.`,

  anamnesis: (state: PartialState, anamnesisPrompt: string) => `Motivo de consulta: ${state.motivo_consulta || 'no especificado'}.\n${anamnesisPrompt}\n\nResponde únicamente con un array JSON válido de strings (las preguntas), sin texto adicional ni explicaciones.`,

  examen_fisico: (state: PartialState) => `Contexto clínico: ${JSON.stringify(state)}.
Genera una lista de hallazgos posibles para el examen físico por sistemas.
Responde únicamente con un array JSON válido de strings, sin texto adicional ni explicaciones.`,
};
