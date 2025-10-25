export type StartConsultationRequest = {
  motivo_consulta: string;
  edad?: number;
  genero?: string;
};

import { ValidationError } from '../../domain/errors/ValidationError.ts';

export const StartConsultationRequest = {
  fromHttp(body: any): StartConsultationRequest {
    const motivo_consulta = String(body?.motivo_consulta ?? '');
    const forbiddenPlaceholders = ['string', ' '];
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
      const rawGeneroStr = String(body.genero).trim();
      if (rawGeneroStr === '') {
        genero = undefined;
      } else {
        const generoUpper = rawGeneroStr.toUpperCase();
        if (generoUpper !== 'F' && generoUpper !== 'M') {
          throw new ValidationError('genero invalido');
        }
        genero = generoUpper;
      }
    }

    return {
      motivo_consulta,
      edad,
      genero,
    };
  },
};

