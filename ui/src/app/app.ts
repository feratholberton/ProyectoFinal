import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';

const name:string = 'Elio'

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal(name);
}
