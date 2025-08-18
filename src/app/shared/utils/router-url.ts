import type { ActivatedRouteSnapshot } from '@angular/router';

export function routeSnapshotToUrl(route: ActivatedRouteSnapshot): string {
  const segments: string[] = [];
  let currentRoute: ActivatedRouteSnapshot | null = route;

  while (currentRoute) {
    // Add fragment of current path
    currentRoute.url.forEach((segment) => {
      if (segment.path) {
        segments.push(segment.path);
      }
    });

    // Got to child root
    currentRoute = currentRoute.firstChild;
  }

  let url = '/' + segments.join('/');

  // Add query params from root
  const queryParams = route.queryParams;
  if (Object.keys(queryParams).length > 0) {
    const queryString = Object.entries(queryParams)
      .map(([key, value]) => `${key}=${encodeURIComponent(value)}`)
      .join('&');
    url += `?${queryString}`;
  }

  // Add fragment
  if (route.fragment) {
    url += `#${route.fragment}`;
  }

  return url;
}
