import { TuiSortDirection } from '@taiga-ui/addon-table';

import type { Order } from './orders';

export type CustomSortDirection = TuiSortDirection | 0;

export interface SortConfig {
  field: keyof Order | null;
  direction: CustomSortDirection;
}

export const SortDirectionEnum = {
  NONE: 0 as CustomSortDirection,
  ASC: TuiSortDirection.Asc,
  DESC: TuiSortDirection.Desc,
} as const;

export function sortDirectionToString(direction: CustomSortDirection): string | null {
  switch (direction) {
    case TuiSortDirection.Asc:
      return 'asc';
    case TuiSortDirection.Desc:
      return 'desc';
    default:
      return null;
  }
}

export function stringToSortDirection(direction: string | null): CustomSortDirection {
  switch (direction) {
    case 'asc':
      return TuiSortDirection.Asc;
    case 'desc':
      return TuiSortDirection.Desc;
    default:
      return 0;
  }
}
