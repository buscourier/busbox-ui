import { AsyncPipe } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  HostBinding,
  inject,
  Input,
  type OnInit,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import {
  type FormControl,
  NonNullableFormBuilder,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { provideTranslocoScope, TranslocoPipe, TranslocoService } from '@jsverse/transloco';
import {
  TuiAlertService,
  TuiButton,
  TuiHint,
  TuiLabel,
  TuiTextfieldComponent,
  TuiTextfieldDirective,
} from '@taiga-ui/core';
import {
  TUI_VALIDATION_ERRORS,
  TuiButtonLoading,
  TuiCheckbox,
  TuiFieldErrorContentPipe,
} from '@taiga-ui/kit';
import { TuiInputPhoneModule, TuiTextareaModule } from '@taiga-ui/legacy';
import { BehaviorSubject, finalize } from 'rxjs';

import type { ValidationLimits } from '@core/config';
import { VALIDATION_LIMITS } from '@core/tokens';
import { cn } from '@core/utils';

import { FIELD_VALIDATORS_FACTORY } from '@shared/forms';

import { getValidationErrors } from './contact-form.const';
import { ContactFormService } from './contact-form.service';
import type { ContactForm } from './contact-form.types';

@Component({
  selector: 'app-contact-form',
  imports: [
    ReactiveFormsModule,
    TuiLabel,
    TranslocoPipe,
    TuiFieldErrorContentPipe,
    TuiTextfieldComponent,
    TuiTextfieldDirective,
    TuiHint,
    TuiCheckbox,
    TuiTextareaModule,
    TuiInputPhoneModule,
    TuiButton,
    TuiButtonLoading,
    AsyncPipe,
  ],
  providers: [
    provideTranslocoScope(
      {
        scope: 'entities/user',
        alias: 'user',
      },
      {
        scope: 'entities/contacts',
        alias: 'contacts',
      },
    ),
    {
      provide: TUI_VALIDATION_ERRORS,
      useFactory: getValidationErrors,
      deps: [TranslocoService],
    },
  ],
  templateUrl: './contact-form.component.html',
  styleUrl: './contact-form.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ContactFormComponent implements OnInit {
  @Input() formType: 'custom-tasks' | 'resume' | 'support' = 'support';

  @HostBinding('class') get hostClasses(): string {
    return cn(
      'theme-yellow block w-full max-w-[670px] p-12 pb-14 rounded-md bg-yellow-500 shadow-xl',
      'md:p-10',
    );
  }

  get layoutClasses(): string {
    return cn('mb-3 grid gap-3 sm:grid-cols-2 md:grid-cols-1 lg:grid-cols-2');
  }

  isSubmitting$ = new BehaviorSubject<boolean>(false);

  protected limits = inject<ValidationLimits>(VALIDATION_LIMITS);

  private readonly fieldValidators = inject(FIELD_VALIDATORS_FACTORY);
  private readonly contactFormService = inject(ContactFormService);
  private readonly fb = inject(NonNullableFormBuilder);
  private readonly alert = inject(TuiAlertService);
  private readonly transloco = inject(TranslocoService);
  private readonly destroyRef = inject(DestroyRef);

  form!: ContactForm;

  get formTitle(): string {
    switch (this.formType) {
      case 'custom-tasks':
        return 'Форма нестандартной задачи';
      case 'resume':
        return 'Форма резюме';
      default:
        return 'Форма поддержки';
    }
  }

  get userName(): FormControl<string> {
    return this.form.controls.userName;
  }

  get phone(): FormControl<string> {
    return this.form.controls.phone;
  }

  get email(): FormControl<string> {
    return this.form.controls.email;
  }

  get message(): FormControl<string> {
    return this.form.controls.message;
  }

  get processingAccepted(): FormControl<boolean> {
    return this.form.controls.processingAccepted;
  }

  ngOnInit(): void {
    this.initializeForm();
  }

  onSubmit() {
    if (this.form.invalid) return;

    const { userName, phone, email, message } = this.form.getRawValue();

    this.isSubmitting$.next(true);

    this.contactFormService
      .submitContactForm({
        formTitle: this.formTitle,
        userName,
        phone,
        email,
        message,
      })
      .pipe(
        finalize(() => this.isSubmitting$.next(false)),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe({
        next: (result) => {
          const message = this.contactFormService.getStatusMessage(result);

          if (this.contactFormService.isSubmissionSuccessful(result)) {
            this.showNotification(message, 'success');
            this.form.reset();
          }
        },
        error: (result) => {
          const message = this.contactFormService.getStatusMessage(result);
          this.showNotification(message, 'error');
        },
      });
  }

  private initializeForm(): void {
    this.form = this.fb.group({
      userName: ['', this.fieldValidators.getValidators('user', 'lastName')],
      phone: ['', this.fieldValidators.getValidators('contact', 'phone')],
      email: ['', [Validators.required, Validators.email]],
      message: this.fb.control<string>('', [Validators.minLength(3), Validators.maxLength(100)]),
      processingAccepted: this.fb.control(false, {
        // nonNullable: true,
        validators: [Validators.requiredTrue],
      }),
    });
  }

  private showNotification(message: string, appearance: 'success' | 'error') {
    return this.alert
      .open(message, {
        label: this.transloco.translate('Отправка заявки'),
        autoClose: 0,
        appearance,
      })
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe();
  }
}
