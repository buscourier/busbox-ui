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
import type { TuiStringHandler } from '@taiga-ui/cdk';
import { TuiTextfield, TuiTextfieldComponent } from '@taiga-ui/core';
import {
  TuiChevron,
  TuiDataListWrapper,
  TuiFilterByInputPipe,
  TuiInputNumber,
  TuiSelect,
} from '@taiga-ui/kit';
import { merge } from 'rxjs';
import { map } from 'rxjs/operators';

import { isObjectsEqual } from '@core/utils';

import type { Cargo, OtherCargo } from '../../types';

import type { OtherCargoForm } from './other-cargo.types';

@Component({
  selector: 'app-other-cargo',
  imports: [
    ReactiveFormsModule,
    TuiInputNumber,
    TuiTextfieldComponent,
    TranslocoPipe,
    TuiChevron,
    TuiDropdownMobile,
    TuiFilterByInputPipe,
    TuiTextfield,
    TuiDataListWrapper,
    TuiSelect,
  ],
  templateUrl: './other-cargo.component.html',
  styleUrl: './other-cargo.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OtherCargoComponent implements OnInit, OnChanges {
  @Input() data: OtherCargo | null = null;
  @Input({ required: true }) options!: Cargo[];
  @Output() dataChange = new EventEmitter<OtherCargo>();
  @Output() validationChange = new EventEmitter<boolean>();

  form!: OtherCargoForm;

  protected stringify: TuiStringHandler<Cargo> = (x) => `${x.name}`;

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
          this.dataChange.emit(value as OtherCargo);
        }
      });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (!this.form) return;

    const { data } = changes;

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
  }

  setMinQuantityOnBlur(): void {
    if (!this.quantity.value) {
      this.quantity.setValue(this.DEFAULT_QUANTITY);
    }
  }

  private initializeForm(): void {
    this.form = this.fb.group({
      item: this.fb.control<Cargo | null>(null, [Validators.required]),
      quantity: this.fb.control<number>(1, {
        nonNullable: true,
        validators: [Validators.required],
      }),
    });
  }
}
