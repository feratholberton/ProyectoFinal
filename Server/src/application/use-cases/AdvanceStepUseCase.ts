import type { IConsultationRepository } from "../../domain/ports/IConsultationRepository.ts";
import type { PartialState } from '../../session.ts';
import { AntecedentePersonal, Alergia, FarmacoHabitual } from '../../domain/value-objects/index.ts';
import type { GenerateOptionsUseCase } from './GenerateOptionsUseCase.ts';
import { logger } from '../../infrastructure/logging/logger.ts';

export class AdvanceStepUseCase {
  constructor(private repo: IConsultationRepository, private generateOptionsUseCase?: GenerateOptionsUseCase) {}

  async execute(id: string, update: PartialState) {
    const consultation = await this.repo.get(id);
    if (!consultation) {
      const { NotFoundError } = await import('../../domain/errors/NotFoundError.ts');
      throw new NotFoundError('No existe la sesión');
    }

    // If the client didn't provide explicit domain arrays (antecedentes/alergias/farmacos)
    // but there are selected opciones in partialState, map those checked labels into
    // the appropriate domain field depending on the current step. This ensures that
    // selections saved via /api/collect are promoted to explicit fields when advancing.
    try {
      const currentStep = consultation.getCurrentStep();
      const existingPartial = consultation.getPartialState() || {};
      const existingOpciones = Array.isArray(existingPartial.opciones) ? existingPartial.opciones : [];
      const checkedLabels = existingOpciones.filter((o: any) => o && o.checked).map((o: any) => o.label);

      if ((!update.antecedentes_personales || (Array.isArray(update.antecedentes_personales) && update.antecedentes_personales.length === 0)) && currentStep === 'antecedentes' && checkedLabels.length > 0) {
        update.antecedentes_personales = checkedLabels as any;
      }
      if ((!update.alergias || (Array.isArray(update.alergias) && update.alergias.length === 0)) && currentStep === 'alergias' && checkedLabels.length > 0) {
        update.alergias = checkedLabels as any;
      }
      if ((!update.farmacos_habituales || (Array.isArray(update.farmacos_habituales) && update.farmacos_habituales.length === 0)) && currentStep === 'farmacos' && checkedLabels.length > 0) {
        update.farmacos_habituales = checkedLabels as any;
      }
    } catch (e) {
    }

    if (update.antecedentes_personales) {

      const arr = Array.isArray(update.antecedentes_personales) ? update.antecedentes_personales : [];
      arr.forEach((a) => new AntecedentePersonal(a));
    }

    if (update.alergias) {
      const arr = Array.isArray(update.alergias) ? update.alergias : [];
      arr.forEach((a) => new Alergia(a));
    }

    if (update.farmacos_habituales) {
      const arr = Array.isArray(update.farmacos_habituales) ? update.farmacos_habituales : [];
      arr.forEach((f) => new FarmacoHabitual(f));
    }

    consultation.savePartialState(update);
    consultation.nextStep();
    await this.repo.save(id, consultation);

    // Only generate options for specific steps to avoid noisy generation
    const nextStep = consultation.getCurrentStep();
    logger.debug('[AdvanceStepUseCase] after advance, nextStep=', nextStep, 'generateOptionsConfigured=', Boolean(this.generateOptionsUseCase));
    if (this.generateOptionsUseCase && (nextStep === 'alergias' || nextStep === 'farmacos')) {
      try {
        logger.debug('[AdvanceStepUseCase] invoking generator for step=', nextStep);
        const genRes = await this.generateOptionsUseCase.execute(id);
        if (genRes && Array.isArray((genRes as any).opciones)) {
          // Merge generated opciones with existing ones, preserving any previously checked flags.
          const genOpc = (genRes as any).opciones;
          const existingPartial = consultation.getPartialState() || {};
          const existingOpciones = Array.isArray(existingPartial.opciones) ? existingPartial.opciones : [];

          const normalize = (s: any) => {
            try {
              return String(s ?? '').trim().normalize('NFKC').replace(/\s+/g, ' ').toLowerCase();
            } catch (e) {
              return String(s ?? '').trim().toLowerCase();
            }
          };

          const existingMap = new Map<string, boolean>();
          existingOpciones.forEach((o: any) => existingMap.set(normalize(o.label), !!o.checked));

          const merged = genOpc
            .map((o: any) => {
              const label = o && typeof o === 'object' ? (o.label ?? o.text ?? JSON.stringify(o)) : String(o ?? '');
              const lbl = String(label ?? '').trim();
              return { label: lbl, checked: existingMap.get(normalize(lbl)) ?? false };
            })
            .filter((o: any) => o && typeof o.label === 'string' && o.label.length > 0);

          consultation.savePartialState({ opciones: merged });
          await this.repo.save(id, consultation);
        } else {
          logger.info('[AdvanceStepUseCase] generator returned no opciones or unexpected shape', genRes);
        }
      } catch (e) {
        // don't block the advance flow if generation fails; log the error so we can debug
        logger.error('[AdvanceStepUseCase] generator failed', e);
      }
    } else {
      logger.debug('[AdvanceStepUseCase] skipping generation for step=', nextStep);
    }

    return {
      pasoActual: consultation.getCurrentStep(),
      partialState: consultation.getPartialState(),
    };
  }
}
 
