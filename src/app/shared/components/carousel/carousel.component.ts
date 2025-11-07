import { isPlatformBrowser, NgTemplateOutlet } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  HostBinding,
  HostListener,
  inject,
  Input,
  Output,
  PLATFORM_ID,
  type TemplateRef,
} from '@angular/core';
import { TuiItem } from '@taiga-ui/cdk';
import { TuiButton, TuiIcon } from '@taiga-ui/core';
import { TuiCarousel, TuiCarouselComponent, TuiPagination } from '@taiga-ui/kit';

import { BreakpointService } from '@core/services/breakpoint.service';
import { CAROUSEL_BREAKPOINTS } from '@core/tokens';
import { cn } from '@core/utils';

import type { CarouselBreakpoints } from './carousel.types';

@Component({
  selector: 'app-carousel',
  imports: [
    NgTemplateOutlet,
    TuiButton,
    TuiCarouselComponent,
    TuiPagination,
    TuiItem,
    TuiCarousel,
    TuiIcon,
  ],
  templateUrl: './carousel.component.html',
  styleUrl: './carousel.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CarouselComponent<T> {
  @Input({ required: true }) items: T[] = [];
  @Input({ required: true }) itemTemplate!: TemplateRef<unknown>;
  @Input() breakpoints?: CarouselBreakpoints;
  @Input() appearance: 'primary' | 'secondary' = 'primary';
  @Input() pagination: 'top' | 'bottom' = 'bottom';
  @Input() slidesShadow = true;
  @Output() slideChange = new EventEmitter<number>();

  @HostBinding('class') get hostClasses(): string {
    return cn('relative block w-full', {
      'carousel-secondary': this.appearance === 'secondary',
      'slides-shadow': this.slidesShadow,
    });
  }

  @HostListener('window:resize')
  onResize(): void {
    this.currentIndex = 0;
  }

  protected readonly Math = Math;
  currentIndex = 0;

  private readonly breakPoints = inject(BreakpointService);
  private readonly defaultBreakpoints = inject(CAROUSEL_BREAKPOINTS);
  private readonly platformId = inject(PLATFORM_ID);

  get topPaginationClasses(): string {
    return cn('relative z-10 mb-4 flex justify-end', {
      'pr-5': this.slidesShadow,
    });
  }

  get bottomPaginationClasses(): string {
    return cn('relative z-10 mt-8 flex justify-center');
  }

  get itemsCount(): number {
    if (!isPlatformBrowser(this.platformId)) return 1;

    const breakpoint = this.breakPoints.getCurrentBreakpoint();
    const config = this.breakpoints || this.defaultBreakpoints;

    switch (breakpoint) {
      case 'xs':
        return config.default;
      case 'sm':
        return config.sm || config.default;
      case 'md':
        return config.md || config.sm || config.default;
      case 'lg':
        return config.lg || config.md || config.sm || config.default;
      case 'xl':
        return config.xl || config.lg || config.md || config.sm || config.default;
      case '2xl':
        return config['2xl'] || config.xl || config.lg || config.md || config.sm || config.default;
      default:
        return config.default;
    }
  }

  get maxIndex(): number {
    const visible = this.itemsCount;
    const max = this.items.length - visible;
    return Math.max(0, isFinite(max) ? max : 0);
  }

  onIndexChange(index: number): void {
    const maxIndex = this.maxIndex;

    if (this.items.length === 0) {
      this.currentIndex = 0;
      this.slideChange.emit(0);
      return;
    }

    if (index > maxIndex) {
      this.currentIndex = 0;
    } else if (index < 0) {
      this.currentIndex = maxIndex;
    } else {
      this.currentIndex = index;
    }

    this.slideChange.emit(this.currentIndex);
  }

  onPrevClick(): void {
    const maxIndex = this.maxIndex;
    if (this.items.length === 0) {
      return;
    }

    if (this.currentIndex === 0) {
      this.currentIndex = maxIndex;
    } else {
      this.currentIndex = this.currentIndex - 1;
    }
    this.slideChange.emit(this.currentIndex);
  }

  onNextClick(): void {
    const maxIndex = this.maxIndex;
    if (this.items.length === 0) {
      return;
    }

    if (this.currentIndex >= maxIndex) {
      this.currentIndex = 0;
    } else {
      this.currentIndex = this.currentIndex + 1;
    }
    this.slideChange.emit(this.currentIndex);
  }
}
