import type { ApiError } from './api-error.types';

export interface LocationsErrorStatus {
  pickupCitiesError: ApiError | null;
  deliveryCitiesError: ApiError | null;
  officesError: ApiError | null;
  hasAnyError: boolean;
}
