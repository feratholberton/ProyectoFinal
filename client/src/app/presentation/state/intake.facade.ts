import { Injectable, WritableSignal, computed, inject, signal } from '@angular/core';
import { FormGroup, Validators } from '@angular/forms';
import {
  ConfirmAllergiesUseCase,
  ConfirmAntecedentsUseCase,
  RequestAllergySuggestionsUseCase,
  SaveCharacteristicsUseCase,
  SaveEvaluationUseCase,
  SaveLocationUseCase,
  SavePriorTherapiesUseCase,
  SaveRedFlagsUseCase,
  SaveSymptomOnsetUseCase,
  StartIntakeUseCase
} from '../../application/use-cases/intake';
import { QuestionStepResult, RedFlagsStepResult, StartIntakeResult } from '../../application/dto/intake.dto';
import { Gender, IntakeQuestion } from '../../domain/models/intake';
import { extractAntecedents, extractErrorMessage } from '../../utils/app-helpers';
import { QuestionSection, SelectionGroup } from './intake-helpers';
import { IntakeFormControls, IntakeFormService } from './intake-form.service';
import {
  START_INTAKE_USE_CASE,
  CONFIRM_ANTECEDENTS_USE_CASE,
  REQUEST_ALLERGY_SUGGESTIONS_USE_CASE,
  CONFIRM_ALLERGIES_USE_CASE,
  SAVE_SYMPTOM_ONSET_USE_CASE,
  SAVE_EVALUATION_USE_CASE,
  SAVE_LOCATION_USE_CASE,
  SAVE_CHARACTERISTICS_USE_CASE,
  SAVE_PRIOR_THERAPIES_USE_CASE,
  SAVE_RED_FLAGS_USE_CASE
} from '../../application/use-cases/intake/intake-use-cases.tokens';

@Injectable({ providedIn: 'root' })
export class IntakeFacade {
  public readonly genders = signal<Gender[]>(['Masculino', 'Femenino']);
  public readonly isSubmitting = signal(false);
  public readonly submissionError = signal<string | null>(null);
  public readonly submissionResult = signal<StartIntakeResult | null>(null);

  public readonly antecedentGroup = new SelectionGroup();
  public readonly allergyGroup = new SelectionGroup();

  // Antecedent signals
  public readonly antecedentOptions = this.antecedentGroup.options;
  public readonly selectedAntecedents = this.antecedentGroup.selected;
  public readonly customAntecedentText = this.antecedentGroup.customText;
  public readonly canRequestMoreOptions = this.antecedentGroup.canRequestMore;
  public readonly isSavingAntecedents = this.antecedentGroup.isSaving;
  public readonly antecedentSaveMessage = this.antecedentGroup.saveMessage;
  public readonly antecedentSaveError = this.antecedentGroup.saveError;

  // Allergy signals
  public readonly allergyOptions = this.allergyGroup.options;
  public readonly selectedAllergies = this.allergyGroup.selected;
  public readonly customAllergyText = this.allergyGroup.customText;
  public readonly canRequestMoreAllergies = this.allergyGroup.canRequestMore;
  public readonly isFetchingAllergies = this.allergyGroup.isFetching;
  public readonly isSavingAllergies = this.allergyGroup.isSaving;
  public readonly allergySaveMessage = this.allergyGroup.saveMessage;
  public readonly allergySaveError = this.allergyGroup.saveError;
  public readonly hasSavedAllergies = signal(false);

  // Question Sections
  public readonly symptomOnsetSection: QuestionSection<QuestionStepResult>;
  public readonly evaluationSection: QuestionSection<QuestionStepResult>;
  public readonly locationSection: QuestionSection<QuestionStepResult>;
  public readonly characteristicsSection: QuestionSection<QuestionStepResult>;
  public readonly priorTherapiesSection: QuestionSection<QuestionStepResult>;
  public readonly redFlagsSection: QuestionSection<RedFlagsStepResult>;

  public readonly reviewSummary = signal<string | null>(null);
  public readonly naturalSummary = signal<string | null>(null);
  public readonly isCopyingReview = signal(false);
  public readonly copyMessage = signal<string | null>(null);
  public readonly copyError = signal<string | null>(null);

  public readonly intakeForm: FormGroup<IntakeFormControls>;

  private readonly formService = inject(IntakeFormService);
  private readonly startIntakeUseCase = inject(START_INTAKE_USE_CASE);
  private readonly confirmAntecedentsUseCase = inject(CONFIRM_ANTECEDENTS_USE_CASE);
  private readonly requestAllergySuggestionsUseCase = inject(REQUEST_ALLERGY_SUGGESTIONS_USE_CASE);
  private readonly confirmAllergiesUseCase = inject(CONFIRM_ALLERGIES_USE_CASE);
  
  constructor() {
    this.intakeForm = this.formService.createIntakeForm();

    const saveSymptomOnsetUseCase = inject(SAVE_SYMPTOM_ONSET_USE_CASE);
    const saveEvaluationUseCase = inject(SAVE_EVALUATION_USE_CASE);
    const saveLocationUseCase = inject(SAVE_LOCATION_USE_CASE);
    const saveCharacteristicsUseCase = inject(SAVE_CHARACTERISTICS_USE_CASE);
    const savePriorTherapiesUseCase = inject(SAVE_PRIOR_THERAPIES_USE_CASE);
    const saveRedFlagsUseCase = inject(SAVE_RED_FLAGS_USE_CASE);

    this.symptomOnsetSection = new QuestionSection(saveSymptomOnsetUseCase, { form: this.intakeForm });
    this.evaluationSection = new QuestionSection(saveEvaluationUseCase, { form: this.intakeForm });
    this.locationSection = new QuestionSection(saveLocationUseCase, { form: this.intakeForm });
    this.characteristicsSection = new QuestionSection(saveCharacteristicsUseCase, { form: this.intakeForm });
    this.priorTherapiesSection = new QuestionSection(savePriorTherapiesUseCase, { form: this.intakeForm });
    this.redFlagsSection = new QuestionSection(saveRedFlagsUseCase, { form: this.intakeForm }, (result) => {
      if (result.reviewSummary) {
        this.reviewSummary.set(result.reviewSummary);
      }

      const aiNote = (result as RedFlagsStepResult).naturalSummary;
      if (typeof aiNote === 'string' && aiNote.trim().length > 0) {
        this.naturalSummary.set(aiNote);
        const current = this.reviewSummary() ?? '';
        const appended = current
          ? `${current}\n\nResumen Final: ${aiNote}`
          : `Resumen Final: ${aiNote}`;
        this.reviewSummary.set(appended);
      }
    });
  }

  /**
   * Gets validated form values with age guaranteed to be a number
   * @throws Error if age is null
   */
  private getValidatedFormValue(): { age: number; gender: Gender; chiefComplaint: string } {
    const rawValue = this.intakeForm.getRawValue();
    if (rawValue.age === null) {
      throw new Error('Age is required');
    }
    return {
      age: rawValue.age,
      gender: rawValue.gender,
      chiefComplaint: rawValue.chiefComplaint
    };
  }

  public async submit(): Promise<void> {
    if (!this.formService.isFormValid(this.intakeForm)) {
      return;
    }

    await this.fetchAntecedents({ resetState: true });
  }

  public resetForm(): void {
    this.formService.resetForm(this.intakeForm);
    this.resetWorkflowState();
  }

  public async requestMoreAntecedents(): Promise<void> {
    if (this.isSubmitting()) {
      return;
    }

    this.antecedentGroup.clearMessages();

    if (!this.antecedentGroup.canRequestMore()) {
      return;
    }

    if (!this.submissionResult()) {
      await this.fetchAntecedents({ resetState: true });
      return;
    }

    await this.fetchAntecedents({ resetState: false });
  }

  public addCustomAntecedent(): void {
    this.antecedentGroup.addCustomValue();
  }

  public updateCustomAntecedentText(value: string): void {
    this.antecedentGroup.customText.set(value);
  }

  public removeCustomAntecedent(value: string): void {
    this.antecedentGroup.removeCustomValue(value);
  }

  public onAntecedentToggle(option: string, checked: boolean): void {
    this.antecedentGroup.toggleSelection(option, checked);
  }

  public onAllergyToggle(option: string, checked: boolean): void {
    this.allergyGroup.toggleSelection(option, checked);
  }

  public async saveConfirmedAntecedents(): Promise<void> {
    const selected = Array.from(this.selectedAntecedents());
    if (selected.length === 0) {
      this.antecedentSaveError.set('Selecciona al menos un antecedente para guardar.');
      this.antecedentSaveMessage.set(null);
      return;
    }

    this.isSavingAntecedents.set(true);
    this.antecedentSaveMessage.set(null);
    this.antecedentSaveError.set(null);
    this.hasSavedAllergies.set(false);

    try {
      const formValue = this.getValidatedFormValue();
      const response = await this.confirmAntecedentsUseCase.execute({
        ...formValue,
        selectedAntecedents: selected
      });

      this.allergyGroup.syncSelection(response.suggestedAllergies, response.record.selectedAllergies);

      const baseMessage = response.message;
      const allergyDetails =
        response.suggestedAllergies.length > 0
          ? ` Alergias sugeridas: ${response.suggestedAllergies.join(', ')}.`
          : ' No se sugirieron alergias.';
      this.antecedentSaveMessage.set(`${baseMessage}${allergyDetails}`);
    } catch (error) {
      const genericFailure = 'Unable to save the confirmed antecedents. Please try again.';
      const rawMessage = extractErrorMessage(error);
      const message = rawMessage === 'Unable to submit the intake information. Please try again.' ? genericFailure : rawMessage;
      this.antecedentSaveError.set(message);
    } finally {
      this.isSavingAntecedents.set(false);
    }
  }

  public addCustomAllergy(): void {
    this.allergyGroup.addCustomValue();
  }

  public updateCustomAllergyText(value: string): void {
    this.allergyGroup.customText.set(value);
  }

  public removeCustomAllergy(value: string): void {
    this.allergyGroup.removeCustomValue(value);
  }

  public async requestMoreAllergies(): Promise<void> {
    await this.allergyGroup.requestMoreOptions(
      () => this.requestAllergySuggestionsUseCase.execute({
        ...this.getValidatedFormValue(),
        selectedAntecedents: Array.from(this.selectedAntecedents()),
        selectedAllergies: Array.from(this.selectedAllergies()),
        excludeAllergies: Array.from(this.allergyGroup.seen())
      }),
      (response) => response.suggestedAllergies,
      (response) => ({
        suggested: response.record.suggestedAllergies,
        selected: response.record.selectedAllergies
      }),
      (response) => response.message
    );
  }

  public updateSymptomOnsetAnswer(id: string, value: string): void {
    this.symptomOnsetSection.updateAnswer(id, value);
  }

  public async saveSymptomOnset(): Promise<void> {
    await this.symptomOnsetSection.save(this.evaluationSection.questions);
  }

  public updateEvaluationAnswer(id: string, value: string): void {
    this.evaluationSection.updateAnswer(id, value);
  }

  public async saveEvaluation(): Promise<void> {
    await this.evaluationSection.save(this.locationSection.questions);
  }

  public updateLocationAnswer(id: string, value: string): void {
    this.locationSection.updateAnswer(id, value);
  }

  public async saveLocation(): Promise<void> {
    await this.locationSection.save(this.characteristicsSection.questions);
  }

  public updateCharacteristicsAnswer(id: string, value: string): void {
    this.characteristicsSection.updateAnswer(id, value);
  }

  public async saveCharacteristics(): Promise<void> {
    await this.characteristicsSection.save(this.priorTherapiesSection.questions);
  }

  public updatePriorTherapiesAnswer(id: string, value: string): void {
    this.priorTherapiesSection.updateAnswer(id, value);
  }

  public async savePriorTherapies(): Promise<void> {
    await this.priorTherapiesSection.save(this.redFlagsSection.questions);
  }

  public updateRedFlagsAnswer(id: string, value: string): void {
    this.redFlagsSection.updateAnswer(id, value);
  }

  public async saveRedFlags(): Promise<void> {
    await this.redFlagsSection.save();
  }

  public async copyReviewToClipboard(): Promise<void> {
    const content = this.reviewSummary() ?? '';
    if (!content) {
      this.copyError.set('No hay contenido para copiar.');
      this.copyMessage.set(null);
      return;
    }
    this.isCopyingReview.set(true);
    this.copyMessage.set(null);
    this.copyError.set(null);
    try {
      if (navigator?.clipboard?.writeText) {
        await navigator.clipboard.writeText(content);
      } else {
        // Fallback: create a temporary textarea
        const ta = document.createElement('textarea');
        ta.value = content;
        ta.style.position = 'fixed';
        ta.style.left = '-1000px';
        document.body.appendChild(ta);
        ta.focus();
        ta.select();
        document.execCommand('copy');
        document.body.removeChild(ta);
      }
      this.copyMessage.set('Contenido copiado al portapapeles.');
    } catch (e) {
      this.copyError.set('No se pudo copiar el contenido.');
    } finally {
      this.isCopyingReview.set(false);
    }
  }

  public async saveConfirmedAllergies(): Promise<void> {
    await this.allergyGroup.saveConfirmation(
      (selections) => this.confirmAllergiesUseCase.execute({
        ...this.getValidatedFormValue(),
        selectedAntecedents: Array.from(this.selectedAntecedents()),
        selectedAllergies: selections
      }),
      (response) => ({
        suggested: response.record.suggestedAllergies,
        selected: response.record.selectedAllergies
      }),
      (response) => response.message,
      {
        emptyError: 'Selecciona o agrega al menos una alergia antes de guardar.',
        onSuccess: (response) => {
          this.hasSavedAllergies.set(true);
          this.resetQuestionWorkflowState();
          if (response.symptomOnsetQuestions && response.symptomOnsetQuestions.length > 0) {
            this.symptomOnsetSection.questions.set(response.symptomOnsetQuestions.map(q => ({ ...q, answer: '' })));
          }
        }
      }
    );
  }

  private async fetchAntecedents({ resetState }: { resetState: boolean }): Promise<void> {
    this.isSubmitting.set(true);
    this.submissionError.set(null);
    this.antecedentGroup.clearMessages();

    if (resetState) {
      this.resetWorkflowState();
    }

    try {
      const basePayload = this.getValidatedFormValue();
      const selectedAntecedents = Array.from(this.selectedAntecedents());
      const seenList = Array.from(this.antecedentGroup.seen());
      const excludeAntecedents = resetState
        ? []
        : seenList.slice(Math.max(0, seenList.length - 32));
      const payloadBase = { ...basePayload, selectedAntecedents };
      const payload =
        excludeAntecedents.length > 0 ? { ...payloadBase, excludeAntecedents } : payloadBase;

      const response = await this.startIntakeUseCase.execute(payload);

      const antecedents = extractAntecedents(response.answer);
      const previousSeen = resetState ? new Set<string>() : new Set(this.antecedentGroup.seen());
      const newSuggestions = antecedents.filter((item) => !previousSeen.has(item));
      const rawOptions = newSuggestions.length > 0 ? newSuggestions : antecedents;
      const uniqueOptions = rawOptions.filter((item, index, arr) => arr.indexOf(item) === index).slice(0, 8);
      const updatedSeen = new Set(previousSeen);
      uniqueOptions.forEach((item) => updatedSeen.add(item));

      const currentOptions = resetState ? [] : this.antecedentOptions();
      const mergedOptions = resetState
        ? uniqueOptions
        : [
            ...currentOptions,
            ...uniqueOptions.filter((item) => !currentOptions.includes(item))
          ];
      const cappedOptions = mergedOptions.slice(0, 24);

      this.antecedentOptions.set(cappedOptions);
      this.antecedentGroup.seen.set(updatedSeen);
      this.submissionResult.set(response);

      if (!resetState) {
        this.antecedentGroup.additionalFetches.update((count) => Math.min(count + 1, 2));
      }
    } catch (error) {
      const message = extractErrorMessage(error);
      this.submissionError.set(message);
    } finally {
      this.isSubmitting.set(false);
    }
  }

  private resetWorkflowState(): void {
    this.submissionError.set(null);
    this.submissionResult.set(null);
    this.antecedentGroup.reset();
    this.allergyGroup.reset();
    this.resetQuestionWorkflowState();
    this.resetReviewState();
    this.hasSavedAllergies.set(false);
  }

  private resetQuestionWorkflowState(): void {
    this.symptomOnsetSection.reset();
    this.evaluationSection.reset();
    this.locationSection.reset();
    this.characteristicsSection.reset();
    this.priorTherapiesSection.reset();
    this.redFlagsSection.reset();
  }

  private resetReviewState(): void {
    this.reviewSummary.set(null);
    this.isCopyingReview.set(false);
    this.copyMessage.set(null);
    this.copyError.set(null);
  }
}
