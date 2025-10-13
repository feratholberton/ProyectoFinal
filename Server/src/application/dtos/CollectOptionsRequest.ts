export type CollectOptionsRequest = { patientID: string; opciones: string[] };

export function CollectOptionsRequestFromHttp(body: any): CollectOptionsRequest {
  const patientID = body?.patientID ?? body?.id ?? '';
  return { patientID: String(patientID), opciones: Array.isArray(body?.opciones) ? body.opciones.map(String) : [] };
}

