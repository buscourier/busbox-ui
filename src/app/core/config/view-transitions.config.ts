import { inject } from '@angular/core';
import type { ViewTransitionsFeatureOptions } from '@angular/router';

import { NavigationDirectionService } from '@core/services/navigation-direction.service';

import { routeSnapshotToUrl } from '@shared/utils';

export function getViewTransitionsConfig(): ViewTransitionsFeatureOptions {
  return {
    skipInitialTransition: true,
    onViewTransitionCreated: (transitionInfo) => {
      try {
        const navigationService = inject(NavigationDirectionService);

        const fromUrl = transitionInfo.from ? routeSnapshotToUrl(transitionInfo.from) : '';
        const toUrl = routeSnapshotToUrl(transitionInfo.to);

        document.documentElement.classList.remove(
          'router-back',
          'vertical-nav',
          'page-modal',
          'no-view-transition',
          'forward',
        );

        if (navigationService.shouldSkipAnimation(fromUrl, toUrl)) {
          document.documentElement.classList.add('no-view-transition');
          // console.log('Animation skipped:', { from: fromUrl, to: toUrl });
          return;
        }

        const navigationType = navigationService.getNavigationType(toUrl, fromUrl);

        switch (navigationType) {
          case 'back':
            document.documentElement.classList.add('router-back');
            break;
          case 'same-level':
            document.documentElement.classList.add('vertical-nav');
            break;
          case 'modal':
            document.documentElement.classList.add('page-modal');
            break;
          default:
            document.documentElement.classList.add('forward');
        }

        // console.log('Navigation:', { type: navigationType, from: fromUrl, to: toUrl });
      } catch (error) {
        console.warn('View transition error:', error);
        document.documentElement.classList.add('no-view-transition');
      }
    },
  };
}
