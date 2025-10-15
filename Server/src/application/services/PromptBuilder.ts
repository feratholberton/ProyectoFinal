import type { PartialState } from '../../session.ts';

export class PromptBuilder {
  private header(context: string) {
    return `${context}\n\nResponde ÚNICAMENTE con UN SOLO array JSON válido de strings. No añadas texto, explicaciones ni encabezados. Si no hay elementos relevantes, responde con []. No inventes información ni fechas.`;
  }

  antecedentes(state: PartialState) {
  const edad = (state as any).edad ?? 'edad no especificada';
  const genero = (state as any).genero ?? 'género no especificado';
  const motivo = state.motivo_consulta ?? 'motivo no especificado';

    const context = `Eres un médico clínico. Datos: Edad: ${edad} años; Género: ${genero}; Motivo: "${motivo}".\nGenera hasta 8 antecedentes personales RELEVANTES para este caso. Incluye (cuando correspondan): enfermedades crónicas, cirugías previas (añade año entre paréntesis si se conoce), hospitalizaciones y hábitos tóxicos (p.ej. tabaquismo, alcohol). Cada antecedente debe tener como máximo 3 palabras cuando sea posible.`;

    return this.header(context) + `\n\nEjemplo: ["Hipertensión arterial", "Colecistectomía (2018)", "Tabaquismo (10 cig/día)"]`;
  }

  alergias(state: PartialState) {
  const antecedentes = state.antecedentes_personales?.join(', ') || 'no especificados';
  const motivo = state.motivo_consulta || 'no especificado';

    const context = `Eres un médico clínico. Antecedentes personales: ${antecedentes}. Motivo: "${motivo}".\nGenera hasta 8 alergias farmacológicas o ambientales relevantes para investigar en este paciente.`;

    return this.header(context) + `\n\nEjemplo: ["Alergia a la penicilina", "Alergia al látex"]`;
  }

  farmacos(state: PartialState) {
  const antecedentes = state.antecedentes_personales?.join(', ') || 'no especificados';
  const edad = (state as any).edad ?? 'edad no especificada';

    const context = `Eres un médico clínico. Datos: Edad: ${edad} años. Antecedentes patológicos: ${antecedentes}.\nGenera hasta 8 medicamentos habituales que podría tomar un paciente con este perfil. Incluye NOMBRE GENÉRICO y DOSIS solo si es claramente apropiado a partir del contexto; si no conoces la dosis, devuelve únicamente el nombre genérico. No inventes pautas ni dosis.`;

    return this.header(context) + `\n\nEjemplo: ["Enalapril 10 mg (1 vez/día)", "Metformina 850 mg (2 veces/día)"]`;
  }

  anamnesis(state: PartialState, anamnesisPrompt: string) {
  const edad = (state as any).edad ?? 'edad no especificada';
  const genero = (state as any).genero ?? 'género no especificado';
  const motivo = state.motivo_consulta || 'motivo no especificado';

    const context = `Eres un médico clínico. Datos: Edad: ${edad} años; Género: ${genero}; Motivo: "${motivo}".\nUsa la siguiente guía de anamnesis para generar preguntas dirigidas al síntoma: ${anamnesisPrompt}.\nGenera entre 10 y 15 preguntas clave, ordenadas por prioridad.`;

    return this.header(context) + `\n\nIMPORTANTE: Cada elemento del array debe ser una pregunta completa que termine con '?'. Ejemplo: ["¿Hace cuánto tiempo comenzó el dolor?", "¿Cómo describiría la intensidad del dolor (1-10)?"]`;
  }

  examenFisico(state: PartialState) {
    const contexto = {
      motivo_consulta: state.motivo_consulta,
      edad: (state as any).edad ?? null,
      genero: (state as any).genero ?? null,
      antecedentes: state.antecedentes_personales ?? null,
    };

    const context = `Eres un médico clínico. Contexto clínico: ${JSON.stringify(contexto, null, 2)}.\nGenera hasta 8 hallazgos o áreas de exploración para el examen físico, organizados por sistemas: Aspecto general, Signos vitales, Cardiovascular, Respiratorio, Abdominal, Neurológico, Piel y faneras y otros según el motivo. Usa el formato EXACTO: "Sistema: hallazgo breve".`;

    return this.header(context) + `\n\nEjemplo: ["Aspecto general: paciente vigil y orientado", "Signos vitales: TA 120/80"]`;
  }
}

export const promptBuilder = new PromptBuilder();
