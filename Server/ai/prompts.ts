export const prompts = {
  antecedentes: (input: string) => `Motivo de consulta: ${input}.
Genera 8 posibles antecedentes relevantes para este motivo.
Solo lista los antecedentes (2–5 palabras cada uno), sin texto adicional.`,

  alergias: (input: string) => `Antecedentes del paciente: ${input}.
Genera 8 posibles alergias farmacológicas o ambientales relevantes.
Cada una debe tener solo 2 o 3 palabras. Devuelve solo texto plano.`,

  farmacos: (input: string) => `Antecedentes: ${input}.
Genera una lista de 8 posibles fármacos habituales que podría usar este paciente.
Devuelve solo el nombre del farmaco y no texto adicional. Devuelve solo texto plano.`,

  anamnesis: (input: string, anamnesisPrompt: string) => `Motivo de consulta: ${input}.\n${anamnesisPrompt}`,

  examen_fisico: (input: string) => `Contexto clínico: ${input}.
Genera una lista de hallazgos posibles para el examen físico por sistemas.
Devuelve solo texto plano.`,
};
