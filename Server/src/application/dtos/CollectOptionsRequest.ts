export type CollectOptionsRequest = {
  patientID: string;
  opciones: string[];
  additional?: string;
}

import { ValidationError } from '../../domain/errors/ValidationError.ts';

function sanitizeAdditional(value: any, max = 200): string | undefined {
  if (value === undefined || value === null) return undefined;
  const textStr = String(value).trim();
  if (!textStr) return undefined;
  const withoutHtml = textStr.replace(/<[^>]*>/g, '');
  const finalTrimmed = withoutHtml.slice(0, max).trim();
  if (!finalTrimmed) return undefined;
  const PLACEHOLDERS = new Set([
    'string',
    ' ',
    '-',
    '_',
    'test'
  ]);
  if (PLACEHOLDERS.has(finalTrimmed.toLowerCase())) return undefined;
  if (finalTrimmed.length < 2) return undefined;
  return finalTrimmed;
}

export function CollectOptionsRequestFromHttp(body: any): CollectOptionsRequest {
  const patientID = String(body?.patientID ?? '').trim();
  if (!patientID) throw new ValidationError('patientID requerido');
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  if (!uuidRegex.test(patientID)) throw new ValidationError('patientID inválido');
  const PLACEHOLDERS = new Set([
     'string',
    ' ',
    '-',
    '_',
    'test'
  ]);

  const raw = Array.isArray(body?.opciones) ? body.opciones.map((rawOpt: any) => String(rawOpt ?? '').trim()) : [];

  const cleaned = raw
    .map((opt: string) => opt.replace(/<[^>]*>/g, ''))
    .map((opt: string) => (PLACEHOLDERS.has(opt.toLowerCase()) ? '' : opt))
    .map((opt: string) => opt.slice(0, 100))
    .filter((opt: string) => opt.length >= 2);

  const opciones = Array.from(new Set(cleaned)) as string[];
  const additional = sanitizeAdditional(body?.additional);
  return { patientID: String(patientID), opciones, additional };
}

