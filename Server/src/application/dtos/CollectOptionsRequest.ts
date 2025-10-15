export type CollectOptionsRequest = {
  patientID: string;
  opciones: string[];
  additional?: string;
}

function sanitizeAdditional(value: any, max = 200): string | undefined {
  if (value === undefined || value === null) return undefined;
  const s = String(value).trim();
  if (!s) return undefined;
  const stripped = s.replace(/<[^>]*>/g, '');
  return stripped.slice(0, max);
}

export function CollectOptionsRequestFromHttp(body: any): CollectOptionsRequest {
  const patientID = body?.patientID ?? body?.id ?? '';
  const PLACEHOLDERS = new Set([
    'string',
    'placeholder',
    'n/a',
    'na',
    'x',
    '-',
    '_',
    'test',
    'abc',
    'lorem',
    'todo',
  ]);

  const raw = Array.isArray(body?.opciones) ? body.opciones.map((s: any) => String(s ?? '').trim()) : [];

  const cleaned = raw
    .map((s: string) => s.replace(/<[^>]*>/g, ''))
    .map((s: string) => (PLACEHOLDERS.has(s.toLowerCase()) ? '' : s))
    .map((s: string) => s.slice(0, 100))
    .filter((s: string) => s.length >= 2);

  const opciones = Array.from(new Set(cleaned)) as string[];
  const additional = sanitizeAdditional(body?.additional);
  return { patientID: String(patientID), opciones, additional };
}

