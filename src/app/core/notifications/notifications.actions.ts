import { createActionGroup, props } from '@ngrx/store';

export const NotificationsActions = createActionGroup({
  source: 'Notifications',
  events: {
    showError: props<{ message: string }>(),
    showSuccess: props<{ message: string }>(),
  },
});
