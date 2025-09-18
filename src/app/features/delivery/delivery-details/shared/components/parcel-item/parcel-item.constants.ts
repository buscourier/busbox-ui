import type { TranslocoService } from '@jsverse/transloco';
import type { TuiValidationError } from '@taiga-ui/cdk';

import type { ParcelItem, ParcelItemLimits } from '../../../types';

export const limitKeyMap: Record<
  Exclude<keyof ParcelItem, 'dimensions'>,
  keyof ParcelItemLimits
> = {
  quantity: 'QUANTITY',
  weight: 'WEIGHT',
};

export const PARCEL_ITEM_DEFAULTS = {
  QUANTITY: 1,
  WEIGHT: 0.5,
  DIMENSIONS: 10,
};

// Интерфейсы для различных контекстов валидации
interface MinContext {
  min: number;
}

interface MaxContext {
  max: number;
}

interface DimensionsContext {
  error: boolean;
  diff: number;
}

export function parcelValidationErrors(
  service: TranslocoService,
): Record<string, (context: never) => TuiValidationError | string> {
  return {
    quantityMin: (context: MinContext) =>
      service.translate('deliveryDetails.parcel.validation.quantityMin', { min: context.min }),
    quantityMax: (context: MaxContext) =>
      service.translate('deliveryDetails.parcel.validation.quantityMax', { max: context.max }),

    weightMin: (context: MinContext) =>
      service.translate('deliveryDetails.parcel.validation.weightMin', { min: context.min }),
    weightMax: (context: MaxContext) =>
      service.translate('deliveryDetails.parcel.validation.weightMax', { max: context.max }),

    widthMin: (context: MinContext) =>
      service.translate('deliveryDetails.parcel.validation.widthMin', { min: context.min }),
    widthMax: (context: MaxContext) =>
      service.translate('deliveryDetails.parcel.validation.widthMax', { max: context.max }),

    heightMin: (context: MinContext) =>
      service.translate('deliveryDetails.parcel.validation.heightMin', { min: context.min }),
    heightMax: (context: MaxContext) =>
      service.translate('deliveryDetails.parcel.validation.heightMax', { max: context.max }),

    lengthMin: (context: MinContext) =>
      service.translate('deliveryDetails.parcel.validation.lengthMin', { min: context.min }),
    lengthMax: (context: MaxContext) =>
      service.translate('deliveryDetails.parcel.validation.lengthMax', { max: context.max }),

    dimensions: (context: DimensionsContext) =>
      service.translate('deliveryDetails.parcel.validation.dimensions', { diff: context.diff }),
  };
}
