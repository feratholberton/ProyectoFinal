export type StartConsultationRequest = {
  motivo_consulta: string;
  edad?: number;
  genero?: string;
};

import { ValidationError } from '../../domain/errors/ValidationError.ts';

export const StartConsultationRequest = {
  fromHttp(body: any): StartConsultationRequest {
    const motivo_consulta = String(body?.motivo_consulta ?? '');
    const forbiddenPlaceholders = ['string', 'test', 'prueba', 'dummy', 'placeholder'];
    if (typeof motivo_consulta === 'string' && forbiddenPlaceholders.includes(motivo_consulta.trim().toLowerCase())) {
      throw new ValidationError('motivo_consulta contiene un valor inválido');
    }
    const rawEdad = body?.edad;
    const edad = typeof rawEdad === 'number' ? rawEdad : rawEdad ? Number(rawEdad) : undefined;

    if (edad != null) {
      if (!Number.isFinite(edad) || edad < 0 || edad > 120) {
        throw new ValidationError('edad invalida: debe estar entre 0 y 120 años');
      }
    }

    let genero: string | undefined = undefined;
    if (body?.genero != null) {
      const g = String(body.genero).trim();
      if (g === '') {
        genero = undefined;
      } else {
        const GU = g.toUpperCase();
        if (GU !== 'F' && GU !== 'M') {
          throw new ValidationError('genero invalido');
        }
        genero = GU;
      }
    }

    return {
      motivo_consulta,
      edad,
      genero,
    };
  },
};

