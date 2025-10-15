import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Logo } from './components/logo/logo';
import { PatientData } from './components/patient-data/patient-data';
import { PatientBackground } from './components/patient-background/patient-background';
import { ConsultationForm } from './components/consultation-form/consultation-form';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Logo, PatientData, PatientBackground, ConsultationForm],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
}
