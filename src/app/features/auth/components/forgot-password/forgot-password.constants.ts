import type { TranslocoService } from '@jsverse/transloco';
import type { TuiValidationError } from '@taiga-ui/cdk';

export function validationErrors(
  service: TranslocoService,
): Record<string, (context: never) => TuiValidationError | string> {
  return {
    required: () => service.translate('validation.required'),
    email: () => service.translate('validation.email'),
  };
}
