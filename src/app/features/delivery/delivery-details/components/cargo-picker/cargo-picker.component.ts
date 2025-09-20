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
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { TranslocoPipe, TranslocoService } from '@jsverse/transloco';
import type { TuiBooleanHandler } from '@taiga-ui/cdk';
import { TuiAlertService, TuiButton, TuiHintDirective } from '@taiga-ui/core';
import { TuiRadioList } from '@taiga-ui/kit';
import { filter } from 'rxjs';

import { CargoRestrictionsService } from '../../services';
import { CARGO_LIMITS } from '../../tokens';
import {
  type Cargo,
  type CargoItemRestrictions,
  CargoType,
  CargoTypeId,
  type MappedCargoType,
} from '../../types';

@Component({
  selector: 'app-cargo-picker',
  imports: [TuiRadioList, ReactiveFormsModule, TuiHintDirective, TuiButton, TranslocoPipe],
  templateUrl: './cargo-picker.component.html',
  styleUrl: './cargo-picker.component.css',
  providers: [
    {
      provide: CARGO_LIMITS,
      useFactory: (limits: CargoRestrictionsService) => limits.cargoLimits,
      deps: [CargoRestrictionsService],
    },
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'block mb-6',
  },
})
export class CargoPickerComponent implements OnInit, OnChanges {
  @Input({ required: true }) types!: Cargo[];
  @Input() activeType: CargoType | null = null;
  @Output() typeChange = new EventEmitter<CargoType>();

  typeControl = new FormControl<MappedCargoType | null>(null);
  mappedTypes: MappedCargoType[] = [];

  private readonly alert = inject(TuiAlertService);
  private readonly destroyRef = inject(DestroyRef);
  private transloco = inject(TranslocoService);

  private restrictions: Signal<CargoItemRestrictions> = inject(CARGO_LIMITS);

  private readonly limitsEffect = effect(() => {
    this.restrictions();
    this.handleRestrictionsChange();
  });

  ngOnInit(): void {
    this.setupTypeChanges();
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.handleTypesChange(changes);
    this.handleActiveTypeChange(changes);
  }

  identityMatcher = (a: MappedCargoType | null, b: MappedCargoType | null): boolean => {
    if (!a || !b) return false;
    return a.value === b.value;
  };

  hasRestriction(data: MappedCargoType): boolean {
    if (!this.restrictions()) return false;
    if (!this.isRestrictedType(data.value)) return false;

    return !!(
      this.restrictions().pickupCourier ||
      this.restrictions().deliveryCourier ||
      this.restrictions().pickupOffice ||
      this.restrictions().deliveryOffice ||
      this.restrictions().pickupCourier ||
      this.restrictions().deliveryCourier ||
      this.restrictions().pickupOffice ||
      this.restrictions().deliveryOffice
    );
  }

  getRestrictionMessage(data: MappedCargoType): string | null {
    if (!this.hasRestriction(data)) return null;

    return (
      this.restrictions().pickupCourier?.message ||
      this.restrictions().deliveryCourier?.message ||
      this.restrictions().pickupOffice?.message ||
      this.restrictions().deliveryOffice?.message ||
      this.restrictions().pickupCourier?.message ||
      this.restrictions().deliveryCourier?.message ||
      this.restrictions().pickupOffice?.message ||
      this.restrictions().deliveryOffice?.message ||
      null
    );
  }

  protected showNotification(): void {
    this.alert
      .open(this.getNotificationMessage(this.typeControl.value?.name || ''), {
        label: 'Ограничение',
        appearance: 'warning',
        autoClose: 0,
      })
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe();
  }

  protected readonly disabledHandler: TuiBooleanHandler<MappedCargoType> = (item) => {
    return this.hasRestriction(item);
  };

  private setupTypeChanges(): void {
    this.typeControl.valueChanges
      .pipe(filter(Boolean), takeUntilDestroyed(this.destroyRef))
      .subscribe((value) => this.typeChange.emit(value.value));
  }

  private handleTypesChange(changes: SimpleChanges): void {
    console.log("changes['types'] ", changes['types']);
    if (changes['types'] && changes['types'].firstChange) {
      this.mappedTypes = this.mapCargoTypes(this.types);
    }
  }

  private handleActiveTypeChange(changes: SimpleChanges): void {
    if (!changes['activeType'] || !this.mappedTypes.length) return;

    if (this.activeType) {
      this.setActiveType();
    } else {
      this.setDefaultType();
    }
  }

  private handleRestrictionsChange(): void {
    if (!this.typeControl.value) return;

    const hasRestrictions = this.hasRestriction(this.typeControl.value);

    if (hasRestrictions && this.isRestrictedType(this.activeType)) {
      this.showNotification();
      this.typeChange.emit(CargoType.DOCUMENTS);
    }
  }

  private setActiveType(): void {
    const initialValue = this.mappedTypes.find((type) => type.value === this.activeType);
    if (initialValue) {
      this.typeControl.setValue(initialValue, { emitEvent: false });
    }
  }

  private setDefaultType(): void {
    const defaultValue = this.mappedTypes[0];

    if (defaultValue) {
      this.typeControl.setValue(defaultValue, { emitEvent: false });
      this.typeChange.emit(defaultValue.value);
    }
  }

  private isRestrictedType(type: CargoType | null): boolean {
    return type === CargoType.AUTO_PARTS || type === CargoType.OTHER;
  }

  private mapCargoTypes(types: Cargo[]): MappedCargoType[] {
    return types.map((type) => {
      switch (type.id) {
        case CargoTypeId.DOCUMENTS:
          return {
            value: CargoType.DOCUMENTS,
            name: 'deliveryDetails.documents.title',
          };
        case CargoTypeId.PARCELS:
          return { value: CargoType.PARCELS, name: 'deliveryDetails.parcels.title' };
        case CargoTypeId.AUTO_PARTS:
          return { value: CargoType.AUTO_PARTS, name: 'deliveryDetails.autoParts.title' };
        case CargoTypeId.OTHER:
          return { value: CargoType.OTHER, name: 'deliveryDetails.otherCargo.title' };
        default:
          return { value: CargoType.DOCUMENTS, name: 'deliveryDetails.documents.title' };
      }
    });
  }

  private getNotificationMessage(cargoName: string) {
    return `Вы выбрали <strong>${this.transloco.translate(cargoName)}</strong> для отправки.
     Этот тип груза <strong>невозмонжо</strong> передать курьеру.`;
  }
}
