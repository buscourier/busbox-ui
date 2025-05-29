import { AsyncPipe } from '@angular/common';
import { Component, inject, type OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { TuiRoot } from '@taiga-ui/core';
import type { Observable } from 'rxjs';

import { BreadcrumbsComponent } from '@shared/components/breadcrumbs';

import { environment } from '@env/environment';

import { AuthFacade } from '@auth';
import type { AuthResponse } from '@auth/types';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, TuiRoot, AsyncPipe, BreadcrumbsComponent],
  templateUrl: './app.component.html',
  standalone: true,
  styleUrl: './app.component.css',
})
export class AppComponent implements OnInit {
  title = 'Angular 18 Starter';
  text = 'Добро пожаловать в ваш новый проект!';
  configName?: string;
  environment?: string;
  apiUrl?: string;

  private readonly authFacade = inject(AuthFacade);
  currentUser$!: Observable<AuthResponse | null>;

  constructor() {
    this.configName = environment.dopplerConfig;
    this.apiUrl = environment.apiUrl;
  }

  ngOnInit(): void {
    this.currentUser$ = this.authFacade.getCurrentUser();
    this.loadCurrentUser();
  }

  loadCurrentUser(): void {
    this.authFacade.loadCurrentUser();
  }

  logout(): void {
    this.authFacade.logout();
  }
}
