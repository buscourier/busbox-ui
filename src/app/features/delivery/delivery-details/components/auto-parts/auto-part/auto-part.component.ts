import { forwardRef, Input, type OnInit } from '@angular/core';
import { ChangeDetectionStrategy, Component, DestroyRef, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import {
  NG_VALUE_ACCESSOR,
  NG_VALIDATORS,
  ReactiveFormsModule,
  type FormControl,
  FormBuilder,
  type ValidationErrors,
  Validators,
} from '@angular/forms';
import { TranslocoPipe } from '@jsverse/transloco';
import { TuiDropdownMobile } from '@taiga-ui/addon-mobile';
import { TUI_IS_MOBILE, type TuiStringHandler } from '@taiga-ui/cdk';
import { TuiTextfield, TuiTextfieldComponent } from '@taiga-ui/core';
import {
  TuiChevron,
  TuiComboBox,
  TuiDataListWrapperComponent,
  TuiFilterByInputPipe,
  TuiSelectDirective,
} from '@taiga-ui/kit';
import { debounceTime, skip } from 'rxjs';

import { DEBOUNCE_TIME } from '@core/constants';

import type {
  AutoPart,
  AutoPartPreset,
  ParcelItem,
  ParcelItemLimits,
} from '@delivery/delivery-details/types';

// eslint-disable-next-line import/no-internal-modules
import { ParcelItemComponent } from '../../../shared/components/parcel-item';

import type { AutoPartForm } from './auto-part.types';

@Component({
  selector: 'app-auto-part',
  imports: [
    ReactiveFormsModule,
    TranslocoPipe,
    TuiTextfieldComponent,
    TuiChevron,
    TuiComboBox,
    TuiDataListWrapperComponent,
    TuiDropdownMobile,
    TuiFilterByInputPipe,
    TuiSelectDirective,
    TuiTextfield,
    ParcelItemComponent,
  ],
  templateUrl: './auto-part.component.html',
  styleUrl: './auto-part.component.css',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => AutoPartComponent),
      multi: true,
    },
    {
      provide: NG_VALIDATORS,
      useExisting: forwardRef(() => AutoPartComponent),
      multi: true,
    },
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AutoPartComponent implements OnInit {
  @Input({ required: true }) options!: AutoPartPreset[];
  @Input({ required: true }) restrictions!: ParcelItemLimits;

  form!: AutoPartForm;

  protected stringify: TuiStringHandler<AutoPartPreset> = (x) => `${x.name}`;
  protected readonly isMobile = inject(TUI_IS_MOBILE);

  private readonly fb = inject(FormBuilder);
  private readonly destroyRef = inject(DestroyRef);

  private onChange!: (value: AutoPart) => void;
  private onTouched!: () => void;

  get preset(): FormControl<AutoPartPreset | null> {
    return this.form.controls.preset;
  }

  get params(): FormControl<ParcelItem | null> {
    return this.form.controls.params;
  }

  ngOnInit(): void {
    this.initializeForm();
  }

  private initializeForm(): void {
    this.form = this.fb.group({
      preset: this.fb.control<AutoPartPreset | null>(null, [Validators.required]),
      params: this.fb.control<ParcelItem | null>(null, [Validators.required]),
    });

    this.form.valueChanges
      .pipe(takeUntilDestroyed(this.destroyRef), debounceTime(DEBOUNCE_TIME.NONE))
      .subscribe((value) => {
        if (this.onChange) {
          this.onChange(value as AutoPart);
        }

        if (this.onTouched) {
          this.onTouched();
        }
      });

    this.preset.valueChanges
      .pipe(skip(1), takeUntilDestroyed(this.destroyRef))
      .subscribe((preset) => {
        if (preset) {
          this.params.patchValue(
            {
              quantity: 1,
              weight: preset.weight,
              dimensions: {
                width: preset.width,
                height: preset.height,
                length: preset.length,
              },
            },
            { emitEvent: false },
          );
        }
      });

    // this.updateValidators();
  }

  writeValue(value: AutoPart | null) {
    if (value) {
      this.form.patchValue(value, { emitEvent: false });
    } else {
      // this.form.reset(
      //   {
      //     name: 1,
      //     weight: 1,
      //     dimensions: {
      //       width: 1,
      //       height: 1,
      //       length: 1,
      //     },
      //   },
      //   { emitEvent: false },
      // );
    }
  }

  registerOnChange(fn: (value: AutoPart) => void) {
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
    return this.form.valid ? null : { invalidAutoPart: true };
  }
}
