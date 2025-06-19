import { Directive, effect, inject, Input, TemplateRef, ViewContainerRef } from '@angular/core';

import { type BreakpointKey, BreakpointService } from '@core/services/breakpoint.service';

interface BreakpointConfig {
  showOn?: BreakpointKey | BreakpointKey[];
  hideOn?: BreakpointKey | BreakpointKey[];
  from?: BreakpointKey;
  to?: BreakpointKey;
}

type BreakpointInput = BreakpointKey | BreakpointKey[] | BreakpointConfig;

@Directive({
  selector: '[appBreakpoint]',
  standalone: true,
})
export class BreakpointDirective {
  @Input() appBreakpoint: BreakpointInput = [];

  private readonly templateRef = inject(TemplateRef);
  private readonly viewContainer = inject(ViewContainerRef);
  private readonly breakpointService = inject(BreakpointService);

  private isVisible = false;

  constructor() {
    effect(() => {
      // const currentWidth = this.breakpointService.width();
      this.updateVisibility();
    });
  }

  private updateVisibility(): void {
    const shouldShow = this.shouldShowElement();

    if (shouldShow && !this.isVisible) {
      this.viewContainer.createEmbeddedView(this.templateRef);
      this.isVisible = true;
    } else if (!shouldShow && this.isVisible) {
      this.viewContainer.clear();
      this.isVisible = false;
    }
  }

  private shouldShowElement(): boolean {
    const config = this.normalizeConfig(this.appBreakpoint);

    if (config.from || config.to) {
      return this.checkRange(config.from, config.to);
    }

    if (config.showOn) {
      const showBreakpoints = Array.isArray(config.showOn) ? config.showOn : [config.showOn];

      const shouldShow = showBreakpoints.some((bp) => this.breakpointService.isBreakpoint(bp));

      if (!shouldShow) return false;
    }

    if (config.hideOn) {
      const hideBreakpoints = Array.isArray(config.hideOn) ? config.hideOn : [config.hideOn];

      const shouldHide = hideBreakpoints.some((bp) => this.breakpointService.isBreakpoint(bp));

      if (shouldHide) return false;
    }

    return true;
  }

  private normalizeConfig(input: BreakpointInput): BreakpointConfig {
    if (typeof input === 'string') {
      return { showOn: input };
    }

    if (Array.isArray(input)) {
      return { showOn: input };
    }

    return input;
  }

  private checkRange(from?: BreakpointKey, to?: BreakpointKey): boolean {
    if (from && to) {
      return this.breakpointService.isInRange(from, to);
    }

    if (from) {
      return this.breakpointService.isBreakpoint(from);
    }

    return true;
  }
}
