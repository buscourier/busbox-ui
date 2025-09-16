import { AsyncPipe } from '@angular/common';
import { DestroyRef, type OnInit } from '@angular/core';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { provideTranslocoScope, TranslocoPipe } from '@jsverse/transloco';
import { TuiButton } from '@taiga-ui/core';
import { TuiButtonLoading } from '@taiga-ui/kit';
import { type Observable, take, distinctUntilChanged } from 'rxjs';
import { filter } from 'rxjs/operators';

import { PageContentService } from '@core/services';

import type { SeoMeta } from '@shared/types';

import { AuthFacade } from '@auth';

import { DeliveryLayoutService } from '@delivery/services';

import { BookingFacade } from './booking.facade';
import { StepperComponent } from './stepper';
import { type StepNumber, type BookingViewModel, type Applicant, ApplicantType } from './types';

@Component({
  selector: 'app-booking',
  imports: [RouterOutlet, TuiButton, AsyncPipe, StepperComponent, TranslocoPipe, TuiButtonLoading],
  templateUrl: './booking.component.html',
  styleUrl: './booking.component.css',
  providers: [
    provideTranslocoScope(
      {
        scope: 'features/delivery/booking',
        alias: 'booking',
      },
      {
        scope: 'entities/user',
        alias: 'user',
      },
      {
        scope: 'entities/contacts',
        alias: 'contacts',
      },
      {
        scope: 'entities/document',
        alias: 'document',
      },
    ),
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BookingComponent implements OnInit {
  vm$!: Observable<BookingViewModel>;
  isMainLayout$!: Observable<boolean>;
  applicant$!: Observable<Applicant | null>;
  currentStep$!: Observable<StepNumber>;

  readonly auth = inject(AuthFacade);

  public bookingFacade = inject(BookingFacade);

  private authFacade = inject(AuthFacade);
  private layoutService = inject(DeliveryLayoutService);
  private readonly pageContentService = inject(PageContentService);
  private readonly router = inject(Router);
  private readonly destroyRef = inject(DestroyRef);

  private seoMeta: SeoMeta = {
    title: 'Оформить доставку — заявка онлайн',
    description:
      'Оформите доставку груза онлайн: выбор города, забор курьером, упаковка и страхование. Быстро и удобно.',
    keywords: [
      'оформить доставку',
      'заявка на доставку',
      'оформить отправление',
      'курьерский забор',
      'Баскурьер',
    ],
  };

  get isSuccessPage(): boolean {
    return this.router.url.includes('success');
  }

  get isFailurePage(): boolean {
    return this.router.url.includes('failure');
  }

  ngOnInit(): void {
    this.vm$ = this.bookingFacade.getViewModel();
    this.isMainLayout$ = this.layoutService.getIsMainLayout();
    this.applicant$ = this.bookingFacade.getApplicant();
    this.currentStep$ = this.bookingFacade.getCurrentStep();

    this.bookingFacade.init();

    this.router.events
      .pipe(
        filter((event) => event instanceof NavigationEnd),
        take(1),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe(() => {
        this.pageContentService.setManualSeo(this.seoMeta);
      });

    this.setApplicantType();
  }

  goNextStep(nextStep: StepNumber | null): void {
    if (nextStep) {
      this.bookingFacade.navigateToStep(nextStep);
    }
  }

  goPrevStep(prevStep: StepNumber | null): void {
    if (prevStep) {
      this.bookingFacade.navigateToStep(prevStep);
    }
  }

  submitOrder(): void {
    this.bookingFacade.submitOrder();
  }

  private setApplicantType(): void {
    this.authFacade
      .isAuthenticated()
      .pipe(distinctUntilChanged(), takeUntilDestroyed(this.destroyRef))
      .subscribe((isAuth) => {
        this.bookingFacade.updateApplicantType(
          isAuth ? ApplicantType.LEGAL : ApplicantType.INDIVIDUAL,
        );

        if (isAuth) {
          this.bookingFacade.navigateToStep(2);
        } else {
          this.bookingFacade.navigateToStep(1);
        }
      });
  }

  protected readonly ApplicantType = ApplicantType;
}
