import { Component, inject, signal, viewChild, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ConsultationService, ConsultationResponse } from '../../services/consultation.service';
import { OptionsSelector } from '../options-selector/options-selector';
import { NextStep } from '../next-step/next-step';

@Component({
  selector: 'app-consultation-form',
  standalone: true,
  imports: [CommonModule, FormsModule, OptionsSelector, NextStep],
  templateUrl: './consultation-form.html',
  styleUrl: './consultation-form.css'
})
export class ConsultationForm {
  private consultationService = inject(ConsultationService);
  
  // References to both components
  optionsSelector = viewChild(OptionsSelector);
  nextStepComponent = viewChild(NextStep);
  
  motivoConsulta = signal('');
  edad = signal<number | null>(null);
  genero = signal('');
  isLoading = signal(false);
  error = signal<string | null>(null);
  response = signal<ConsultationResponse | null>(null);
  showOptionsSelector = signal(false);
  showNextStep = signal(false);

  constructor() {
    // Effect to load data when both selector is ready and we have response
    effect(() => {
      const selector = this.optionsSelector();
      const responseData = this.response();
      
      if (selector && responseData && responseData.opciones && this.showOptionsSelector()) {
        console.log('Loading data into first step selector:', responseData);
        selector.loadData(responseData);
      }
    });
  }

  onSubmit() {
    if (!this.motivoConsulta().trim()) {
      this.error.set('Por favor, ingrese el motivo de consulta');
      return;
    }

    if (!this.edad() || this.edad()! <= 0) {
      this.error.set('Por favor, ingrese una edad válida');
      return;
    }

    if (!this.genero()) {
      this.error.set('Por favor, seleccione el género');
      return;
    }

    this.isLoading.set(true);
    this.error.set(null);
    this.response.set(null);

    this.consultationService.startConsultation(
      this.motivoConsulta(),
      this.edad()!,
      this.genero()
    ).subscribe({
      next: (result) => {
        console.log('Consultation started successfully:', result);
        this.response.set(result);
        this.isLoading.set(false);
        
        // Show the options selector - the effect will load the data
        if (result.opciones && result.opciones.length > 0) {
          this.showOptionsSelector.set(true);
        }
      },
      error: (err) => {
        console.error('Error starting consultation:', err);
        this.error.set('Error al iniciar la consulta. Por favor, intente nuevamente.');
        this.isLoading.set(false);
      }
    });
  }

  onDataSubmitted(patientID: string) {
    console.log('First step submitted, loading next step for patient:', patientID);
    // Hide the first step
    this.showOptionsSelector.set(false);
    // Show the next step component
    this.showNextStep.set(true);
    
    // Load the next step
    const nextStep = this.nextStepComponent();
    if (nextStep) {
      nextStep.loadStep(patientID);
    }
  }

  resetForm() {
    this.motivoConsulta.set('');
    this.edad.set(null);
    this.genero.set('');
    this.response.set(null);
    this.showOptionsSelector.set(false);
    this.error.set(null);
  }

  updateMotivoConsulta(value: string) {
    this.motivoConsulta.set(value);
  }

  updateEdad(value: string) {
    const edad = parseInt(value, 10);
    this.edad.set(isNaN(edad) ? null : edad);
  }

  updateGenero(value: string) {
    this.genero.set(value);
  }
}
