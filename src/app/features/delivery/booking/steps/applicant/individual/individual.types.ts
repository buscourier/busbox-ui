import type { FormControl, FormGroup } from '@angular/forms';

import type { Individual } from '../../../types';

export type IndividualForm = FormGroup<{
  [K in keyof Individual]: FormControl<Individual[K]>;
}>;

export enum IndividualType {
  SENDER = 'sender',
  RECIPIENT = 'recipient',
}

export interface IndividualRole {
  value: IndividualType;
  label: 'Отправитель' | 'Получатель';
}
