import { AntecedentePersonal, Alergia, FarmacoHabitual } from '../value-objects/index.ts';

export class ValidationService {
  validateAntecedentes(list: any[]) {
    (list ?? []).forEach(a => new AntecedentePersonal(a));
  }
  validateAlergias(list: any[]) {
    (list ?? []).forEach(a => new Alergia(a));
  }
  validateFarmacos(list: any[]) {
    (list ?? []).forEach(f => new FarmacoHabitual(f));
  }
  validateExamen(text: any) {

  }
}
