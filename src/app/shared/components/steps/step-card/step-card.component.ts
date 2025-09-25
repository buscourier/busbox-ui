import { ChangeDetectionStrategy, Component, HostBinding, Input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TuiIcon } from '@taiga-ui/core';

import { cn } from '@core/utils';

import { ContactLinkPipe } from '@shared/pipes';

import type { Step } from './step-card.types';

@Component({
  selector: 'app-step-card',
  imports: [TuiIcon, RouterLink, ContactLinkPipe],
  templateUrl: './step-card.component.html',
  styleUrl: './step-card.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StepCardComponent {
  @Input({ required: true }) step!: Step;

  @HostBinding('class') get hostClasses(): string {
    return cn('group block select-none');
  }

  get actionClass(): string {
    return cn(
      // Layout & positioning
      'inline-flex h-9 items-center justify-center gap-2',
      // Visual styling
      'rounded-md border border-yellow-500/20 px-3',
      // Typography
      'bg-yellow-500/10 text-sm font-medium whitespace-nowrap text-gray-700',
      // Interactions
      'cursor-pointer transition-colors group-hover:border-yellow-500 hover:bg-yellow-500 hover:text-gray-900',
      'shadow-xs transition-all active:translate-y-[2px] active:shadow-none',
    );
  }
}
