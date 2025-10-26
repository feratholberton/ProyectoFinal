import type { PartialState } from '../../session.ts';

export class PromptBuilder {
  private header(context: string) {
    return `${context}\n\nResponde ÚNICAMENTE con UN SOLO array JSON válido de strings. No añadas texto, explicaciones ni encabezados. Si no hay elementos relevantes, responde con []. No inventes información ni fechas.`;
  }

  antecedentes(state: PartialState) {
    const edad = (state as any).edad ?? 'edad no especificada';
    const genero = (state as any).genero ?? 'género no especificado';
    const motivo = state.motivo_consulta ?? 'motivo no especificado';

    const context = `Eres un médico clínico. Datos: Edad: ${edad} años; Género: ${genero}; Motivo: "${motivo}".\nGenera hasta 8 antecedentes personales RELEVANTES para este caso. Incluye (cuando correspondan): enfermedades crónicas, cirugías, hospitalizaciones y hábitos tóxicos (p.ej. tabaquismo, alcohol). Cada antecedente debe tener como máximo 3 palabras cuando sea posible.`;

    return this.header(context) + `\n\nEjemplo: ["Hipertensión arterial", "Colecistectomía", "Tabaquismo (16 cig/día)"]`;
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
      ' Genera hasta 8 medicamentos que podrían ser razonablemente considerados para este caso.' +
  ' SOLO EL NOMBRE . Prioriza nombres genéricos cuando sea posible.' +
      ' Si la información clínica es insuficiente para proponer fármacos específicos, devuelve sugerencias generales de clases (por ejemplo: "AINEs", "Antibiótico tópico para conjuntivitis") o responde con [].' +
      ' No inventes fármacos.';

    return this.header(context) + `\n\nEjemplo: ["Ibuprofeno", "Cloranfenicol", "AINEs"]`;
  }
}

export const promptBuilder = new PromptBuilder();
