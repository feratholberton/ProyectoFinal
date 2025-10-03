import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Logo } from './components/logo/logo';
import { PatitientData } from './components/patitient-data/patitient-data';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Logo, PatitientData],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
}
