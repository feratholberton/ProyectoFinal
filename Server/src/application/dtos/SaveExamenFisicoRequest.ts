import type { PartialState } from '../../session.ts';

export interface ExamenFisicoSections {
  estado_general?: string;
  cardiovascular?: string;
  abdomen?: string;
  miembros_inferiores?: string;
  signos_vitales?: string;
  pleuro_pulmonar?: string;
  neurologico?: string;
  fosas_lumbares?: string;
  osteoarticular_vascular_periferico?: boolean;
}

export interface SaveExamenFisicoRequest {
  sessionId: string;
  sections: ExamenFisicoSections;
}
