import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  EventEmitter,
  inject,
  Input,
  type OnInit,
  Output,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import type { FormControl } from '@angular/forms';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { TuiIcon, TuiTextfield } from '@taiga-ui/core';
import {
  TuiChevron,
  TuiDataListWrapper,
  TuiStringifyContentPipe,
  TuiStringifyPipe,
} from '@taiga-ui/kit';

import type { PickupCity } from '@shared/types';

import { OfficeType } from '../../types';

import type { Filter, FilterForm } from './filter.types';

interface FilterAction {
  id: OfficeType;
  name: string;
  icon: string;
}

@Component({
  selector: 'app-filter',
  imports: [
    TuiIcon,
    TuiTextfield,
    TuiChevron,
    TuiStringifyPipe,
    ReactiveFormsModule,
    TuiDataListWrapper,
    TuiStringifyContentPipe,
  ],
  templateUrl: './filter.component.html',
  styleUrl: './filter.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FilterComponent implements OnInit {
  @Input() initialCity: PickupCity | null = null;
  @Input() initialOfficeType: OfficeType | null = null;
  @Input({ required: true }) cities!: PickupCity[];
  @Output() filterChange = new EventEmitter<Filter>();

  form!: FilterForm;

  get city(): FormControl<PickupCity | null> {
    return this.form.controls.city;
  }

  get officeType(): FormControl<OfficeType | null> {
    return this.form.controls.officeType;
  }

  // selectedCity = new FormControl<PickupCity | null>(null);
  // currentFilter = new FormControl<FilterAction['id']>(ServiceType.ANY);

  private readonly destroyRef = inject(DestroyRef);
  private readonly fb = inject(FormBuilder);

  readonly filterActions: FilterAction[] = [
    { id: OfficeType.ANY, name: 'Все адреса', icon: 'location' },
    { id: OfficeType.GIVE, name: 'Прием груза', icon: 'give' },
    { id: OfficeType.GET, name: 'Выдача груза', icon: 'get' },
    { id: OfficeType.OFFICE, name: 'Офис', icon: 'office' },
  ];

  ngOnInit(): void {
    this.initializeForm();

    if (this.initialCity || this.initialOfficeType) {
      this.form.patchValue({
        city: this.initialCity,
        officeType: this.initialOfficeType || OfficeType.ANY,
      });
    }

    this.form.valueChanges.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((value) => {
      this.filterChange.emit(value as Filter);
    });
  }

  initializeForm(): void {
    this.form = this.fb.group({
      city: this.fb.control<PickupCity | null>(null),
      officeType: this.fb.control<OfficeType>(OfficeType.ANY),
    });

    this.form.valueChanges.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((value) => {
      this.filterChange.emit(value as Filter);
    });
  }

  setFilter(value: OfficeType): void {
    this.officeType.setValue(value);
  }
}
