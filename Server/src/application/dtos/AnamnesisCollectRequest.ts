export type AnswerType = 'text' | 'boolean' | 'single' | 'multi' | 'number' | 'date';

export type AnamnesisAnswer = {
  key: string; // key that maps to partialState field 'inicio', 'patron', 'dolor_tipo'
  type: AnswerType;
  value: any; // value depends on type: string | boolean | string | string[] | number | ISO date string
};

export type AnamnesisCollectRequest = {
  patientID: string;
  answers: AnamnesisAnswer[];
};

import { ValidationError } from '../../domain/errors/ValidationError.ts';

export const AnamnesisCollectRequestFromHttp = (body: any): AnamnesisCollectRequest => {
  const patientID = String(body?.patientID ?? '').trim();
  if (!patientID) throw new ValidationError('patientID requerido');
  if (!Array.isArray(body?.answers)) {
    throw new ValidationError('answers debe ser un array');
  }

  const answers: AnamnesisAnswer[] = body.answers.map((a: any, idx: number) => {
    const key = String(a?.key ?? '').trim();
    if (!key) throw new ValidationError(`answers[${idx}].key requerido`);
    const type = String(a?.type ?? 'text') as AnswerType;
    const value = a?.value;
    return { key, type, value } as AnamnesisAnswer;
  });

  return { patientID, answers };
};
