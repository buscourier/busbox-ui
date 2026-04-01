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
import {
  TuiButton,
  TuiHint,
  TuiIcon,
  TuiLabel,
  TuiTextfield,
  TuiTextfieldComponent,
} from '@taiga-ui/core';
import {
  TUI_VALIDATION_ERRORS,
  TuiButtonLoading,
  TuiFieldErrorContentPipe,
  TuiPassword,
} from '@taiga-ui/kit';
import { type Observable, withLatestFrom } from 'rxjs';

import { AuthFacade, type LoginCredentials } from '@core/auth';

import type { ApiError } from '@shared/types';

import { loginValidationErrors } from './login.constants';
import type { LoginForm } from './login.types';

@Component({
  selector: 'app-login',
  imports: [
    ReactiveFormsModule,
    TuiFieldErrorContentPipe,
    TuiLabel,
    TuiTextfieldComponent,
    TuiTextfield,
    TuiHint,
    TuiButton,
    AsyncPipe,
    TuiButtonLoading,
    TuiPassword,
    TuiIcon,
    TranslocoPipe,
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
  providers: [
    {
      provide: TUI_VALIDATION_ERRORS,
      useFactory: loginValidationErrors,
      deps: [TranslocoService],
    },
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoginComponent implements OnInit {
  fb = inject(NonNullableFormBuilder);
  destroyRef = inject(DestroyRef);
  auth = inject(AuthFacade);

  form!: LoginForm;
  isLoading$!: Observable<boolean>;
  error$!: Observable<ApiError | null>;

  get login(): FormControl<string> {
    return this.form.controls.login;
  }

  get password(): FormControl<string> {
    return this.form.controls.password;
  }

  ngOnInit(): void {
    this.isLoading$ = this.auth.isLoading$;
    this.error$ = this.auth.error$;

    this.initializeForm();
    this.clearError();
  }

  initializeForm(): void {
    this.form = this.fb.group({
      login: ['', [Validators.required]],
      password: ['', [Validators.required]],
    });
  }

  onSubmit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const credentials: LoginCredentials = this.form.getRawValue();
    this.auth.login(credentials);
  }

  clearError(): void {
    this.form.valueChanges
      .pipe(takeUntilDestroyed(this.destroyRef), withLatestFrom(this.error$))
      .subscribe(([, error]) => {
        if (error) {
          this.auth.clearError();
        }
      });
  }
}
