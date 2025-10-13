import type { IConsultationRepository } from "../../infrastructure/adapters/persistence/IConsultationRepository.ts";
import type { PartialState } from '../../session.ts';
import { AntecedentePersonal, Alergia, FarmacoHabitual, ExamenFisico } from '../../domain/value-objects/index.ts';

export * from '../../src/application/use-cases/AdvanceStepUseCase.ts';
