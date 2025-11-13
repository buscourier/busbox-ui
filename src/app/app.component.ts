import { Component, DestroyRef, inject, type OnInit } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Router, RouterOutlet } from '@angular/router';
import { TranslocoService } from '@jsverse/transloco';
import { TuiAlertService, TuiRoot } from '@taiga-ui/core';
import type { Observable } from 'rxjs';

import { FooterComponent } from '@shared/components/footer';
import { HeaderComponent } from '@shared/components/header';
import { LocationsFacade } from '@shared/store';

import { AuthFacade } from '@auth';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, TuiRoot, FooterComponent, HeaderComponent],
  templateUrl: './app.component.html',
  standalone: true,
  styleUrl: './app.component.css',
})
export class AppComponent implements OnInit {
  configName?: string;
  environment?: string;

  private readonly authFacade = inject(AuthFacade);
  private readonly locationsFacade = inject(LocationsFacade);
  private readonly destroyRef = inject(DestroyRef);
  private readonly alerts = inject(TuiAlertService);
  private transloco = inject(TranslocoService);

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

  logout(): void {
    this.authFacade.logout();
  }

  private initializeGlobalData() {
    this.authFacade.initialize();
    this.locationsFacade.loadPickupCities();
    this.locationsFacade.loadOffices();
    this.setupErrorHandling();
  }

  private setupErrorHandling(): void {
    this.locationsFacade
      .getErrorStatus()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((errorStatus) => {
        if (errorStatus.pickupCitiesError) {
          this.showErrorNotification('Не удалось загрузить города отправления');
        }

        if (errorStatus.deliveryCitiesError) {
          this.showErrorNotification('Не удалось загрузить города получения');
        }

        if (errorStatus.officesError) {
          this.showErrorNotification('Не удалось загрузить офисы');
        }
      });
  }

  private showErrorNotification(message: string): void {
    this.alerts
      .open(message, {
        label: this.transloco.translate('alert.labels.error'),
        autoClose: 0,
        appearance: 'error',
      })
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe();
  }

  protected readonly Array = Array;
}
