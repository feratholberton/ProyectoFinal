import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { SymptomOnsetQuestion } from '../../models/intake.models';

interface RedFlagsAnswerEvent {
  id: string;
  value: string;
}

@Component({
  selector: 'app-red-flags-section',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './red-flags-section.component.html',
  styleUrls: ['./red-flags-section.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class RedFlagsSectionComponent {
  questions = input.required<ReadonlyArray<SymptomOnsetQuestion>>();
  isSaving = input(false);
  saveMessage = input<string | null>(null);
  saveError = input<string | null>(null);

  answerChange = output<RedFlagsAnswerEvent>();
  saveConfirmed = output<void>();

  protected onInputChange(question: SymptomOnsetQuestion, value: string): void {
    this.answerChange.emit({ id: question.id, value });
  }

  protected onSave(): void {
    this.saveConfirmed.emit();
  }

  /**
   * Extracts the Yes/No value from a composite answer like "Sí|details" or plain "No"
   */
  protected getYesNoValue(answer: string): 'Sí' | 'No' | '' {
    if (!answer) return '';
    if (answer.includes('|')) {
      return answer.split('|')[0] as 'Sí' | 'No';
    }
    return answer === 'Sí' || answer === 'No' ? answer : '';
  }

  /**
   * Extracts the details value from a composite answer like "Sí|details"
   */
  protected getDetailsValue(answer: string): string {
    if (!answer || !answer.includes('|')) return '';
    return answer.split('|')[1] || '';
  }

  /**
   * Handles Yes/No radio button changes
   */
  protected onYesNoChange(question: SymptomOnsetQuestion, yesNo: 'Sí' | 'No'): void {
    if (yesNo === 'No') {
      // If user selects No, just store "No"
      this.answerChange.emit({ id: question.id, value: 'No' });
    } else {
      // If user selects Yes, preserve existing details or start with empty details
      const existingDetails = this.getDetailsValue(question.answer);
      const newValue = existingDetails ? `Sí|${existingDetails}` : 'Sí';
      this.answerChange.emit({ id: question.id, value: newValue });
    }
  }

  /**
   * Handles details input changes (text or number)
   */
  protected onDetailsChange(question: SymptomOnsetQuestion, details: string): void {
    // Always combine with "Sí" since details are only shown when Yes is selected
    const newValue = details ? `Sí|${details}` : 'Sí';
    this.answerChange.emit({ id: question.id, value: newValue });
  }
}
