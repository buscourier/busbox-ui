import { createActionGroup, emptyProps, props } from '@ngrx/store';

import type { ApiError, DocumentFile } from '@shared/types';

export const DocumentsActions = createActionGroup({
  source: 'Documents',
  events: {
    'Load Documents': emptyProps(),
    'Load Documents Success': props<{ data: DocumentFile[] }>(),
    'Load Documents Failure': props<{ error: ApiError }>(),
  },
});
