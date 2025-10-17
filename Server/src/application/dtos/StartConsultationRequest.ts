export type StartConsultationRequest = {
  motivo_consulta: string;
  edad?: number;
  genero?: string;
};

export const StartConsultationRequest = {
  fromHttp(body: any): StartConsultationRequest {
    return {
      motivo_consulta: String(body?.motivo_consulta ?? ''),
      edad: typeof body?.edad === 'number' ? body.edad : body?.edad ? Number(body.edad) : undefined,
      genero: body?.genero != null ? String(body.genero) : undefined,
    };
  },
};

