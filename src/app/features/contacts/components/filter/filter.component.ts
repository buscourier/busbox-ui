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

import { cn } from '@core/utils';

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
  host: {
    class: `block`,
  },
})
export class FilterComponent implements OnInit {
  @Input({ required: true }) cities!: PickupCity[];
  @Input() initialCity: PickupCity | null = null;
  @Input() initialOfficeType: OfficeType | null = null;

  @Output() filterChange = new EventEmitter<Filter>();

  form!: FilterForm;

  get city(): FormControl<PickupCity | null> {
    return this.form.controls.city;
  }

  get officeType(): FormControl<OfficeType | null> {
    return this.form.controls.officeType;
  }

  private readonly destroyRef = inject(DestroyRef);
  private readonly fb = inject(FormBuilder);

  readonly filterActions: FilterAction[] = [
    { id: OfficeType.ANY, name: 'Все адреса', icon: 'location' },
    { id: OfficeType.GIVE, name: 'Прием груза', icon: 'give' },
    { id: OfficeType.GET, name: 'Выдача груза', icon: 'get' },
    { id: OfficeType.OFFICE, name: 'Офис', icon: 'office' },
  ];

  getButtonClasses(isActive: boolean): string {
    return cn(
      'min-w-14 px-3.5 pt-3 pb-3',
      'flex flex-grow flex-col items-center',
      'rounded-sm bg-white transition-colors shadow-sm',
      'border border-gray-200 hover:border-yellow-500',
      'cursor-pointer',

      {
        'bg-yellow-500 border-yellow-500': isActive,
      },
    );
  }

  ngOnInit(): void {
    this.initializeForm();
  }

  initializeForm(): void {
    this.form = this.fb.group({
      city: this.fb.control<PickupCity | null>(null),
      officeType: this.fb.control<OfficeType>(OfficeType.ANY),
    });

    console.log('this.initialCity', this.initialCity);

    if (this.initialCity) {
      this.form.patchValue({
        city: this.initialCity,
      });
    }

    if (this.initialOfficeType) {
      this.form.patchValue({
        officeType: this.initialOfficeType || OfficeType.ANY,
      });
    }

    this.form.valueChanges.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((value) => {
      this.filterChange.emit(value as Filter);
    });
  }

  setFilter(value: OfficeType): void {
    this.officeType.setValue(value);
  }
}
