import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ConsultationForm } from '../consultation-form/consultation-form';

@Component({
  selector: 'app-consultation-flow',
  standalone: true,
  imports: [CommonModule, ConsultationForm],
  template: `
    <div class="consultation-flow">
      <h1>Sistema de Consultas Médicas</h1>
      <app-consultation-form />
    </div>
  `,
  styles: [`
    .consultation-flow {
      min-height: 100vh;
      padding: 2rem;
      background-color: #f5f7fa;
    }

    h1 {
      text-align: center;
      color: #333;
      margin-bottom: 2rem;
    }
  `]
})
export class ConsultationFlow {
  // This component wraps the entire consultation flow
  // The consultation form handles everything automatically:
  // 1. Initial consultation submission
  // 2. Display of options selector
  // 3. Collection of selected options
  // 4. Multi-step flow if backend returns more steps
}
