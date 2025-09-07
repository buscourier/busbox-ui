import { ChangeDetectionStrategy, Component, DestroyRef, inject, type OnInit } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import {
  FormBuilder,
  type FormControl,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { TuiTextfieldComponent } from '@taiga-ui/core';
import { TuiCheckbox, TuiTextarea, TuiTextareaLimit } from '@taiga-ui/kit';
import {
  debounceTime,
  distinctUntilChanged,
  filter,
  merge,
  type Observable,
  tap,
  withLatestFrom,
} from 'rxjs';
import { map } from 'rxjs/operators';

import { BookingFacade } from '../../../booking.facade';
import type { ReviewConfirmation, StepNumber } from '../../../types';

import type {
  ReviewConfirmationControlValues,
  ReviewConfirmationForm,
} from './review-confirmation.types';

@Component({
  selector: 'app-review-confirmation',
  imports: [
    FormsModule,
    TuiCheckbox,
    ReactiveFormsModule,
    TuiTextarea,
    TuiTextareaLimit,
    TuiTextfieldComponent,
  ],
  templateUrl: './review-confirmation.component.html',
  styleUrl: './review-confirmation.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ReviewConfirmationComponent implements OnInit {
  currentStep$!: Observable<StepNumber>;
  reviewConfirmation$!: Observable<ReviewConfirmation>;

  form!: ReviewConfirmationForm;

  private readonly fb = inject(FormBuilder);
  private readonly destroyRef = inject(DestroyRef);

  private readonly bookingFacade = inject(BookingFacade);

  get comment(): FormControl<string | null> {
    return this.form.controls.comment;
  }

  get rulesAccepted(): FormControl<boolean> {
    return this.form.controls.rulesAccepted;
  }

  get processingAccepted(): FormControl<boolean> {
    return this.form.controls.processingAccepted;
  }

  ngOnInit(): void {
    this.reviewConfirmation$ = this.bookingFacade.getReviewConfirmation();
    this.currentStep$ = this.bookingFacade.getCurrentStep();

    this.initializeForm();
    this.setupFormSync();
    this.setupFormValidation();
    this.setupStoreSync();
  }

  initializeForm(): void {
    this.form = this.fb.group({
      comment: this.fb.control<string | null>(null, [
        Validators.minLength(3),
        Validators.maxLength(100),
      ]),
      rulesAccepted: this.fb.control(false, {
        nonNullable: true,
        validators: [Validators.requiredTrue],
      }),
      processingAccepted: this.fb.control(false, {
        nonNullable: true,
        validators: [Validators.requiredTrue],
      }),
    });
  }

  private setupFormSync(): void {
    const formChanges$ = merge(
      this.comment.valueChanges.pipe(
        filter(Boolean),
        map((comment) => ({ comment })),
      ),
      this.rulesAccepted.valueChanges.pipe(map((rulesAccepted) => ({ rulesAccepted }))),
      this.processingAccepted.valueChanges.pipe(
        map((processingAccepted) => ({ processingAccepted })),
      ),
    );

    formChanges$.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((reviewData) => {
      this.bookingFacade.updateReview(reviewData);
    });
  }

  private setupStoreSync(): void {
    const storeData$ = merge(
      this.reviewConfirmation$.pipe(
        map((data) => data.comment),
        distinctUntilChanged(),
        tap((comment) => this.patchFormControl('comment', comment)),
      ),
      this.reviewConfirmation$.pipe(
        map((data) => data.rulesAccepted),
        tap((rulesAccepted) => this.patchFormControl('rulesAccepted', rulesAccepted)),
      ),
      this.reviewConfirmation$.pipe(
        map((data) => data.processingAccepted),
        tap((processingAccepted) =>
          this.patchFormControl('processingAccepted', processingAccepted),
        ),
      ),
    );

    storeData$
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        debounceTime(0),
        withLatestFrom(this.currentStep$),
        tap(([, currentStep]) => {
          const isValid = this.form.valid;
          this.updateStepValidation(isValid, currentStep);
        }),
      )
      .subscribe();
  }

  setupFormValidation(): void {
    this.form.statusChanges
      .pipe(
        // startWith(this.form.status),
        map(() => this.form.valid),
        withLatestFrom(this.currentStep$),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe(([isValid, currentStep]) => this.updateStepValidation(isValid, currentStep));
  }

  updateStepValidation(isValid: boolean, step: StepNumber): void {
    this.bookingFacade.updateStepValidation(isValid, step);
  }

  private patchFormControl<K extends keyof ReviewConfirmationControlValues>(
    controlName: K,
    value: ReviewConfirmationControlValues[K],
  ): void {
    const control = this.form.controls[controlName] as FormControl<
      ReviewConfirmationControlValues[K]
    >;

    if (control.value !== value) {
      control.patchValue(value, { emitEvent: false });
    }
  }
}
