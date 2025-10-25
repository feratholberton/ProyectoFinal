export type AnswerType = 'text' | 'boolean' | 'single' | 'multi' | 'number' | 'date';

export type AnamnesisAnswer = {
  key: string;
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

  const answers: AnamnesisAnswer[] = body.answers.map((answerItem: any, idx: number) => {
    const key = String(answerItem?.key ?? '').trim();
    if (!key) throw new ValidationError(`answers[${idx}].key requerido`);
    const type = String(answerItem?.type ?? 'text') as AnswerType;
    const value = answerItem?.value;
    return { key, type, value } as AnamnesisAnswer;
  });

  return { patientID, answers };
};
