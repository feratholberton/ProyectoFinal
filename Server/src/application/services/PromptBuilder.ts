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

    return this.header(context) + `\n\nEjemplo: ["Hipertensión arterial", "Colecistectomía (2018)", "Tabaquismo (16 cig/día)"]`;
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
    const motivo = state.motivo_consulta || 'motivo no especificado';

    const context =
      `Eres un médico clínico. Datos: Edad: ${edad} años. Antecedentes patológicos: ${antecedentes}. Motivo: "${motivo}".` +
      ' Genera hasta 8 medicamentos o clases farmacológicas que podrían ser razonablemente considerados para este caso.' +
  ' Incluye NOMBRE GENÉRICO y DOSIS. Prioriza nombres genéricos cuando sea posible.' +
      ' Si la información clínica es insuficiente para proponer fármacos específicos, devuelve sugerencias generales de clases (por ejemplo: "AINEs", "Antibiótico tópico para conjuntivitis") o responde con [].' +
      ' No inventes fármacos, dosis ni fechas.';

    return this.header(context) + `\n\nEjemplo: ["Ibuprofeno", "Cloranfenicol", "AINEs"]`;
  }

  anamnesis(state: PartialState, guide: string) {
    const motivo = state.motivo_consulta || 'motivo no especificado';
    const context = `Eres un médico clínico. Guía: ${guide}. Motivo: "${motivo}".\nANAMNESIS: genera una lista de preguntas orientadas a recopilar historia clínica pertinente.` +
      ' Cada elemento del array debe ser una pregunta completa y terminar con ?. No añadas declaraciones, explicaciones ni texto adicional; solo el array JSON de preguntas.';

    return this.header(context) + `\n\nEjemplo: ["¿Cuándo comenzó el problema?", "¿Qué empeora o mejora el síntoma?"]`;
  }

  inicioCuadro(state: PartialState) {
    const edad = (state as any).edad ?? 'edad no especificada';
    const motivo = state.motivo_consulta || 'motivo no especificado';
    const context = `Eres un médico clínico. Edad: ${edad} años. Motivo: "${motivo}".\nINICIO DEL CUADRO: genera preguntas dirigidas a establecer fecha y hora de comienzo, modalidad de inicio (brusco/gradual), duración desde el inicio y posibles eventos desencadenantes.`;

    return this.header(context) + `\n\nEjemplo: ["¿Cuándo comenzó el problema?", "¿Fue el inicio brusco o gradual?", "¿Hubo algún evento que lo desencadenó?"]`;
  }

  evolucion(state: PartialState) {
    const motivo = state.motivo_consulta || 'motivo no especificado';
    const context = `Eres un médico clínico. Motivo: "${motivo}".\nEVOLUCIÓN Y PATRÓN TEMPORAL: genera preguntas sobre progresión, estabilidad, intermitencia, patrón horario y respuesta a tratamientos previos.`;

    return this.header(context) + `\n\nEjemplo: ["¿Cómo ha evolucionado desde que comenzó?", "¿Es continuo o tiene períodos de remisión?", "¿Ha recibido tratamiento? ¿Mejoró o empeoró?"]`;
  }

  localizacion(state: PartialState) {
    const motivo = state.motivo_consulta || 'motivo no especificado';
    const context = `Eres un médico clínico. Motivo: "${motivo}".\nLOCALIZACIÓN Y CARACTERÍSTICAS ESPECIALES: genera preguntas que aclaren el lugar exacto del síntoma, si irradia, si cambia de localización y si es focal o difuso.`;

    return this.header(context) + `\n\nEjemplo: ["¿Dónde siente el síntoma principal?", "¿Se irradia hacia algún otro lugar?", "¿Es siempre en el mismo sitio o cambia?"]`;
  }

  caracteristicas(state: PartialState) {
    const motivo = state.motivo_consulta || 'motivo no especificado';
    const context = `Eres un médico clínico. Motivo: "${motivo}".\nCARACTERÍSTICAS DEL SÍNTOMA: genera preguntas para caracterizar el síntoma (tipo, intensidad, duración, factores que alivian o agravan).`;

    return this.header(context) + `\n\nEjemplo: ["¿Cómo describiría el dolor (punzante, opresivo, urente)?", "¿Qué intensidad tiene del 1 al 10?", "¿Qué lo alivia o empeora?"]`;
  }

  sintomasAsociados(state: PartialState) {
    const motivo = state.motivo_consulta || 'motivo no especificado';
    const context = `Eres un médico clínico. Motivo: "${motivo}".\nSÍNTOMAS ASOCIADOS: genera preguntas por sistemas (generales, cardiovascular, respiratorio, digestivo, urinario, neurológico y otros) para identificar síntomas acompañantes.`;

    return this.header(context) + `\n\nEjemplo: ["¿Ha tenido fiebre o escalofríos?", "¿Presenta tos o dificultad para respirar?", "¿Ha notado náuseas o dolor abdominal?"]`;
  }

  factoresDesencadenantes(state: PartialState) {
    const motivo = state.motivo_consulta || 'motivo no especificado';
    const context = `Eres un médico clínico. Motivo: "${motivo}".\nFACTORES DESENCADENANTES Y CONTEXTO: genera preguntas sobre traumatismos, ejercicio, alimentos, medicamentos nuevos, estrés, exposición ambiental o picaduras de insectos (considerar dengue en Uruguay).`;

    return this.header(context) + `\n\nEjemplo: ["¿Hubo algún factor que precipitó los síntomas?", "¿Se relaciona con alguna actividad o momento del día?", "¿Ha tenido picaduras recientes de mosquitos?"]`;
  }

  antecedentesRecientes(state: PartialState) {
    const motivo = state.motivo_consulta || 'motivo no especificado';
    const context = `Eres un médico clínico. Motivo: "${motivo}".\nANTECEDENTES RECIENTES Y CONTACTOS: genera preguntas sobre contactos con personas enfermas, infecciones recientes, viajes, exposición a animales o agua estancada.`;

    return this.header(context) + `\n\nEjemplo: ["¿Alguien cercano presentó síntomas similares?", "¿Ha viajado recientemente?", "¿Ha estado en contacto con animales o agua contaminada?"]`;
  }

  repercusiones(state: PartialState) {
    const motivo = state.motivo_consulta || 'motivo no especificado';
    const context = `Eres un médico clínico. Motivo: "${motivo}".\nREPERCUSIÓN FUNCIONAL Y CALIDAD DE VIDA: genera preguntas sobre impacto en actividades, trabajo o estudio, sueño, apetito y estado de ánimo.`;

    return this.header(context) + `\n\nEjemplo: ["¿Le impide realizar sus actividades habituales?", "¿Ha afectado su sueño o apetito?", "¿Cómo se siente anímicamente?"]`;
  }

  tratamientosPrevios(state: PartialState) {
    const motivo = state.motivo_consulta || 'motivo no especificado';
    const context = `Eres un médico clínico. Motivo: "${motivo}".\nTRATAMIENTOS PREVIOS Y AUTOMEDICACIÓN: genera preguntas sobre medicaciones tomadas, dosis, efecto, atención médica previa y estudios realizados.`;

    return this.header(context) + `\n\nEjemplo: ["¿Tomó alguna medicación para aliviarlo? ¿Cuál?", "¿Le hizo efecto?", "¿Recibió atención médica antes de esta consulta?"]`;
  }

  sintomasAlarma(state: PartialState) {
    const motivo = state.motivo_consulta || 'motivo no especificado';
    const context = `Eres un médico clínico. Motivo: "${motivo}".\nSÍNTOMAS DE ALARMA (Red Flags): genera preguntas para detectar fiebre persistente, sangrados, disnea, dolor torácico, pérdida de conciencia, convulsiones, deshidratación o ictericia.`;

    return this.header(context) + `\n\nEjemplo: ["¿Ha tenido fiebre alta persistente?", "¿Ha notado sangrados o moretones?", "¿Tuvo pérdida de conocimiento o convulsiones?"]`;
  }

  consideracionesUruguay(state: PartialState) {
    const context = `Eres un médico clínico en Uruguay. Añade preguntas contextuales según la época o región: dengue en verano, gripe/COVID en invierno, leptospirosis o brucelosis en pacientes rurales.`;

    return this.header(context) + `\n\nEjemplo: ["¿Tuvo picaduras de mosquitos y fiebre reciente?", "¿Ha estado en contacto con ganado o agua estancada?"]`;
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
