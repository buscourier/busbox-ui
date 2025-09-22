import type { OnInit } from '@angular/core';
import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  EventEmitter,
  inject,
  Input,
  Output,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import type { FormControl } from '@angular/forms';
import { NonNullableFormBuilder, ReactiveFormsModule } from '@angular/forms';
import { TranslocoPipe, TranslocoService } from '@jsverse/transloco';
import { TUI_IS_IOS } from '@taiga-ui/cdk';
import {
  TuiHintDirective,
  TuiLabel,
  TuiTextfieldComponent,
  TuiTextfieldDirective,
} from '@taiga-ui/core';
import { TUI_VALIDATION_ERRORS, TuiFieldErrorContentPipe, TuiInputPhone } from '@taiga-ui/kit';
import { distinctUntilChanged } from 'rxjs';

import type { ValidationLimits } from '@core/config';
import { VALIDATION_LIMITS } from '@core/tokens';
import { isObjectsEqual } from '@core/utils';

import { FIELD_VALIDATORS_FACTORY } from '@shared/forms';

import type { Recipient } from '../../../types';

import { recipientValidationErrors } from './recipient.constants';
import type { RecipientForm } from './recipient.types';

@Component({
  selector: 'app-recipient',
  imports: [
    TuiHintDirective,
    TuiFieldErrorContentPipe,
    ReactiveFormsModule,
    TuiLabel,
    TuiTextfieldComponent,
    TuiTextfieldDirective,
    TranslocoPipe,
    TuiInputPhone,
  ],
  templateUrl: './recipient.component.html',
  styleUrl: './recipient.component.css',
  providers: [
    {
      provide: TUI_VALIDATION_ERRORS,
      useFactory: recipientValidationErrors,
      deps: [TranslocoService],
    },
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RecipientComponent implements OnInit {
  @Input() data: Recipient | null = null;
  @Output() dataChange = new EventEmitter<Recipient>();
  @Output() validationChange = new EventEmitter<boolean>();

  form!: RecipientForm;

  protected readonly isIos = inject(TUI_IS_IOS);

  protected get pattern(): string | null {
    return this.isIos ? '+[0-9-]{1,20}' : null;
  }

  protected limits = inject<ValidationLimits>(VALIDATION_LIMITS);

  private readonly fb = inject(NonNullableFormBuilder);
  private readonly destroyRef = inject(DestroyRef);
  private fieldValidators = inject(FIELD_VALIDATORS_FACTORY);

  get fullName(): FormControl<string> {
    return this.form.controls.fullName;
  }

  get phone(): FormControl<string> {
    return this.form.controls.phone;
  }

  ngOnInit(): void {
    this.initializeForm();
    this.setupFormChanges();
  }

  private initializeForm(): void {
    this.form = this.fb.group({
      fullName: ['', this.fieldValidators.getValidators('user', 'fullName')],
      phone: ['', this.fieldValidators.getValidators('contact', 'phone')],
    });

    if (this.data) {
      this.form.patchValue(this.data);
    }
  }

  private setupFormChanges(): void {
    this.validationChange.emit(this.form.valid);

    this.form.valueChanges
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        distinctUntilChanged((prev, curr) => isObjectsEqual(prev, curr)),
      )
      .subscribe(() => {
        this.validationChange.emit(this.form.valid);

        if (this.form.valid) {
          this.dataChange.emit(this.form.getRawValue());
        }
      });
  }
}
