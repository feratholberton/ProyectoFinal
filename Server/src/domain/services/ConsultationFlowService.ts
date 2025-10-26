import { Consultation } from '../entities/Consultation.ts';

export class ConsultationFlowService {
  advance(consultation: Consultation) {
    consultation.nextStep();
  }
}
