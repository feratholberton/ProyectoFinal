import { Component, inject, signal, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ConsultationService, Opcion, ConsultationResponse } from '../../services/consultation.service';

@Component({
  selector: 'app-options-selector',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './options-selector.html',
  styleUrl: './options-selector.css'
})
export class OptionsSelector {
  private consultationService = inject(ConsultationService);
  
  // Input from parent component (if needed)
  consultationData = input<ConsultationResponse | null>(null);
  
  // Output event when data is successfully submitted
  dataSubmitted = output<any>();
  
  patientID = signal('');
  pasoActual = signal('');
  opciones = signal<Opcion[]>([]);
  additional = signal('');
  isLoading = signal(false);
  error = signal<string | null>(null);
  
  // Method to load consultation response data
  loadData(data: ConsultationResponse) {
    console.log('OptionsSelector.loadData called with:', data);
    this.patientID.set(data.patientID);
    this.pasoActual.set(data.pasoActual);
    this.opciones.set([...data.opciones]);
    this.error.set(null);
    console.log('OptionsSelector state after load:', {
      patientID: this.patientID(),
      pasoActual: this.pasoActual(),
      opciones: this.opciones(),
      hasData: this.hasData()
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
        console.log('Data collected successfully:', result);
        this.isLoading.set(false);
        this.dataSubmitted.emit(result);
        
        // If the response contains new step data, load it
        if (result['patientID'] && result['opciones']) {
          this.loadData(result as ConsultationResponse);
        }
      },
      error: (err) => {
        console.error('Error collecting data:', err);
        this.error.set('Error al enviar los datos. Por favor, intente nuevamente.');
        this.isLoading.set(false);
      }
    });
  }

  hasData(): boolean {
    return this.opciones().length > 0;
  }
}
