import { inject, Injectable } from '@angular/core';
import { type ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { filter, type Observable, startWith } from 'rxjs';
import { map } from 'rxjs/operators';

import { NavigationService } from '@core/services/navigation.service';

export interface BreadcrumbItem {
  caption: string;
  routerLink: string[];
  isActive?: boolean;
  icon?: string;
  disabled?: boolean;
}

@Injectable({
  providedIn: 'root',
})
export class BreadcrumbsService {
  private readonly router = inject(Router);
  private navigationService = inject(NavigationService);

  getBreadcrumbs(): Observable<BreadcrumbItem[]> {
    return this.router.events.pipe(
      filter((event) => event instanceof NavigationEnd),
      startWith(null),
      map(() => {
        const breadcrumbs = this.buildBreadcrumbs(this.router.routerState.root);

        // Add the root element if necessary
        // if (breadcrumbs.length > 0) {
        //   breadcrumbs.unshift({
        //     caption: 'Главная',
        //     routerLink: ['/'],
        //     icon: 'home',
        //   });
        // }

        // Mark the last item as active
        if (breadcrumbs.length > 0) {
          breadcrumbs[breadcrumbs.length - 1].isActive = true;
        }

        // Remove breadcrumbs if only one element or duplication
        if (breadcrumbs.length <= 1) {
          return [];
        }

        // Remove if last item duplicates second-to-last itemRetry
        if (breadcrumbs.length > 1) {
          const lastItem = breadcrumbs[breadcrumbs.length - 1];
          const secondLastItem = breadcrumbs[breadcrumbs.length - 2];

          if (lastItem.caption === secondLastItem.caption) {
            return [];
          }
        }

        return breadcrumbs;
      }),
    );
  }

  private buildBreadcrumbs(
    route: ActivatedRoute,
    url = '',
    breadcrumbs: BreadcrumbItem[] = [],
  ): BreadcrumbItem[] {
    // Get only the active child route
    const child = route.firstChild;

    if (!child) {
      return breadcrumbs;
    }

    const routeURL: string = child.snapshot.url.map((segment) => segment.path).join('/');

    if (routeURL !== '') {
      url += `/${routeURL}`;
    }

    const data = child.snapshot.data;

    let title = data['title'];

    if (!title && data['pageKey']) {
      const content = this.navigationService.getPageContent(data['pageKey']);
      title = content?.title;
    }

    if (title && !data['hideBreadcrumb']) {
      breadcrumbs.push({
        caption: title,
        routerLink: [url],
        icon: data['icon'],
        isActive: false,
      });
    }

    // Recursively process the next level
    return this.buildBreadcrumbs(child, url, breadcrumbs);
  }
}
