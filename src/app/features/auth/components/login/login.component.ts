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

import type { ApiError } from '@shared/types';

import { AuthFacade } from '../../auth.facade';
import type { LoginCredentials } from '../../types';

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
  authFacade = inject(AuthFacade);

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
    this.isLoading$ = this.authFacade.isLoading();
    this.error$ = this.authFacade.getError();

    this.initializeForm();
    this.clearError();
  }

  initializeForm(): void {
    this.form = this.fb.group({
      login: ['', [Validators.required, Validators.minLength(3)]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  onSubmit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const credentials: LoginCredentials = this.form.getRawValue();
    this.authFacade.login(credentials);
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
