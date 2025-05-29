import { createActionGroup, props } from '@ngrx/store';

import type { ApiError } from '@shared/types';

import type { Confidant, ProfileField } from '../types';

export const ProfileActions = createActionGroup({
  source: 'Profile',
  events: {
    'Get Fields': props<{ userId: string }>(),
    'Get Fields Success': props<{ items: ProfileField[] }>(),
    'Get Fields Failure': props<{ error: ApiError }>(),
    'Update Fields': props<{ userId: string; payload: unknown }>(),
    'Update Fields Success': props<{ items: ProfileField[] }>(),
    'Update Fields Failure': props<{ error: ApiError }>(),
    'Get Confidants': props<{ userId: string }>(),
    'Get Confidants Success': props<{ items: Confidant[] }>(),
    'Get Confidants Failure': props<{ error: ApiError }>(),
  },
});
