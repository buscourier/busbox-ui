import { ChangeDetectionStrategy, Component, HostBinding, Input } from '@angular/core';
import { TuiIcon } from '@taiga-ui/core';

import { cn } from '@core/utils';

import type { BrandCard } from './brand-card.types';

@Component({
  selector: 'app-brand-card',
  imports: [TuiIcon],
  templateUrl: './brand-card.component.html',
  styleUrl: './brand-card.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BrandCardComponent {
  @Input({ required: true }) brand: BrandCard | null = null;

  @HostBinding('class') get hostClasses(): string {
    return cn(
      'flex h-36 min-w-60 items-center justify-center',
      'rounded-sm border border-transparent',
      'bg-white shadow-xl',
      'hover:border-yellow-500 hover:shadow-none',
      '',
    );
  }

  // get cardClasses(): string {
  //   return cn('');
  // }
}
