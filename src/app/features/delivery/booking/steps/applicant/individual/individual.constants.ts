import type { TranslocoService } from '@jsverse/transloco';
import type { TuiValidationError } from '@taiga-ui/cdk';

import { type IndividualRole, IndividualType } from './individual.types';

export const individualRoles: IndividualRole[] = [
  {
    value: IndividualType.SENDER,
    label: 'Отправитель',
  },
  {
    value: IndividualType.RECIPIENT,
    label: 'Получатель',
  },
];

export function individualValidationErrors(
  service: TranslocoService,
): Record<string, (context: never) => TuiValidationError | string> {
  return {
    required: () => service.translate('validation.required'),
    minlength: ({ requiredLength }: { requiredLength: number }) =>
      service.translate('validation.minlength', { requiredLength }),
    maxlength: ({ requiredLength }: { requiredLength: number }) =>
      service.translate('validation.maxlength', { requiredLength }),
    lastName: () => service.translate('user.validation.lastName'),
    middleName: () => service.translate('user.validation.middleName'),
    firstName: () => service.translate('user.validation.firstName'),
    fullName: () => service.translate('user.validation.fullName'),
    email: () => service.translate('contacts.validation.email'),
    phone: () => service.translate('contacts.validation.phone'),
  };
}
