import { AsyncPipe } from '@angular/common';
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
import { FormControl, NonNullableFormBuilder, ReactiveFormsModule } from '@angular/forms';
import { TranslocoPipe, TranslocoService } from '@jsverse/transloco';
import { TuiResponsiveDialogService } from '@taiga-ui/addon-mobile';
import { TuiError, TuiIcon } from '@taiga-ui/core';
import { TUI_VALIDATION_ERRORS, TuiFieldErrorPipe } from '@taiga-ui/kit';
import { debounceTime } from 'rxjs';

import { DEBOUNCE_TIME } from '@core/constants';
import { isObjectsEqual } from '@core/utils';

import type { ParcelItem, ParcelItemLimits, Parcels, ParcelsLimits } from '../../types';

import { PARCEL_ITEM_DEFAULTS, ParcelItemComponent } from './parcel-item';
import { parcelItemAnimation } from './parcels.animations';
import { parcelsValidationErrors } from './parcels.constants';
import type { ParcelsErrors } from './parcels.types';
import { parcelsValidator } from './parcels.validator';

@Component({
  selector: 'app-parcels',
  imports: [
    ParcelItemComponent,
    ReactiveFormsModule,
    TuiFieldErrorPipe,
    TuiError,
    AsyncPipe,
    TuiIcon,
    TranslocoPipe,
  ],
  templateUrl: './parcels.component.html',
  styleUrl: './parcels.component.css',
  providers: [
    {
      provide: TUI_VALIDATION_ERRORS,
      useFactory: parcelsValidationErrors,
      deps: [TranslocoService],
    },
  ],
  animations: [parcelItemAnimation],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ParcelsComponent implements OnChanges, OnInit {
  @Input() data: Parcels | null = null;
  @Input() parcelsLimits!: ParcelsLimits;
  @Input() parcelItemLimits!: ParcelItemLimits;
  @Output() dataChange = new EventEmitter<Parcels>();
  @Output() validationChange = new EventEmitter<boolean>();

  private readonly dialog = inject(TuiResponsiveDialogService);

  /** Protected properties */
  protected canAddParcelItem = true;

  /** Private properties */
  private readonly fb = inject(NonNullableFormBuilder);
  private readonly destroyRef = inject(DestroyRef);
  private transloco = inject(TranslocoService);

  /** Public properties */
  parcels = this.fb.array<ParcelItem>([]);
  parcelsError = new FormControl(null);

  /** Getters */
  get errors(): ParcelsErrors {
    return this.parcelsError.errors as ParcelsErrors;
  }

  /** Lifecycle hooks */
  ngOnChanges(changes: SimpleChanges): void {
    const parcelsLimits = changes['parcelsLimits']?.currentValue;
    const parcelItemLimits = changes['parcelItemLimits']?.currentValue;

    if (
      changes['data'] &&
      !changes['data'].firstChange &&
      !isObjectsEqual(changes['data'].previousValue, changes['data'].currentValue)
    ) {
      this.reinitializeForm();
    }

    if (parcelsLimits) {
      this.updateValidator();
    }

    if (parcelItemLimits) {
      this.showNotification(parcelItemLimits);
    }
  }

  ngOnInit(): void {
    this.initializeForm();
    this.updateValidator();
    this.setupValueChanges();
    this.setupErrorHandling();
  }

  /** Public methods */
  addParcelItem(item?: ParcelItem): void {
    this.parcels.push(
      this.fb.control(
        item ?? {
          quantity: PARCEL_ITEM_DEFAULTS.QUANTITY,
          weight: PARCEL_ITEM_DEFAULTS.WEIGHT,
          dimensions: {
            width: PARCEL_ITEM_DEFAULTS.DIMENSIONS,
            height: PARCEL_ITEM_DEFAULTS.DIMENSIONS,
            length: PARCEL_ITEM_DEFAULTS.DIMENSIONS,
          },
        },
      ),
    );
  }

  removeParcelItem(index: number): void {
    this.parcels.removeAt(index);
  }

  /** Private methods */
  private initializeForm(): void {
    if (!this.data?.items.length) {
      this.addParcelItem();
    }

    if (this.data?.items) {
      this.data.items.forEach((parcelItem) => this.addParcelItem(parcelItem));
    }
  }

  private updateValidator(): void {
    this.parcels.setValidators(parcelsValidator(this.parcelsLimits));
    this.parcels.updateValueAndValidity();
  }

  private reinitializeForm(): void {
    while (this.parcels.length) {
      this.parcels.removeAt(0);
    }

    this.initializeForm();
  }

  private setupValueChanges(): void {
    this.parcels.valueChanges
      .pipe(debounceTime(DEBOUNCE_TIME.DEFAULT))
      .subscribe((parcels) => this.dataChange.emit({ items: parcels }));
  }

  private setupErrorHandling(): void {
    this.parcels.statusChanges.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(() => {
      this.parcelsError.setErrors(this.parcels.errors);
      this.parcelsError.markAsTouched();
      this.canAddParcelItem =
        !this.parcels.invalid && this.parcels.length < (this.parcelsLimits?.MAX_PARCELS || 0);
      this.validationChange.emit(!this.parcels.invalid);
    });
  }

  protected showNotification(limits: ParcelItemLimits): void {
    this.dialog
      .open(
        `
          Максимальная сумма <b>длины</b>, <b>ширины</b> и <b>высоты</b> - <strong>${limits.DIMENSIONS.MAX} ${this.transloco.translate('units.width')}</strong>
          <br />Максимальный вес -
          <strong>${limits.WEIGHT.MAX} ${this.transloco.translate('units.weight')}</strong>`,
        {
          label: this.transloco.translate('deliveryDetails.parcel.messages.limits'),
        },
      )
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe();
  }
}
