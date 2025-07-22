import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  HostBinding,
  Input,
  Output,
} from '@angular/core';
import { TuiHint, TuiIcon, TuiScrollbar } from '@taiga-ui/core';

import { cn } from '@core/utils';

import type { Office } from '@shared/types';

@Component({
  selector: 'app-office-list',
  imports: [TuiScrollbar, TuiHint, TuiIcon],
  templateUrl: './office-list.component.html',
  styleUrl: './office-list.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OfficeListComponent {
  @Input({ required: true }) activeOffice!: Office | null;
  @Input({ required: true }) offices!: Office[];

  @Output() selectOffice = new EventEmitter<string>();

  @HostBinding('class') get hostClasses(): string {
    return cn(
      'h-full rounded-sm bg-white',
      'md:border md:border-gray-200 md:shadow-md md:p-5 md:pr-2.5',
    );
  }

  getCityNameClasses(isActive: boolean | null): string {
    return cn(
      'relative text-blue-500 hover:cursor-pointer',
      'col-start-1 col-end-2 row-start-1 row-end-2 justify-self-start',
      'border-b border-dashed border-blue-500',

      {
        'font-bold text-yellow-500 border-yellow-500': isActive,
      },
    );
  }

  onSelectOffice(id: string) {
    this.selectOffice.emit(id);
  }
}
