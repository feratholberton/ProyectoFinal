import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Logo } from './components/logo/logo';

const name:string = 'Datos del paciente'
const age:number = 50
const gender:string = 'Masculino'

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Logo],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal(name);
  protected readonly age = signal(age);
  protected readonly gender = signal(gender);
}
