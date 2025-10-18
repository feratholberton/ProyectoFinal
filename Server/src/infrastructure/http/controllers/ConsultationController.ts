import type { PartialState } from '../../../session';
import type { ConsultationStep } from '../../../domain/entities/ClinicalStep.ts';

export class ConsultationController {
	private steps: ConsultationStep[] = [
		'consulta',
		'antecedentes',
		'alergias',
		'farmacos',

	];
	private pasoActual: ConsultationStep;
	private patientID: string;
	private partialState: PartialState;

	constructor(patientID: string) {
		this.patientID = patientID;
		this.pasoActual = 'consulta';
		this.partialState = {};
	}

	nextStep(): void {
		const currentIndex = this.steps.indexOf(this.pasoActual);
		if (currentIndex < this.steps.length - 1) {
			this.pasoActual = this.steps[currentIndex + 1];
		} else {
			this.pasoActual = 'farmacos';
		}
	}

	savePartialState(update: Partial<PartialState>): void {
		this.partialState = { ...this.partialState, ...update };
	}

	getPartialState(): PartialState {
		return this.partialState;
	}

	getCurrentStep(): ConsultationStep {
		return this.pasoActual;
	}
}

