import { NgOptimizedImage } from '@angular/common';
import { ChangeDetectionStrategy, Component, HostBinding, Input } from '@angular/core';

import { cn } from '@core/utils';

import {
  type SimpleTableColumn,
  SimpleTableComponent,
  type SimpleTableRow,
} from '@shared/components/simple-table';

interface Table {
  columns: SimpleTableColumn[];
  rows: SimpleTableRow[];
}

@Component({
  selector: 'app-package',
  imports: [NgOptimizedImage, SimpleTableComponent],
  templateUrl: './package.component.html',
  styleUrl: './package.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PackageComponent {
  @Input() title = '';
  @Input() image = '';
  @Input() pricing: [string, string][] = [];
  @Input() table: Table | null = null;

  @HostBinding('class') get hostClasses(): string {
    return cn(
      'grid w-full grid-cols-1 items-start gap-x-8',
      'md:grid-cols-[1fr_auto] lg:grid-cols-1 xl:grid-cols-[1fr_auto]',
    );
  }

  get imageClasses() {
    return cn(
      'mb-4 block h-[175px] w-full rounded-sm bg-gray-50 object-cover text-gray-50 min-[460px]:max-w-[270px]',
      'md:col-start-2 md:row-span-3 md:row-start-1',
      'lg:col-start-1 lg:row-span-1 lg:row-start-3',
      'xl:col-start-2 xl:row-span-3 xl:row-start-1',
    );
  }

  get priceClasses() {
    return cn(
      'col-start-1 mt-2.5 px-7 py-3',
      'flex items-center space-x-0.5 justify-self-center min-[460px]:justify-self-start',
      'rounded-md border-2 border-yellow-500',
    );
  }
}
