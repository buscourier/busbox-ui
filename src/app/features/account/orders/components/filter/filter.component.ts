import { AsyncPipe } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  EventEmitter,
  inject,
  Input,
  type OnChanges,
  type OnInit,
  Output,
  type SimpleChanges,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormBuilder, type FormControl, ReactiveFormsModule } from '@angular/forms';
import { TuiDropdownMobile } from '@taiga-ui/addon-mobile';
import { TUI_IS_MOBILE, type TuiStringHandler } from '@taiga-ui/cdk';
import { TuiButton, TuiLabel, TuiTextfield } from '@taiga-ui/core';
import {
  TuiButtonLoading,
  TuiChevron,
  TuiComboBox,
  TuiDataListWrapperComponent,
  TuiFilterByInputPipe,
  TuiInputDateRange,
  TuiSelectDirective,
  TuiSkeleton,
} from '@taiga-ui/kit';
import { filter, type Observable } from 'rxjs';

import { LocationsFacade } from '@shared/store';
import type { DeliveryCity, PickupCity } from '@shared/types';

import type { Filter, FilterViewModel } from '../../types';

import type { FilterForm } from './filter.types';

@Component({
  selector: 'app-filter',
  imports: [
    TuiChevron,
    TuiDataListWrapperComponent,
    TuiLabel,
    TuiButtonLoading,
    TuiButton,
    TuiTextfield,
    ReactiveFormsModule,
    AsyncPipe,
    TuiComboBox,
    TuiDropdownMobile,
    TuiFilterByInputPipe,
    TuiInputDateRange,
    TuiSelectDirective,
    TuiSkeleton,
  ],
  templateUrl: './filter.component.html',
  styleUrl: './filter.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FilterComponent implements OnInit, OnChanges {
  @Input({ required: true }) filter!: FilterViewModel;

  @Output() filterChange = new EventEmitter<Filter>();
  @Output() filterClear = new EventEmitter<void>();

  form!: FilterForm;

  pickupCities$!: Observable<PickupCity[]>;
  deliveryCities$!: Observable<DeliveryCity[]>;

  protected stringify: TuiStringHandler<PickupCity | DeliveryCity> = (x) => `${x.name}`;
  protected readonly isMobile = inject(TUI_IS_MOBILE);

  private readonly fb = inject(FormBuilder);
  private readonly destroyRef = inject(DestroyRef);
  private readonly locationsFacade = inject(LocationsFacade);

  get range(): FormControl<string | null> {
    return this.form.controls.range;
  }

  get pickupCity(): FormControl<PickupCity | null> {
    return this.form.controls.pickupCity;
  }

  get deliveryCity(): FormControl<DeliveryCity | null> {
    return this.form.controls.deliveryCity;
  }

  ngOnInit(): void {
    this.initializeForm();
    // this.restoreInitialFilter();
    this.initializeCities();
    this.loadDeliveryCities();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['filter'] && this.form) {
      const currentParams = changes['filter'].currentValue?.params;

      if (currentParams && !this.isFormAlreadyInSync(currentParams)) {
        // console.log('Updating form with new filter params');
        this.form.patchValue(currentParams, { emitEvent: false });
      }
    }
  }

  private isFormAlreadyInSync(filterParams: Filter): boolean {
    const formValue = this.form.value as Filter;

    return (
      formValue.range === filterParams.range &&
      formValue.pickupCity?.id === filterParams.pickupCity?.id &&
      formValue.deliveryCity?.id === filterParams.deliveryCity?.id
    );
  }

  onSubmit(): void {
    if (this.form.valid) {
      const filterValue = this.form.value as Filter;
      this.filterChange.emit(filterValue);
    }
  }

  onClearFilter(): void {
    this.form.reset();
    this.filterClear.emit();
  }

  private initializeForm(): void {
    this.form = this.fb.group({
      range: this.fb.control<string | null>(null),
      pickupCity: this.fb.control<PickupCity | null>(null),
      deliveryCity: this.fb.control<DeliveryCity | null>(null),
    });
  }

  private initializeCities(): void {
    this.pickupCities$ = this.locationsFacade.getPickupCities();
    this.deliveryCities$ = this.locationsFacade.getDeliveryCities();
  }

  private restoreInitialFilter(): void {
    if (this.filter.params) {
      this.form.patchValue(this.filter.params, { emitEvent: false });
    }
  }

  private loadDeliveryCities(): void {
    this.pickupCity.valueChanges
      .pipe(filter(Boolean), takeUntilDestroyed(this.destroyRef))
      .subscribe((pickupCity) => {
        this.locationsFacade.loadDeliveryCities(pickupCity.id);
        this.deliveryCity.reset();
      });
  }
}
