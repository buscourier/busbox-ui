import { createActionGroup, emptyProps, props } from '@ngrx/store';

import type { ApiError, Confidant } from '@shared/types';

import type { ProfileField } from '../types';

export const ProfileActions = createActionGroup({
  source: 'Profile',
  events: {
    'Load Fields': emptyProps(),
    'Load Fields Success': props<{ data: ProfileField[] }>(),
    'Load Fields Failure': props<{ error: ApiError }>(),
    'Update Fields': props<{ payload: unknown }>(),
    'Update Fields Success': props<{ data: ProfileField[] }>(),
    'Update Fields Failure': props<{ error: ApiError }>(),
    'Load Confidants': emptyProps(),
    'Load Confidants Success': props<{ data: Confidant[] }>(),
    'Load Confidants Failure': props<{ error: ApiError }>(),
  },
});
