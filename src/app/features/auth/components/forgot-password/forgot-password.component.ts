import { AsyncPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, DestroyRef, inject, type OnInit } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import {
  type FormControl,
  NonNullableFormBuilder,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { TranslocoPipe, TranslocoService } from '@jsverse/transloco';
import { TuiButton, TuiHint, TuiLabel, TuiNotification, TuiTextfield } from '@taiga-ui/core';
import { TUI_VALIDATION_ERRORS, TuiButtonLoading, TuiFieldErrorContentPipe } from '@taiga-ui/kit';
import { type Observable, withLatestFrom } from 'rxjs';

import type { ApiError } from '@shared/types';

import { AuthFacade } from '../../auth.facade';

import { validationErrors } from './forgot-password.constants';
import type { ForgotPasswordForm } from './forgot-password.types';

@Component({
  selector: 'app-forgot-password',
  imports: [
    AsyncPipe,
    TuiNotification,
    ReactiveFormsModule,
    TuiLabel,
    TuiTextfield,
    TuiHint,
    TuiFieldErrorContentPipe,
    TuiButton,
    TuiButtonLoading,
    TranslocoPipe,
  ],
  templateUrl: './forgot-password.component.html',
  styleUrl: './forgot-password.component.css',
  providers: [
    {
      provide: TUI_VALIDATION_ERRORS,
      useFactory: validationErrors,
      deps: [TranslocoService],
    },
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ForgotPasswordComponent implements OnInit {
  private readonly fb = inject(NonNullableFormBuilder);
  private readonly destroyRef = inject(DestroyRef);
  private readonly authFacade = inject(AuthFacade);

  isLoading$!: Observable<boolean>;
  error$!: Observable<ApiError | null>;

  form!: ForgotPasswordForm;

  get email(): FormControl<string> {
    return this.form.controls.email;
  }

  ngOnInit(): void {
    this.isLoading$ = this.authFacade.isLoading();
    this.error$ = this.authFacade.getError();

    this.initializeForm();
    this.clearError();
  }

  initializeForm(): void {
    this.form = this.fb.group({
      email: ['', [Validators.email, Validators.required]],
    });
  }

  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const email = this.email.value;
    this.authFacade.forgotPassword(email);
  }

  clearError(): void {
    this.form.valueChanges
      .pipe(takeUntilDestroyed(this.destroyRef), withLatestFrom(this.error$))
      .subscribe(([, error]) => {
        if (error) {
          this.authFacade.clearError();
        }
      });
  }
}
