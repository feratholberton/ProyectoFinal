import type { ExamenFisicoSections } from '../dtos/SaveExamenFisicoRequest.ts';

const DEFAULT_TEXT = 'sin alteraciones';

const PLACEHOLDER_SET = new Set(['string', 'placeholder', 'n/a', 'na']);

export function normalizeSections(input: Partial<ExamenFisicoSections>): { sections: ExamenFisicoSections; flags: Record<string, boolean> } {
  const normalize = (v: any) => {
    if (v === undefined || v === null) return DEFAULT_TEXT;
    const s = String(v).trim();
    if (s === '') return DEFAULT_TEXT;

    if (PLACEHOLDER_SET.has(s.toLowerCase())) return DEFAULT_TEXT;
    return s;
  };

  const sections: ExamenFisicoSections = {
    estado_general: normalize(input.estado_general),
    cardiovascular: normalize(input.cardiovascular),
    abdomen: normalize(input.abdomen),
    miembros_inferiores: normalize(input.miembros_inferiores),
    signos_vitales: normalize(input.signos_vitales),
    pleuro_pulmonar: normalize(input.pleuro_pulmonar),
    neurologico: normalize(input.neurologico),
    fosas_lumbares: normalize(input.fosas_lumbares),
  osteoarticular_vascular_periferico: !!input.osteoarticular_vascular_periferico,
  };

 
  const flags: Record<string, boolean> = {
    estado_general: true,
    cardiovascular: true,
    abdomen: true,
    miembros_inferiores: true,
    signos_vitales: true,
    pleuro_pulmonar: true,
    neurologico: true,
    fosas_lumbares: true,
  osteoarticular_vascular_periferico: !!sections.osteoarticular_vascular_periferico,
  };

  return { sections, flags };
}
