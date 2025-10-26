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
      const currentPartialState = consultation.getPartialState() || {};
      const currentOpciones = Array.isArray(currentPartialState.opciones) ? currentPartialState.opciones : [];
      const checkedLabelsFromPartial = currentOpciones
        .filter((opt: any) => opt && opt.checked)
        .map((opt: any) => opt.label);

      if ((!update.antecedentes_personales || (Array.isArray(update.antecedentes_personales) && update.antecedentes_personales.length === 0)) && currentStep === 'antecedentes' && checkedLabelsFromPartial.length > 0) {
        update.antecedentes_personales = checkedLabelsFromPartial as any;
      }
      if ((!update.alergias || (Array.isArray(update.alergias) && update.alergias.length === 0)) && currentStep === 'alergias' && checkedLabelsFromPartial.length > 0) {
        update.alergias = checkedLabelsFromPartial as any;
      }
      if ((!update.farmacos_habituales || (Array.isArray(update.farmacos_habituales) && update.farmacos_habituales.length === 0)) && currentStep === 'farmacos' && checkedLabelsFromPartial.length > 0) {
        update.farmacos_habituales = checkedLabelsFromPartial as any;
      }
    } catch (e) {
      // intentionally swallow promotion errors so advance flow isn't blocked
    }

    if (update.antecedentes_personales) {
      const antecedentesArray = Array.isArray(update.antecedentes_personales) ? update.antecedentes_personales : [];
      antecedentesArray.forEach((antecedenteLabel) => new AntecedentePersonal(antecedenteLabel));
    }

    if (update.alergias) {
      const alergiasArray = Array.isArray(update.alergias) ? update.alergias : [];
      alergiasArray.forEach((alergiaLabel) => new Alergia(alergiaLabel));
    }

    if (update.farmacos_habituales) {
      const farmacosArray = Array.isArray(update.farmacos_habituales) ? update.farmacos_habituales : [];
      farmacosArray.forEach((farmacoLabel) => new FarmacoHabitual(farmacoLabel));
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
        const generationResult = await this.generateOptionsUseCase.execute(id);
        if (generationResult && Array.isArray((generationResult as any).opciones)) {
          // Merge generated opciones with existing ones, preserving any previously checked flags.
          const generatedOptions = (generationResult as any).opciones;
          const partialStateAfterAdvance = consultation.getPartialState() || {};
          const savedOpciones = Array.isArray(partialStateAfterAdvance.opciones) ? partialStateAfterAdvance.opciones : [];

          const normalizeLabel = (s: any) => {
            try {
              return String(s ?? '').trim().normalize('NFKC').replace(/\s+/g, ' ').toLowerCase();
            } catch (e) {
              return String(s ?? '').trim().toLowerCase();
            }
          };

          const existingCheckedByNormalizedLabelMap = new Map<string, boolean>();
          savedOpciones.forEach((savedOpt: any) => existingCheckedByNormalizedLabelMap.set(normalizeLabel(savedOpt.label), !!savedOpt.checked));

          const mergedOpciones = generatedOptions
            .map((generatedOpt: any) => {
              const rawLabel = generatedOpt && typeof generatedOpt === 'object' ? (generatedOpt.label ?? generatedOpt.text ?? JSON.stringify(generatedOpt)) : String(generatedOpt ?? '');
              const displayLabel = String(rawLabel ?? '').trim();
              return { label: displayLabel, checked: existingCheckedByNormalizedLabelMap.get(normalizeLabel(displayLabel)) ?? false };
            })
            .filter((opt: any) => opt && typeof opt.label === 'string' && opt.label.length > 0);

          consultation.savePartialState({ opciones: mergedOpciones });
          await this.repo.save(id, consultation);
        } else {
          logger.info('[AdvanceStepUseCase] generator returned no opciones or unexpected shape', generationResult);
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
 
