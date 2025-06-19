import { isPlatformBrowser } from '@angular/common';
import { Injectable, signal, computed, DestroyRef, inject, PLATFORM_ID } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { fromEvent, debounceTime, startWith } from 'rxjs';

export const BREAKPOINTS = {
  sm: 640, // 40rem
  md: 768, // 48rem
  lg: 1024, // 64rem
  xl: 1280, // 80rem
  '2xl': 1536, // 96rem
} as const;

export type BreakpointKey = keyof typeof BREAKPOINTS;

@Injectable({
  providedIn: 'root',
})
export class BreakpointService {
  private readonly platformId = inject(PLATFORM_ID);
  private readonly destroyRef = inject(DestroyRef);

  private readonly currentWidth = signal<number>(
    isPlatformBrowser(this.platformId) ? window.innerWidth : 1024,
  );

  constructor() {
    if (isPlatformBrowser(this.platformId)) {
      fromEvent(window, 'resize')
        .pipe(debounceTime(100), startWith(null), takeUntilDestroyed(this.destroyRef))
        .subscribe(() => {
          this.currentWidth.set(window.innerWidth);
        });
    }
  }

  get width() {
    return this.currentWidth.asReadonly();
  }

  readonly isSm = computed(() => this.currentWidth() >= BREAKPOINTS.sm);
  readonly isMd = computed(() => this.currentWidth() >= BREAKPOINTS.md);
  readonly isLg = computed(() => this.currentWidth() >= BREAKPOINTS.lg);
  readonly isXl = computed(() => this.currentWidth() >= BREAKPOINTS.xl);
  readonly is2xl = computed(() => this.currentWidth() >= BREAKPOINTS['2xl']);

  // Devices
  readonly isMobile = computed(() => this.currentWidth() < BREAKPOINTS.md);
  readonly isTablet = computed(
    () => this.currentWidth() >= BREAKPOINTS.md && this.currentWidth() < BREAKPOINTS.lg,
  );
  readonly isDesktop = computed(() => this.currentWidth() >= BREAKPOINTS.lg);

  // Exact ranges
  readonly isSmOnly = computed(
    () => this.currentWidth() >= BREAKPOINTS.sm && this.currentWidth() < BREAKPOINTS.md,
  );
  readonly isMdOnly = computed(
    () => this.currentWidth() >= BREAKPOINTS.md && this.currentWidth() < BREAKPOINTS.lg,
  );
  readonly isLgOnly = computed(
    () => this.currentWidth() >= BREAKPOINTS.lg && this.currentWidth() < BREAKPOINTS.xl,
  );

  isBreakpoint(breakpoint: BreakpointKey): boolean {
    return this.currentWidth() >= BREAKPOINTS[breakpoint];
  }

  isInRange(min: BreakpointKey, max?: BreakpointKey): boolean {
    const width = this.currentWidth();
    const minWidth = BREAKPOINTS[min];

    if (!max) {
      return width >= minWidth;
    }

    const maxWidth = BREAKPOINTS[max];
    return width >= minWidth && width < maxWidth;
  }

  getCurrentBreakpoint(): BreakpointKey | 'xs' {
    const width = this.currentWidth();

    if (width >= BREAKPOINTS['2xl']) return '2xl';
    if (width >= BREAKPOINTS.xl) return 'xl';
    if (width >= BREAKPOINTS.lg) return 'lg';
    if (width >= BREAKPOINTS.md) return 'md';
    if (width >= BREAKPOINTS.sm) return 'sm';
    return 'xs';
  }
}
