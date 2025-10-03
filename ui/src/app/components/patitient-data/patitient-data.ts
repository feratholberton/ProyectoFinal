import { Component, inject } from '@angular/core';
import { AsyncPipe } from '@angular/common';
import { LoadPatient, Patient } from '../../services/load-patient';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-patitient-data',
  imports: [AsyncPipe],
  templateUrl: './patitient-data.html',
  styleUrl: './patitient-data.css'
})
export class PatitientData {
  private patient = inject(LoadPatient);
  patient$: Observable<Patient[]> = this.patient.getPatient();
}
