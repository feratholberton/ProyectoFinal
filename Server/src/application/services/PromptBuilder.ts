import type { PartialState } from '../../session.ts';

export class PromptBuilder {
  antecedentes(state: PartialState) {
    return `Motivo de consulta: ${state.motivo_consulta || 'no especificado'}.
Genera 8 posibles antecedentes de no mas de 3 palabras cada uno relevantes para este motivo.
Responde únicamente con UN SOLO array JSON válido de strings, sin texto adicional, sin explicación, sin encabezados, ni código. Ejemplo exacto: ["antecedente1","antecedente2","antecedente3"]
IMPORTANTE: Si no hay suficientes antecedentes, responde con un array vacío [].`;
  }

  alergias(state: PartialState) {
    return `Antecedentes del paciente: ${state.antecedentes_personales?.join(', ') || 'no especificados'}.
Genera 8 posibles alergias farmacológicas o ambientales relevantes.
Responde únicamente con UN SOLO array JSON válido de strings, sin texto adicional, sin explicación, ni encabezados, ni código. Ejemplo exacto: ["alergia1","alergia2"]
IMPORTANTE: Si no hay alergias conocidas, responde con un array vacío [].`;
  }

  farmacos(state: PartialState) {
    return `Antecedentes: ${state.antecedentes_personales?.join(', ') || 'no especificados'}.
Genera una lista de 8 posibles fármacos habituales que podría usar este paciente.
Responde únicamente con UN SOLO array JSON válido de strings, sin texto adicional, sin explicación, ni encabezados, ni código. Ejemplo exacto: ["paracetamol","ibuprofeno"]
IMPORTANTE: Si no hay fármacos habituales, responde con un array vacío [].`;
  }

  anamnesis(state: PartialState, anamnesisPrompt: string) {
    return `Motivo de consulta: ${state.motivo_consulta || 'no especificado'}.
${anamnesisPrompt}

Responde únicamente con UN SOLO array JSON válido de strings (las preguntas), sin texto adicional, sin explicación, ni encabezados, ni código. Ejemplo exacto: ["¿Dónde duele?","¿Desde cuándo?"]
IMPORTANTE: Si no se requieren preguntas adicionales, responde con un array vacío [].`;
  }

  examenFisico(state: PartialState) {
    // Prefer structured sections when available (examen_fisico_sections)
    const sections = state.examen_fisico_sections;
    const lines: string[] = [];
    if (sections) {
      if (sections.estado_general) lines.push(`Estado general: ${sections.estado_general}`);
      if (sections.signos_vitales) lines.push(`Signos vitales: ${sections.signos_vitales}`);
      if (sections.cardiovascular) lines.push(`Cardiovascular: ${sections.cardiovascular}`);
      if (sections.pleuro_pulmonar) lines.push(`Pleuro-pulmonar: ${sections.pleuro_pulmonar}`);
      if (sections.abdomen) lines.push(`Abdomen: ${sections.abdomen}`);
      if (sections.miembros_inferiores) lines.push(`Miembros inferiores: ${sections.miembros_inferiores}`);
      if (sections.neurologico) lines.push(`Neurológico: ${sections.neurologico}`);
      if (sections.fosas_lumbares) lines.push(`Fosas lumbares: ${sections.fosas_lumbares}`);
      if (sections.osteoarticular_vascular_periferico) lines.push('Examen osteoarticular y vascular periférico: presente');
    } else {
      if (state.motivo_consulta) lines.push(`Motivo: ${state.motivo_consulta}`);
      if (state.antecedentes_personales && state.antecedentes_personales.length)
        lines.push(`Antecedentes: ${state.antecedentes_personales.join(', ')}`);
      if (state.alergias && state.alergias.length) lines.push(`Alergias: ${state.alergias.join(', ')}`);
      if (state.farmacos_habituales && state.farmacos_habituales.length)
        lines.push(`Fármacos: ${state.farmacos_habituales.join(', ')}`);
      if (state.examen_fisico && state.examen_fisico.length) lines.push(`Examen físico previo: ${state.examen_fisico}`);
    }

    const clinicalSummary = lines.join('. ');

    return `Contexto clínico: ${clinicalSummary || 'sin otros datos relevantes'}.
Genera una lista breve (máximo 12 ítems) de hallazgos posibles para el examen físico, por sistemas, usando términos cortos (una o dos palabras cuando sea posible).
Responde únicamente con UN SOLO array JSON válido de strings, sin texto adicional, sin explicación, sin encabezados, ni código. Ejemplo exacto: ["taquicardia","soplo aórtico"]
IMPORTANTE: Si no hay hallazgos relevantes, responde con un array vacío [].`;
  }
}

export const promptBuilder = new PromptBuilder();
