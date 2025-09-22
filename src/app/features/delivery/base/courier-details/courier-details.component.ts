import type { OnInit } from '@angular/core';
import { ChangeDetectionStrategy, Component, DestroyRef, forwardRef, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import type { FormControl, ValidationErrors } from '@angular/forms';
import {
  NG_VALIDATORS,
  NG_VALUE_ACCESSOR,
  NonNullableFormBuilder,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { provideTranslocoScope, TranslocoPipe, TranslocoService } from '@jsverse/transloco';
import {
  TuiHint,
  TuiIcon,
  TuiLabel,
  TuiTextfieldComponent,
  TuiTextfieldDirective,
} from '@taiga-ui/core';
import { TUI_VALIDATION_ERRORS, TuiFieldErrorContentPipe } from '@taiga-ui/kit';
import { TuiInputModule, TuiTextfieldControllerModule } from '@taiga-ui/legacy';
import { map } from 'rxjs/operators';

import type { ValidationLimits } from '@core/config';
import { VALIDATION_LIMITS } from '@core/tokens';

import { FIELD_VALIDATORS_FACTORY } from '@shared/forms';
import type { PreferredTimeSlot } from '@shared/types';
import { identityMatcherById } from '@shared/utils';

import type { CourierDetails } from '@delivery/types';

import { courierValidationErrors, PREFERRED_COURIER_TIME } from './courier-details.constants';
import type { CourierDetailsForm } from './courier-details.types';

@Component({
  selector: 'app-courier-details',
  imports: [
    TuiTextfieldControllerModule,
    TuiHint,
    ReactiveFormsModule,
    TuiFieldErrorContentPipe,
    TuiInputModule,
    TuiLabel,
    TuiTextfieldComponent,
    TuiTextfieldDirective,
    TuiIcon,
    TranslocoPipe,
  ],
  templateUrl: './courier-details.component.html',
  styleUrl: './courier-details.component.css',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => CourierDetailsComponent),
      multi: true,
    },
    {
      provide: NG_VALIDATORS,
      useExisting: forwardRef(() => CourierDetailsComponent),
      multi: true,
    },
    {
      provide: TUI_VALIDATION_ERRORS,
      useFactory: courierValidationErrors,
      deps: [TranslocoService],
    },
    provideTranslocoScope({
      scope: 'entities/address',
      alias: 'address',
    }),
    provideTranslocoScope({
      scope: 'entities/time',
      alias: 'time',
    }),
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CourierDetailsComponent implements OnInit {
  form!: CourierDetailsForm;
  readonly preferredTimeSlots = PREFERRED_COURIER_TIME;

  protected limits = inject<ValidationLimits>(VALIDATION_LIMITS);
  private fieldValidators = inject(FIELD_VALIDATORS_FACTORY);

  protected readonly identityMatcherById = identityMatcherById;

  private readonly DEFAULT_TIME = this.preferredTimeSlots[0];
  private fb = inject(NonNullableFormBuilder);
  private destroyRef = inject(DestroyRef);
  private onTouched!: () => void;
  private onChange!: (value: CourierDetails) => void;

  get street(): FormControl<string> {
    return this.form.controls.street;
  }

  get building(): FormControl<string> {
    return this.form.controls.building;
  }

  get apartment(): FormControl<string> {
    return this.form.controls.apartment;
  }

  get preferredTime(): FormControl<PreferredTimeSlot> {
    return this.form.controls.preferredTime;
  }

  ngOnInit(): void {
    this.initForm();
  }

  writeValue(value: CourierDetails | null): void {
    if (value) {
      this.form.patchValue(value, { emitEvent: false });
    } else {
      this.form.reset({ preferredTime: this.DEFAULT_TIME }, { emitEvent: false });
    }
  }

  registerOnChange(fn: (value: CourierDetails) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    if (isDisabled) {
      this.form.disable();
    } else {
      this.form.enable();
    }
  }

  validate(): ValidationErrors | null {
    if (!this.form) {
      return { formNotInitialized: true };
    }

    const errors: ValidationErrors = {};

    Object.entries(this.form.controls).forEach(([key, control]) => {
      if (control.errors) {
        errors[key] = control.errors;
      }
    });

    return Object.keys(errors).length ? errors : null;
  }

  private initForm(): void {
    this.form = this.fb.group({
      street: ['', this.fieldValidators.getValidators('address', 'street')],
      building: ['', this.fieldValidators.getValidators('address', 'building')],
      apartment: ['', this.fieldValidators.getValidators('address', 'apartment')],
      preferredTime: [this.DEFAULT_TIME, [Validators.required]],
    });

    this.form.valueChanges
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        map(() => this.form.getRawValue() as CourierDetails),
      )
      .subscribe((value) => {
        if (this.onChange) {
          this.onChange(value);
        }

        if (this.onTouched) {
          this.onTouched();
        }
      });
  }
}
