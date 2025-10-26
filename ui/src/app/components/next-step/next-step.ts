import { Component, inject, signal, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ConsultationService, Opcion } from '../../services/consultation.service';

@Component({
  selector: 'app-next-step',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './next-step.html',
  styleUrl: './next-step.css'
})
export class NextStep {
  private consultationService = inject(ConsultationService);
  
  patientID = signal('');
  pasoActual = signal('');
  opciones = signal<Opcion[]>([]);
  previousSelections = signal<Opcion[]>([]);
  additional = signal('');
  isLoading = signal(false);
  error = signal<string | null>(null);

  loadStep(patientID: string) {
    console.log('🆕 NextStep: Loading step for patient:', patientID);
    this.patientID.set(patientID);
    this.isLoading.set(true);
    this.error.set(null);

    // Step 1: Get consulta
    this.consultationService.getConsulta(patientID).subscribe({
      next: (consultaResult) => {
        console.log('🆕 NextStep: Consulta result:', consultaResult);
        this.previousSelections.set([...consultaResult.partialState.opciones]);
        this.pasoActual.set(consultaResult.pasoActual);

        // Step 2: Get generator options
        this.consultationService.getGenerator(patientID).subscribe({
          next: (generatorResult) => {
            console.log('🆕 NextStep: Generator result:', generatorResult);
            console.log('🆕 NextStep: Setting', generatorResult.opciones.length, 'opciones');
            
            const newOpciones = generatorResult.opciones.map(opt => ({
              label: opt.label,
              checked: opt.checked
            }));
            
            this.opciones.set(newOpciones);
            this.isLoading.set(false);
            
            console.log('🆕 NextStep: State after load:', {
              pasoActual: this.pasoActual(),
              opcionesCount: this.opciones().length,
              previousSelectionsCount: this.previousSelections().length
            });
          },
          error: (err) => {
            console.error('🆕 NextStep: Generator error:', err);
            this.error.set('Error al obtener las opciones');
            this.isLoading.set(false);
          }
        });
      },
      error: (err) => {
        console.error('🆕 NextStep: Consulta error:', err);
        this.error.set('Error al obtener el estado de la consulta');
        this.isLoading.set(false);
      }
    });
  }

  toggleOption(index: number) {
    const options = [...this.opciones()];
    options[index].checked = !options[index].checked;
    this.opciones.set(options);
  }

  updateAdditional(value: string) {
    this.additional.set(value);
  }

  getSelectedOptions(): string[] {
    return this.opciones()
      .filter(option => option.checked)
      .map(option => option.label);
  }

  onSubmit() {
    console.log('🆕 NextStep: Submit called');
    const selectedOptions = this.getSelectedOptions();
    
    if (selectedOptions.length === 0) {
      this.error.set('Por favor, seleccione al menos una opción');
      return;
    }

    this.isLoading.set(true);
    this.error.set(null);

    this.consultationService.collectData(
      this.patientID(),
      selectedOptions,
      this.additional()
    ).subscribe({
      next: (result) => {
        console.log('🆕 NextStep: Data collected, loading next step...');
        // Load the next step
        this.loadStep(this.patientID());
      },
      error: (err) => {
        console.error('🆕 NextStep: Collect error:', err);
        this.error.set('Error al enviar los datos');
        this.isLoading.set(false);
      }
    });
  }

  hasData(): boolean {
    return this.opciones().length > 0;
  }
}
