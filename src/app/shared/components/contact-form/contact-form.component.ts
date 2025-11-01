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
import { TUI_IS_IOS } from '@taiga-ui/cdk';
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
  TuiInputPhone,
  TuiTextarea,
  TuiTextareaLimit,
} from '@taiga-ui/kit';
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
    TuiButton,
    TuiButtonLoading,
    AsyncPipe,
    TuiInputPhone,
    TuiTextarea,
    TuiTextareaLimit,
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
    return cn({
      'theme-yellow block w-full max-w-[670px] rounded-md bg-yellow-500 p-8 shadow-xl lg:p-10':
        this.isCustomTasks,
    });
  }

  protected readonly isIos = inject(TUI_IS_IOS);

  protected get pattern(): string | null {
    return this.isIos ? '+[0-9-]{1,20}' : null;
  }

  get isSupport(): boolean {
    return this.formType === 'support';
  }

  get isCustomTasks(): boolean {
    return this.formType === 'custom-tasks';
  }

  get isResume(): boolean {
    return this.formType === 'resume';
  }

  get layoutClass(): string {
    return cn('mb-3 grid gap-4', {
      'sm:grid-cols-2 md:grid-cols-3': this.isSupport,
      'sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2': this.isCustomTasks,
    });
  }

  get emailFieldClass(): string {
    return cn({
      'sm:col-span-2 md:col-span-1': this.isSupport,
      'sm:col-span-2 lg:col-span-1 xl:col-span-2': this.isCustomTasks,
    });
  }

  get commentFieldClass(): string {
    return cn({
      'sm:col-span-2 md:col-span-3': this.isSupport,
      'sm:col-span-2 lg:col-span-1 xl:col-span-2': this.isCustomTasks,
    });
  }

  get processingFieldClass(): string {
    return cn('mt-2 flex items-start gap-2', {
      'sm:col-span-2 md:col-span-3': this.isSupport,
      'sm:col-span-2 lg:col-span-1 xl:col-span-2': this.isCustomTasks,
    });
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

  protected readonly cn = cn;
}
