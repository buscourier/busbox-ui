import { AsyncPipe } from '@angular/common';
import type { OnInit } from '@angular/core';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { TranslocoPipe } from '@jsverse/transloco';
import { TuiButton } from '@taiga-ui/core';
import type { Observable } from 'rxjs';

import { BookingFacade } from '../../booking.facade';
import { type Applicant, ApplicantType, type Individual, type StepNumber } from '../../types';

import { ApplicantTabs } from './applicant.constants';
import { IndividualComponent } from './individual';

@Component({
  selector: 'app-applicant',
  imports: [AsyncPipe, IndividualComponent, TuiButton, TranslocoPipe, RouterLink],
  templateUrl: './applicant.component.html',
  styleUrl: './applicant.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ApplicantComponent implements OnInit {
  currentStep$!: Observable<StepNumber>;
  applicant$!: Observable<Applicant | null>;

  protected readonly tabs = ApplicantTabs;

  private readonly bookingFacade = inject(BookingFacade);
  private readonly router = inject(Router);

  ngOnInit(): void {
    this.currentStep$ = this.bookingFacade.getCurrentStep();
    this.applicant$ = this.bookingFacade.getApplicant();
  }

  updateIndividual(data: Individual): void {
    this.bookingFacade.updateIndividual(data);
  }

  updateApplicantType(type: ApplicantType): void {
    this.bookingFacade.updateApplicantType(type);
  }

  updateStepValidation(isValid: boolean, step: StepNumber): void {
    this.bookingFacade.updateStepValidation(isValid, step);
  }

  protected readonly ApplicantType = ApplicantType;

  navigateToLogin() {
    this.router.navigate(['/auth/login'], {
      queryParams: { returnUrl: this.router.url },
    });
  }
}
