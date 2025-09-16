import type { ActivatedRoute } from '@angular/router';

export function canInitializeFromUrl(route: ActivatedRoute): boolean {
  const params = route.snapshot.queryParams;
  return !!(params['pickupCityId'] && params['deliveryCityId']);
}
