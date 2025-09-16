import type { OnChanges, OnInit, SimpleChanges } from '@angular/core';
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
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { TranslocoPipe } from '@jsverse/transloco';
import { TuiDropdownMobile } from '@taiga-ui/addon-mobile';
import { TUI_IS_MOBILE, type TuiStringHandler } from '@taiga-ui/cdk';
import { TuiNotification, TuiTextfield, TuiTextfieldComponent } from '@taiga-ui/core';
import {
  TuiChevron,
  TuiComboBox,
  TuiDataListWrapper,
  TuiFilterByInputPipe,
  TuiInputNumber,
  TuiSelect,
} from '@taiga-ui/kit';
import { merge } from 'rxjs';
import { map } from 'rxjs/operators';

import { isObjectsEqual } from '@core/utils';

import type { AutoParts, Cargo, CargoItemRestrictions } from '../../types';

import type { AutoPartsForm } from './auto-parts.types';

@Component({
  selector: 'app-auto-parts',
  imports: [
    ReactiveFormsModule,
    TuiInputNumber,
    TuiTextfieldComponent,
    TuiNotification,
    TranslocoPipe,
    TuiChevron,
    TuiComboBox,
    TuiDropdownMobile,
    TuiFilterByInputPipe,
    TuiTextfield,
    TuiDataListWrapper,
    TuiSelect,
  ],
  templateUrl: './auto-parts.component.html',
  styleUrl: './auto-parts.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AutoPartsComponent implements OnInit, OnChanges {
  @Input() data: AutoParts | null = null;
  @Input({ required: true }) options!: Cargo[];
  @Input({ required: true }) restrictions!: CargoItemRestrictions | null;
  @Output() dataChange = new EventEmitter<AutoParts>();
  @Output() validationChange = new EventEmitter<boolean>();

  form!: AutoPartsForm;

  protected stringify: TuiStringHandler<Cargo> = (x) => `${x.name}`;
  protected readonly isMobile = inject(TUI_IS_MOBILE);

  private readonly fb = inject(FormBuilder);
  private readonly destroyRef = inject(DestroyRef);
  private readonly DEFAULT_QUANTITY = 1;

  get item(): FormControl<Cargo | null> {
    return this.form.controls.item;
  }

  get quantity(): FormControl<number> {
    return this.form.controls.quantity;
  }

  ngOnInit(): void {
    this.initializeForm();

    if (this.data) {
      this.form.patchValue(this.data, { emitEvent: false });
    }

    this.validationChange.emit(this.form.valid);

    merge(this.form.valueChanges, this.form.statusChanges.pipe(map(() => this.form.valid)))
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((value) => {
        if (typeof value === 'boolean') {
          this.validationChange.emit(value);
        } else {
          this.dataChange.emit(value as AutoParts);
        }
      });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (!this.form) return;

    const { data, restrictions } = changes;

    /**
     * Updates input value when active order changes.
     * If new order has no quantity data, uses default value.
     */
    if (data && !data.firstChange && !isObjectsEqual(data.previousValue, data.currentValue)) {
      this.form.patchValue(
        this.data ?? {
          item: null,
          quantity: 1,
        },
      );
    }

    if (restrictions) {
      this.updateFormState();
    }
  }

  setMinQuantityOnBlur(): void {
    if (!this.quantity.value) {
      this.quantity.setValue(this.DEFAULT_QUANTITY);
    }
  }

  initializeForm(): void {
    this.form = this.fb.group({
      item: this.fb.control<Cargo | null>(null, [Validators.required]),
      quantity: this.fb.control<number>(1, {
        nonNullable: true,
        validators: [Validators.required],
      }),
    });

    this.updateFormState();
  }

  private updateFormState(): void {
    if (this.hasRestriction()) {
      this.form.disable({ emitEvent: false });
    } else {
      this.form.enable({ emitEvent: false });
      this.form.markAsUntouched();
    }
  }

  private hasRestriction(): boolean {
    if (!this.restrictions) {
      return false;
    }

    return !!(
      this.restrictions.pickupCourier ||
      this.restrictions.deliveryCourier ||
      this.restrictions.pickupOffice ||
      this.restrictions.deliveryOffice
    );
  }
}
