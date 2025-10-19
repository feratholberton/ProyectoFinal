export type CollectOptionsRequest = {
  patientID: string;
  opciones: string[];
  additional?: string;
}

import { ValidationError } from '../../domain/errors/ValidationError.ts';

function sanitizeAdditional(value: any, max = 200): string | undefined {
  if (value === undefined || value === null) return undefined;
  const s = String(value).trim();
  if (!s) return undefined;
  const stripped = s.replace(/<[^>]*>/g, '');
  const trimmed = stripped.slice(0, max).trim();
  if (!trimmed) return undefined;
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
  if (PLACEHOLDERS.has(trimmed.toLowerCase())) return undefined;
  if (trimmed.length < 2) return undefined;
  return trimmed;
}

export function CollectOptionsRequestFromHttp(body: any): CollectOptionsRequest {
  const patientID = String(body?.patientID ?? '').trim();
  if (!patientID) throw new ValidationError('patientID requerido');
  // basic UUID v4 pattern validation
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  if (!uuidRegex.test(patientID)) throw new ValidationError('patientID inválido');
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

