import { AsyncPipe } from '@angular/common';
import { Component, DestroyRef, inject, type OnInit } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { RouterOutlet } from '@angular/router';
import { TranslocoService } from '@jsverse/transloco';
import { TuiAlertService, TuiRoot } from '@taiga-ui/core';
import type { Observable } from 'rxjs';

import { SeoService } from '@core/services/seo.service';

import { BreadcrumbsComponent } from '@shared/components/breadcrumbs';
import { FooterComponent } from '@shared/components/footer';
import { HeaderComponent } from '@shared/components/header';
import { NavigationComponent } from '@shared/components/navigation';
import { LocationsFacade, DocumentsFacade } from '@shared/store';

import { environment } from '@env/environment';

import { AuthFacade } from '@auth';
import type { AuthResponse } from '@auth/types';

@Component({
  selector: 'app-root',
  imports: [
    RouterOutlet,
    TuiRoot,
    AsyncPipe,
    BreadcrumbsComponent,
    NavigationComponent,
    FooterComponent,
    HeaderComponent,
  ],
  templateUrl: './app.component.html',
  standalone: true,
  styleUrl: './app.component.css',
})
export class AppComponent implements OnInit {
  title$!: Observable<string>;
  description$!: Observable<string | string[]>;

  configName?: string;
  environment?: string;
  apiUrl?: string;

  private readonly authFacade = inject(AuthFacade);
  private readonly locationsFacade = inject(LocationsFacade);
  private readonly documentsFacade = inject(DocumentsFacade);
  private readonly destroyRef = inject(DestroyRef);
  private readonly alerts = inject(TuiAlertService);
  private transloco = inject(TranslocoService);
  private readonly seoService = inject(SeoService);

  currentUser$!: Observable<AuthResponse | null>;

  constructor() {
    this.configName = environment.dopplerConfig;
    this.apiUrl = environment.apiUrl;
  }

  ngOnInit(): void {
    this.title$ = this.seoService.getTitle();
    this.description$ = this.seoService.getDescription();

    this.currentUser$ = this.authFacade.getCurrentUser();
    this.initializeGlobalData();
  }

  logout(): void {
    this.authFacade.logout();
  }

  private initializeGlobalData() {
    this.authFacade.loadCurrentUser();
    this.locationsFacade.loadPickupCities();
    this.locationsFacade.loadOffices();
    this.documentsFacade.loadDocuments();
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
