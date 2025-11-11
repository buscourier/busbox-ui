import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  EventEmitter,
  inject,
  Input,
  type OnChanges,
  Output,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import type { FormControl } from '@angular/forms';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { TuiDropdownMobile } from '@taiga-ui/addon-mobile';
import { TuiButton, TuiIcon, TuiTextfield } from '@taiga-ui/core';
import {
  TuiBadge,
  TuiChevron,
  TuiDataListWrapper,
  TuiSelect,
  TuiStringifyContentPipe,
  TuiStringifyPipe,
} from '@taiga-ui/kit';

import { cn } from '@core/utils';

import type { Office } from '@shared/types';

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
    TuiButton,
    TuiBadge,
    TuiDropdownMobile,
    TuiSelect,
  ],
  templateUrl: './filter.component.html',
  styleUrl: './filter.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FilterComponent implements OnChanges {
  @Input({ required: true }) cities!: Office[];
  @Input() initialCity: Office | null = null;
  @Input() initialOfficeType: OfficeType | null = null;

  @Output() filterChange = new EventEmitter<Filter>();

  form!: FilterForm;

  get city(): FormControl<Office | null> {
    return this.form.controls.city;
  }

  get officeType(): FormControl<OfficeType | null> {
    return this.form.controls.officeType;
  }

  private readonly destroyRef = inject(DestroyRef);
  private readonly fb = inject(FormBuilder);

  readonly filterActions: FilterAction[] = [
    { id: OfficeType.ANY, name: 'Все адреса', icon: 'location' },
    { id: OfficeType.GIVE, name: 'Прием и выдача', icon: 'give' },
    { id: OfficeType.GET, name: 'Только выдача', icon: 'get' },
    // { id: OfficeType.OFFICE, name: 'Офис', icon: 'office' },
  ];

  getButtonClasses(isActive: boolean): string {
    return cn(
      'flex flex-1/3 grow flex-col items-center justify-center gap-1 lg:flex-row lg:gap-3',
      'cursor-pointer rounded-lg border border-gray-200 bg-white p-2 md:p-3 lg:h-[50px]',

      {
        'border-transparent bg-yellow-500/70 text-black': isActive,
      },
    );
  }

  ngOnChanges(): void {
    this.initializeForm();
  }

  initializeForm(): void {
    this.form = this.fb.group({
      city: this.fb.control<Office | null>(null),
      officeType: this.fb.control<OfficeType>(OfficeType.ANY),
    });

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
