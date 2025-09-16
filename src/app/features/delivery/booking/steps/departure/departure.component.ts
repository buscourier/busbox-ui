import { AsyncPipe } from '@angular/common';
import type { OnInit } from '@angular/core';
import { ChangeDetectionStrategy, Component, DestroyRef, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { provideTranslocoScope, TranslocoPipe } from '@jsverse/transloco';
import { tuiTakeUntilDestroyed } from '@taiga-ui/cdk';
import { TuiIcon } from '@taiga-ui/core';
import { take, withLatestFrom, combineLatest } from 'rxjs';
import type { Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';

import { AuthFacade } from '@auth';

import { PickupPointComponent, PickupPointFacade } from '@delivery/pickup-point';

import { BookingFacade } from '../../booking.facade';
import {
  type Departure,
  IndividualType,
  type Sender,
  SenderDocument,
  type StepNumber,
} from '../../types';

import { ConfidantsComponent } from './confidants';
import { SenderComponent } from './sender';

@Component({
  selector: 'app-departure',
  imports: [
    SenderComponent,
    PickupPointComponent,
    AsyncPipe,
    TuiIcon,
    TranslocoPipe,
    ConfidantsComponent,
  ],
  templateUrl: './departure.component.html',
  styleUrl: './departure.component.css',
  providers: [
    provideTranslocoScope({
      scope: 'features/delivery/pickup-point',
      alias: 'pickupPoint',
    }),
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DepartureComponent implements OnInit {
  currentStep$!: Observable<StepNumber>;
  departure$!: Observable<Departure | null>;

  readonly auth = inject(AuthFacade);

  private isSenderValid = false;
  private isPickupPointValid = false;

  private readonly destroyRef = inject(DestroyRef);
  private readonly bookingFacade = inject(BookingFacade);
  private readonly pickupPointFacade = inject(PickupPointFacade);

  ngOnInit(): void {
    this.currentStep$ = this.bookingFacade.getCurrentStep();
    this.departure$ = this.bookingFacade.getDeparture();

    this.pickupPointFacade
      .getFormState()
      .pipe(withLatestFrom(this.currentStep$), takeUntilDestroyed(this.destroyRef))
      .subscribe(([formState]) => {
        this.isPickupPointValid = formState.valid;
        this.checkStepValidation();
      });

    combineLatest([
      this.bookingFacade.getApplicant().pipe(
        filter(Boolean),
        map((applicant) => applicant.individual),
      ),
      this.departure$,
    ])
      .pipe(take(1), tuiTakeUntilDestroyed(this.destroyRef))
      .subscribe(([individual, departure]) => {
        if (individual?.role.value === IndividualType.SENDER) {
          this.updateSender({
            fullName: `${individual.lastName} ${individual.firstName} ${individual.middleName}`,
            document: departure?.sender?.document || {
              value: SenderDocument.PASSPORT,
              label: 'Паспорт',
            },
            documentNumber: departure?.sender?.documentNumber || '',
            phone: individual.phone,
          });
        }
      });
  }

  updateSender(data: Sender): void {
    this.bookingFacade.updateSender(data);
  }

  onSenderValidationChange(isValid: boolean): void {
    this.isSenderValid = isValid;
    this.checkStepValidation();
  }

  private checkStepValidation(): void {
    const isStepValid = this.isSenderValid && this.isPickupPointValid;

    this.currentStep$.pipe(take(1)).subscribe((currentStep) => {
      this.bookingFacade.updateStepValidation(isStepValid, currentStep);
    });
  }
}
