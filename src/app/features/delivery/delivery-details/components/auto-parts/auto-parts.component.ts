import { type OnInit, signal } from '@angular/core';
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
import { TuiIcon } from '@taiga-ui/core';
import { debounceTime } from 'rxjs';

import { DEBOUNCE_TIME } from '@core/constants';

// eslint-disable-next-line import/no-internal-modules
import { PARCEL_ITEM_DEFAULTS, parcelItemAnimation } from '../../shared/components/parcel-item';
import { PARCEL_ITEM_LIMIT_TOKEN } from '../../tokens';
import type { AutoPart, AutoPartPreset, AutoParts } from '../../types';

import { AutoPartComponent } from './auto-part';

@Component({
  selector: 'app-auto-parts',
  imports: [ReactiveFormsModule, TuiIcon, AutoPartComponent],
  templateUrl: './auto-parts.component.html',
  styleUrl: './auto-parts.component.css',
  animations: [parcelItemAnimation],
  providers: [
    {
      provide: PARCEL_ITEM_LIMIT_TOKEN,
      useValue: signal({
        QUANTITY: {
          MIN: 1,
          MAX: 10,
        },
        WEIGHT: {
          MIN: 1,
          MAX: 60,
        },
        DIMENSIONS: {
          MIN: 1,
          MAX: 380,
        },
      }),
    },
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AutoPartsComponent implements OnInit {
  @Input() data: AutoParts | null = null;
  @Input({ required: true }) options!: AutoPartPreset[];
  @Output() dataChange = new EventEmitter<AutoParts>();
  @Output() validationChange = new EventEmitter<boolean>();

  private readonly fb = inject(NonNullableFormBuilder);
  private readonly destroyRef = inject(DestroyRef);

  protected canAddItem = true;

  items = this.fb.array<AutoPart>([]);
  itemsError = new FormControl(null);

  ngOnInit() {
    this.initializeForm();
    this.setupValueChanges();
    this.setupErrorHandling();
  }

  private initializeForm(): void {
    if (!this.data?.items.length) {
      this.addItem();
    }

    if (this.data?.items) {
      this.data.items.forEach((autoPart) => this.addItem(autoPart));
    }
  }

  addItem(item?: AutoPart): void {
    this.items.push(
      this.fb.control(
        item ?? {
          preset: null,
          params: {
            quantity: PARCEL_ITEM_DEFAULTS.QUANTITY,
            weight: PARCEL_ITEM_DEFAULTS.WEIGHT,
            dimensions: {
              width: PARCEL_ITEM_DEFAULTS.DIMENSIONS,
              height: PARCEL_ITEM_DEFAULTS.DIMENSIONS,
              length: PARCEL_ITEM_DEFAULTS.DIMENSIONS,
            },
          },
        },
      ),
    );
  }

  removeItem(index: number): void {
    this.items.removeAt(index);
  }

  private setupValueChanges(): void {
    this.items.valueChanges.pipe(debounceTime(DEBOUNCE_TIME.DEFAULT)).subscribe((items) => {
      this.dataChange.emit({ items });
    });
  }

  private setupErrorHandling(): void {
    this.items.statusChanges.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(() => {
      this.itemsError.setErrors(this.items.errors);
      this.itemsError.markAsTouched();

      this.validationChange.emit(!this.items.invalid);
    });
  }
}
