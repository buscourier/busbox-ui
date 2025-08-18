import { inject, Injectable } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class NavigationDirectionService {
  private previousUrl = '';
  private navigationHistory: string[] = [];

  private readonly router = inject(Router);

  constructor() {
    this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe((event: NavigationEnd) => {
        this.updateNavigationHistory(event.url);
      });
  }

  private updateNavigationHistory(currentUrl: string): void {
    if (this.previousUrl && this.previousUrl !== currentUrl) {
      if (!this.navigationHistory.includes(this.previousUrl)) {
        this.navigationHistory.push(this.previousUrl);
      }

      if (this.navigationHistory.length > 10) {
        this.navigationHistory.shift();
      }
    }
    this.previousUrl = currentUrl;
  }

  shouldSkipAnimation(fromUrl: string, toUrl: string): boolean {
    if (fromUrl === toUrl) return true;
    if (!fromUrl || !toUrl) return false;

    const fromPath = fromUrl.split('?')[0].split('#')[0];
    const toPath = toUrl.split('?')[0].split('#')[0];

    return fromPath === toPath;
  }

  isBackNavigation(currentUrl: string): boolean {
    return this.navigationHistory.includes(currentUrl);
  }

  getNavigationType(toUrl: string, fromUrl = ''): 'forward' | 'back' | 'same-level' | 'modal' {
    if (this.isBackNavigation(toUrl)) return 'back';
    if (toUrl.includes('/modal') || toUrl.includes('/dialog')) return 'modal';

    // Same-level navigation
    if (fromUrl) {
      const toSegments = toUrl.split('/').filter(Boolean);
      const fromSegments = fromUrl.split('/').filter(Boolean);

      if (
        toSegments.length === fromSegments.length &&
        toSegments[0] === fromSegments[0] &&
        toSegments.length > 1
      ) {
        return 'same-level';
      }
    }

    return 'forward';
  }
}
