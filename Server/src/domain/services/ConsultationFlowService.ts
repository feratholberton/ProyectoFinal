// Minimal ConsultationFlowService placeholder (wraps Consultation entity operations)
import { Consultation } from '../entities/Consultation.ts';

export class ConsultationFlowService {
  advance(consultation: Consultation) {
    consultation.nextStep();
  }
}
