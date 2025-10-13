export type AdvanceStepRequest = {
  patientID: string;
  partial: any;
};

export const AdvanceStepRequest = {
  fromHttp(body: any): AdvanceStepRequest {
    return { patientID: String(body?.patientID ?? ''), partial: body?.partial ?? {} };
  },
};

