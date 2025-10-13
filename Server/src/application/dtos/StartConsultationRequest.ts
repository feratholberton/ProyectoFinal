export type StartConsultationRequest = {
  motivo_consulta: string;
};

export const StartConsultationRequest = {
  fromHttp(body: any): StartConsultationRequest {
    return { motivo_consulta: String(body?.motivo_consulta ?? '') };
  },
};

