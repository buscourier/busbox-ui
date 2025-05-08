import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { TuiRoot } from '@taiga-ui/core';

import { environment } from '@env/environment';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, TuiRoot],
  templateUrl: './app.component.html',
  standalone: true,
  styleUrl: './app.component.css',
})
export class AppComponent {
  title = 'Angular 18 Starter';
  text = 'Добро пожаловать в ваш новый проект!';
  configName?: string;
  environment?: string;
  apiUrl?: string;

  constructor() {
    this.configName = environment.dopplerConfig;
    this.apiUrl = environment.apiUrl;
    console.log('production', environment.production);
  }
}
