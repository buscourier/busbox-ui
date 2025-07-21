import type { TranslocoService } from '@jsverse/transloco';
import type { TuiValidationError } from '@taiga-ui/cdk';

export function getValidationErrors(
  service: TranslocoService,
): Record<string, (context: never) => TuiValidationError | string> {
  return {
    required: () => service.translate('validation.required'),
    minlength: ({ requiredLength }: { requiredLength: number }) =>
      service.translate('validation.minlength', { requiredLength }),
    maxlength: ({ requiredLength }: { requiredLength: number }) =>
      service.translate('validation.maxlength', { requiredLength }),
    fullName: () => service.translate('user.validation.lastName'),
    email: () => service.translate('contacts.validation.email'),
    phone: () => service.translate('contacts.validation.phone'),
  };
}
