import { AsyncPipe } from '@angular/common';
import {
  effect,
  type OnChanges,
  type OnInit,
  type Signal,
  type SimpleChanges,
} from '@angular/core';
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
import { TuiAlertService, TuiButton, TuiError, TuiIcon } from '@taiga-ui/core';
import { TUI_VALIDATION_ERRORS, TuiFieldErrorPipe } from '@taiga-ui/kit';
import { PolymorpheusComponent } from '@taiga-ui/polymorpheus';
import type { Subscription } from 'rxjs';
import { debounceTime } from 'rxjs';
import { finalize } from 'rxjs/operators';

import { DEBOUNCE_TIME } from '@core/constants';
import { isObjectsEqual } from '@core/utils';

import { CargoRestrictionsService } from '../../services';
// eslint-disable-next-line import/no-internal-modules
import { LimitsAlertComponent } from '../../shared/components/limits-alert';
import {
  PARCEL_ITEM_DEFAULTS,
  parcelItemAnimation,
  ParcelItemComponent,
  // eslint-disable-next-line import/no-internal-modules
} from '../../shared/components/parcel-item';
import { PARCEL_ITEM_LIMIT_TOKEN } from '../../tokens';
import type { ParcelItem, ParcelItemLimits, Parcels } from '../../types';

import { parcelsValidationErrors } from './parcels.constants';
import type { ParcelsErrors } from './parcels.types';

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
    TuiButton,
  ],
  templateUrl: './parcels.component.html',
  styleUrl: './parcels.component.css',
  providers: [
    {
      provide: PARCEL_ITEM_LIMIT_TOKEN,
      useFactory: (limits: CargoRestrictionsService) => limits.parcelItemLimits,
      deps: [CargoRestrictionsService],
    },
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
  @Output() dataChange = new EventEmitter<Parcels>();
  @Output() validationChange = new EventEmitter<boolean>();

  private readonly alert = inject(TuiAlertService);

  public parcelItemLimits: Signal<ParcelItemLimits> = inject(PARCEL_ITEM_LIMIT_TOKEN);

  private previousLimits?: ParcelItemLimits;

  /** Protected properties */
  protected canAddParcelItem = true;

  /** Private properties */
  private readonly fb = inject(NonNullableFormBuilder);
  private readonly destroyRef = inject(DestroyRef);
  private transloco = inject(TranslocoService);
  private alertSub?: Subscription;

  /** Public properties */
  parcels = this.fb.array<ParcelItem>([]);
  parcelsError = new FormControl(null);

  private readonly limitsEffect = effect(() => {
    const limits = this.parcelItemLimits();

    // Show alert only when limits actually change
    if (!this.previousLimits || !isObjectsEqual(this.previousLimits, limits) || !this.alertSub) {
      this.previousLimits = limits;
      this.showNotification(limits);
    }

    if (!this.parcels) return;

    this.updateValidator();
  });

  /** Getters */
  get errors(): ParcelsErrors {
    return this.parcelsError.errors as ParcelsErrors;
  }

  /** Lifecycle hooks */
  ngOnChanges(changes: SimpleChanges): void {
    if (
      changes['data'] &&
      !changes['data'].firstChange &&
      !isObjectsEqual(changes['data'].previousValue, changes['data'].currentValue)
    ) {
      this.reinitializeForm();
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
      this.validationChange.emit(!this.parcels.invalid);
    });
  }

  protected showNotification(limits: ParcelItemLimits): void {
    if (this.alertSub) {
      this.alertSub.unsubscribe();
      this.alertSub = undefined;
    }

    this.alertSub = this.alert
      .open<number>(new PolymorpheusComponent(LimitsAlertComponent), {
        label: this.transloco.translate('deliveryDetails.parcel.messages.limits'),
        data: limits,
        appearance: 'warning',
        autoClose: 0,
      })
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        finalize(() => {
          this.alertSub = undefined;
        }),
      )
      .subscribe();
  }
}
