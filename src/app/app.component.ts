import { Component, inject, type OnInit } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { TuiRoot } from '@taiga-ui/core';
import type { Observable } from 'rxjs';

import { FooterComponent } from '@shared/components/footer';
import { HeaderComponent } from '@shared/components/header';

import { LocationsFacade } from '@store';

import { AuthFacade } from '@auth';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, TuiRoot, FooterComponent, HeaderComponent],
  templateUrl: './app.component.html',
  standalone: true,
  styleUrl: './app.component.css',
})
export class AppComponent implements OnInit {
  private readonly authFacade = inject(AuthFacade);
  private readonly locationsFacade = inject(LocationsFacade);

  private readonly router = inject(Router);

  isInitialized$!: Observable<boolean>;

  ngOnInit(): void {
    this.isInitialized$ = this.authFacade.isInitialized();

    this.initializeGlobalData();
  }

  get isContactsPage(): boolean {
    return this.router.url.includes('contacts');
  }

  get isAccountPage(): boolean {
    return this.router.url.includes('account');
  }

  get isCalculatorPage(): boolean {
    return this.router.url.includes('calculator');
  }

  get isDocumentsPage(): boolean {
    return this.router.url.includes('documents');
  }

  get isAuthPage(): boolean {
    return this.router.url.includes('auth');
  }

  get isSuccessPage(): boolean {
    return this.router.url.includes('success');
  }

  get isFailurePage(): boolean {
    return this.router.url.includes('failure');
  }

  get isFeedbackPage(): boolean {
    return this.router.url.includes('feedback');
  }

  get isAuthHeight(): boolean {
    return (
      this.isContactsPage ||
      this.isAccountPage ||
      this.isCalculatorPage ||
      this.isDocumentsPage ||
      this.isAuthPage ||
      this.isFeedbackPage ||
      this.isSuccessPage ||
      this.isFailurePage
    );
  }

  private initializeGlobalData() {
    this.authFacade.initialize();
    this.locationsFacade.loadPickupCities();
    this.locationsFacade.loadOffices();
  }
}
