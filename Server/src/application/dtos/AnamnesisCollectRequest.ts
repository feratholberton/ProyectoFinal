export type AnswerType = 'text' | 'boolean' | 'single' | 'multi' | 'number' | 'date';

export type AnamnesisAnswer = {
  key: string; // key that maps to partialState field, e.g. 'inicio', 'patron', 'dolor_tipo'
  type: AnswerType;
  value: any; // value depends on type: string | boolean | string | string[] | number | ISO date string
};

export type AnamnesisCollectRequest = {
  patientID: string;
  answers: AnamnesisAnswer[];
};

export const AnamnesisCollectRequestFromHttp = (body: any): AnamnesisCollectRequest => {
  return {
    patientID: String(body?.patientID ?? ''),
    answers: Array.isArray(body?.answers)
      ? body.answers.map((a: any) => ({ key: String(a?.key ?? ''), type: String(a?.type ?? 'text') as AnswerType, value: a?.value }))
      : [],
  };
};
