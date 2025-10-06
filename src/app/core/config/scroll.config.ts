import type { InMemoryScrollingOptions } from '@angular/router';

export function getScrollConfig(): InMemoryScrollingOptions {
  return {
    scrollPositionRestoration: 'top',
    anchorScrolling: 'enabled',
  };
}
