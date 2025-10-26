export type AdvanceStepRequest = {
  patientID: string;
  partial: any;
};

import { ValidationError } from '../../domain/errors/ValidationError.ts';

export const AdvanceStepRequest = {
  fromHttp(body: any, params?: { id?: string }): AdvanceStepRequest {
    const patientID = String(body?.patientID ?? params?.id ?? '').trim();
    if (!patientID) throw new ValidationError('patientID requerido');
    return { patientID, partial: body?.partial ?? {} };
  },
};

