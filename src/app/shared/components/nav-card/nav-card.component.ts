import {
  ChangeDetectionStrategy,
  Component,
  HostListener,
  Input,
  inject,
  HostBinding,
} from '@angular/core';
import { Router } from '@angular/router';
import { TuiIcon } from '@taiga-ui/core';

import { cn } from '@core/utils';

import type { NavigationItem } from '@shared/types';

@Component({
  selector: 'app-nav-card',
  imports: [TuiIcon],
  templateUrl: './nav-card.component.html',
  styleUrl: './nav-card.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NavCardComponent {
  @Input() item!: NavigationItem;

  @HostBinding('class') get hostClasses(): string {
    return cn(
      'group cursor-pointer p-6',
      'rounded-2xl border border-gray-100 bg-white',
      'shadow-lg transition-all hover:shadow-xl active:translate-y-[4px] active:shadow-none',
      'focus:border-yellow-400 focus:ring-2 focus:ring-yellow-400 focus:outline-none',
      'select-none',
    );
  }

  @HostBinding('attr.aria-label') get ariaLabel() {
    return this.item?.name ?? '';
  }

  @HostBinding('attr.role') role = 'button';
  @HostBinding('attr.tabindex') tabindex = 0;

  @HostListener('keydown.enter')
  @HostListener('keydown.space')
  onKeyboardActivation(): void {
    this.onClick();
  }

  @HostListener('click')
  onClick(): void {
    if (this.item) {
      this.router.navigate([this.item.link]);
    }
  }

  private readonly router = inject(Router);

  get markerClass() {
    if (!this.item.badge) return;

    const badge = this.item.badge;

    return cn('pulse-dot mr-2 h-2 w-2 rounded-full', {
      'bg-green-400': badge.color === 'green',
      'bg-red-400': badge.color === 'red',
      'bg-blue-400': badge.color === 'blue',
      'bg-yellow-400': badge.color === 'yellow',
      'bg-orange-400': badge.color === 'orange',
    });
  }

  get iconWrapperClass() {
    return cn(
      'flex h-12 w-12 items-center justify-center',
      'rounded-xl bg-yellow-50 text-xl text-yellow-500',
      'transition-transform group-hover:scale-110 group-hover:rotate-12 group-hover:bg-yellow-500/20',
    );
  }
}
