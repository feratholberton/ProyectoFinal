import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ConsultationService } from '../../services/consultation.service';

@Component({
  selector: 'app-consultation-form',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './consultation-form.html',
  styleUrl: './consultation-form.css'
})
export class ConsultationForm {
  private consultationService = inject(ConsultationService);
  
  motivoConsulta = signal('');
  edad = signal<number | null>(null);
  genero = signal('');
  isLoading = signal(false);
  error = signal<string | null>(null);
  response = signal<any>(null);

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
        // Reset form or navigate to another page
        // this.motivoConsulta.set('');
        // this.edad.set(null);
        // this.genero.set('');
      },
      error: (err) => {
        console.error('Error starting consultation:', err);
        this.error.set('Error al iniciar la consulta. Por favor, intente nuevamente.');
        this.isLoading.set(false);
      }
    });
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
