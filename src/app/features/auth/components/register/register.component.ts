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
import { TuiButton, TuiHint, TuiIcon, TuiLabel, TuiTextfield } from '@taiga-ui/core';
import {
  TUI_VALIDATION_ERRORS,
  TuiButtonLoading,
  TuiFieldErrorContentPipe,
  TuiPassword,
} from '@taiga-ui/kit';
import { type Observable, withLatestFrom } from 'rxjs';

import type { ApiError } from '@shared/types';

import type { RegisterPayload } from '@auth/types';

import { AuthFacade } from '../../auth.facade';
import { passwordsMatchValidator } from '../../validators';

import { registerValidationErrors } from './register.constants';
import type { RegisterForm } from './register.types';

@Component({
  selector: 'app-register',
  imports: [
    AsyncPipe,
    ReactiveFormsModule,
    TuiLabel,
    TuiTextfield,
    TuiHint,
    TuiFieldErrorContentPipe,
    TuiButton,
    TuiPassword,
    TuiIcon,
    TuiButtonLoading,
    TranslocoPipe,
  ],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css',
  providers: [
    {
      provide: TUI_VALIDATION_ERRORS,
      useFactory: registerValidationErrors,
      deps: [TranslocoService],
    },
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RegisterComponent implements OnInit {
  private readonly fb = inject(NonNullableFormBuilder);
  private readonly destroyRef = inject(DestroyRef);
  private readonly authFacade = inject(AuthFacade);

  isLoading$!: Observable<boolean>;
  error$!: Observable<ApiError | null>;

  form!: RegisterForm;

  get username(): FormControl<string> {
    return this.form.controls.username;
  }

  get email(): FormControl<string> {
    return this.form.controls.email;
  }

  get password(): FormControl<string> {
    return this.form.controls.password;
  }

  get confirmPassword(): FormControl<string> {
    return this.form.controls.confirmPassword;
  }

  // get agreeTerms(): FormControl<boolean> {
  //   return this.form.controls.agreeTerms;
  // }

  ngOnInit(): void {
    this.isLoading$ = this.authFacade.isLoading();
    this.error$ = this.authFacade.getError();

    this.initializeForm();
    this.clearError();
  }

  initializeForm(): void {
    this.form = this.fb.group(
      {
        username: ['', [Validators.required, Validators.minLength(3)]],
        email: ['', [Validators.required, Validators.email]],
        password: ['', [Validators.required, Validators.minLength(6)]],
        confirmPassword: ['', [Validators.required, Validators.minLength(6)]],
        // agreeTerms: [false, [Validators.requiredTrue]],
      },
      {
        validators: [passwordsMatchValidator()],
      },
    );
  }

  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const userData: RegisterPayload = this.form.getRawValue();
    this.authFacade.register(userData);
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
