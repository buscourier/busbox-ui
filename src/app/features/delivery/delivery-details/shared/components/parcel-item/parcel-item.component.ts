import { AsyncPipe } from '@angular/common';
import type { OnChanges, OnInit, SimpleChanges } from '@angular/core';
import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  forwardRef,
  inject,
  Input,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import type { AbstractControl, FormGroup, ValidationErrors } from '@angular/forms';
import {
  FormControl,
  NG_VALIDATORS,
  NG_VALUE_ACCESSOR,
  NonNullableFormBuilder,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { TranslocoPipe, TranslocoService } from '@jsverse/transloco';
import { TuiError, TuiHintDirective, TuiIcon, TuiTextfieldComponent } from '@taiga-ui/core';
import {
  TUI_VALIDATION_ERRORS,
  TuiFieldErrorContentPipe,
  TuiFieldErrorPipe,
  TuiInputNumber,
} from '@taiga-ui/kit';
import { TuiTextfieldControllerModule } from '@taiga-ui/legacy';
import { debounceTime } from 'rxjs';

import { DEBOUNCE_TIME } from '@core/constants';
import { isObjectsEqual } from '@core/utils';

import { LimitBadgeComponent } from '@shared/components/limit-badge';
import { customMaxValidator, customMinValidator } from '@shared/validators';

import type { ParcelItem, ParcelItemDimensions, ParcelItemLimits } from '../../../types';

import { limitKeyMap, PARCEL_ITEM_DEFAULTS, parcelValidationErrors } from './parcel-item.constants';
import type { ParcelItemForm } from './parcel-item.types';

@Component({
  selector: 'app-parcel-item',
  imports: [
    ReactiveFormsModule,
    TuiHintDirective,
    TuiFieldErrorContentPipe,
    TuiTextfieldControllerModule,
    TuiFieldErrorPipe,
    TuiError,
    AsyncPipe,
    TuiTextfieldComponent,
    TuiInputNumber,
    TuiIcon,
    LimitBadgeComponent,
    TranslocoPipe,
  ],
  templateUrl: './parcel-item.component.html',
  styleUrl: './parcel-item.component.css',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => ParcelItemComponent),
      multi: true,
    },
    {
      provide: NG_VALIDATORS,
      useExisting: forwardRef(() => ParcelItemComponent),
      multi: true,
    },
    {
      provide: TUI_VALIDATION_ERRORS,
      useFactory: parcelValidationErrors,
      deps: [TranslocoService],
    },
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ParcelItemComponent implements OnInit, OnChanges {
  @Input({ required: true }) limits!: ParcelItemLimits;
  @Input() totalQuantityMaxError = false;
  @Input() totalWeightMaxError = false;
  @Input() totalDimensionsMaxError = false;

  form!: ParcelItemForm;
  dimensionsError = new FormControl(null);

  private readonly fb = inject(NonNullableFormBuilder);
  private readonly destroyRef = inject(DestroyRef);

  private onChange!: (value: ParcelItem) => void;
  private onTouched!: () => void;

  get quantity(): FormControl<number> {
    return this.form.controls.quantity;
  }

  get weight(): FormControl<number> {
    return this.form.controls.weight;
  }

  get width(): FormControl<number> {
    return this.form.controls.dimensions.controls.width;
  }

  get height(): FormControl<number> {
    return this.form.controls.dimensions.controls.height;
  }

  get length(): FormControl<number> {
    return this.form.controls.dimensions.controls.length;
  }

  get dimensions(): ParcelItemForm['controls']['dimensions'] {
    return this.form.controls.dimensions;
  }

  ngOnInit(): void {
    this.initializeForm();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (!this.form) {
      return;
    }

    if (
      changes['limits'] &&
      !isObjectsEqual(changes['limits'].previousValue, changes['limits'].currentValue)
    ) {
      this.updateValidators();
    }
  }

  getMaxDimension(control: FormControl<number>): number {
    const { width, height, length } = this.dimensions.getRawValue();
    const otherFieldsSum = width + height + length - control.value;

    return Math.max(0, this.limits.DIMENSIONS.MAX - otherFieldsSum);
  }

  getAvailableDimension(): number {
    const { width, height, length } = this.dimensions.getRawValue();
    const currentSum = width + height + length;

    return Math.max(0, this.limits.DIMENSIONS.MAX - currentSum);
  }

  getAvailableQuantity(): number {
    const { quantity } = this.form.getRawValue();

    return this.limits.QUANTITY.MAX - quantity;
  }

  getAvailableWeight(): number {
    const { weight } = this.form.getRawValue();

    return this.limits.WEIGHT.MAX - weight;
  }

  setMinDimensionOnBlur(controlValue: number, controlName: keyof ParcelItemDimensions): void {
    if (!controlValue) {
      this.dimensions.controls[controlName].setValue(this.limits.DIMENSIONS.MIN);
    }
  }

  setMinValueOnBlur(
    controlValue: number,
    controlName: Exclude<keyof ParcelItem, 'dimensions'>,
  ): void {
    const limitKey = limitKeyMap[controlName];

    if (!controlValue) {
      this.form.controls[controlName].setValue(this.limits[limitKey].MIN);
    }
  }

  writeValue(value: ParcelItem | null) {
    if (value) {
      this.form.patchValue(value, { emitEvent: false });
    } else {
      this.form.reset(
        {
          quantity: PARCEL_ITEM_DEFAULTS.QUANTITY,
          weight: PARCEL_ITEM_DEFAULTS.WEIGHT,
          dimensions: {
            width: PARCEL_ITEM_DEFAULTS.DIMENSIONS,
            height: PARCEL_ITEM_DEFAULTS.DIMENSIONS,
            length: PARCEL_ITEM_DEFAULTS.DIMENSIONS,
          },
        },
        { emitEvent: false },
      );
    }
  }

  registerOnChange(fn: (value: ParcelItem) => void) {
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

  private initializeForm(): void {
    this.form = this.fb.group({
      quantity: [PARCEL_ITEM_DEFAULTS.QUANTITY],
      weight: [PARCEL_ITEM_DEFAULTS.WEIGHT],
      dimensions: this.fb.group({
        width: [PARCEL_ITEM_DEFAULTS.DIMENSIONS],
        height: [PARCEL_ITEM_DEFAULTS.DIMENSIONS],
        length: [PARCEL_ITEM_DEFAULTS.DIMENSIONS],
      }),
    });

    this.form.valueChanges
      .pipe(takeUntilDestroyed(this.destroyRef), debounceTime(DEBOUNCE_TIME.NONE))
      .subscribe((value) => {
        if (this.onChange) {
          this.onChange(value as ParcelItem);
        }

        if (this.onTouched) {
          this.onTouched();
        }
      });

    this.dimensions.statusChanges.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(() => {
      this.dimensionsError.setErrors(this.dimensions.errors);
      this.dimensionsError.markAsTouched();
    });

    this.updateValidators();
  }

  private updateValidators(): void {
    this.quantity.setValidators([
      Validators.required,
      customMinValidator(this.limits.QUANTITY.MIN, 'quantity'),
      customMaxValidator(this.limits.QUANTITY.MAX, 'quantity'),
    ]);
    this.quantity.updateValueAndValidity({ emitEvent: true });

    this.weight.setValidators([
      Validators.required,
      customMinValidator(this.limits.WEIGHT.MIN, 'weight'),
      customMaxValidator(this.limits.WEIGHT.MAX, 'weight'),
    ]);
    this.weight.updateValueAndValidity({ emitEvent: true });

    this.width.setValidators([
      Validators.required,
      customMinValidator(this.limits.DIMENSIONS.MIN, 'width'),
      customMaxValidator(this.limits.DIMENSIONS.MAX, 'width'),
    ]);
    this.width.updateValueAndValidity({ emitEvent: true });

    this.height.setValidators([
      Validators.required,
      customMinValidator(this.limits.DIMENSIONS.MIN, 'height'),
      customMaxValidator(this.limits.DIMENSIONS.MAX, 'height'),
    ]);
    this.height.updateValueAndValidity({ emitEvent: true });

    this.length.setValidators([
      Validators.required,
      customMinValidator(this.limits.DIMENSIONS.MIN, 'length'),
      customMaxValidator(this.limits.DIMENSIONS.MAX, 'length'),
    ]);
    this.length.updateValueAndValidity({ emitEvent: true });

    this.dimensions.setValidators(this.dimensionsValidator.bind(this));
    this.dimensions.updateValueAndValidity({ emitEvent: true });
  }

  private dimensionsValidator(control: AbstractControl): ValidationErrors | null {
    const group = control as FormGroup;

    const { width, height, length } = group.value;
    if (!width || !height || !length) return null;

    const dimensionsSum = width + height + length;
    if (dimensionsSum > this.limits.DIMENSIONS.MAX) {
      return { dimensions: { error: true, diff: dimensionsSum - this.limits.DIMENSIONS.MAX } };
    }

    return null;
  }

  validate(): ValidationErrors | null {
    return this.form.valid ? null : { invalidParcel: true };
  }
}
