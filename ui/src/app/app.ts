import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Logo } from './components/logo/logo';
import { ConsultationForm } from './components/consultation-form/consultation-form';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Logo, ConsultationForm],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
}
