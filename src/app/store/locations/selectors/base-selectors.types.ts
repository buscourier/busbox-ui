import type { MemoizedSelector } from '@ngrx/store';

import type { ApiError, DeliveryCity, Office, PickupCity } from '@shared/types';

export interface BaseSelectors {
  selectIsPickupCitiesLoading: MemoizedSelector<object, boolean>;
  selectIsPickupCitiesLoaded: MemoizedSelector<object, boolean>;
  selectPickupCities: MemoizedSelector<object, PickupCity[]>;
  selectPickupCitiesError: MemoizedSelector<object, ApiError | null>;

  selectIsDeliveryCitiesLoading: MemoizedSelector<object, boolean>;
  selectIsDeliveryCitiesLoaded: MemoizedSelector<object, boolean>;
  selectDeliveryCities: MemoizedSelector<object, DeliveryCity[]>;
  selectDeliveryCitiesError: MemoizedSelector<object, ApiError | null>;

  selectIsOfficesLoading: MemoizedSelector<object, boolean>;
  selectIsOfficesLoaded: MemoizedSelector<object, boolean>;
  selectOffices: MemoizedSelector<object, Office[]>;
  selectOfficesError: MemoizedSelector<object, ApiError | null>;
}
