import type { AutoParts, CargoDetails, Documents, OtherCargo, Parcels } from '../types';

export function getDocuments(documents: Documents | null): CargoDetails | null {
  return documents?.quantity
    ? {
        name: 'Документы',
        quantity: documents?.quantity,
      }
    : null;
}

export function getParcels(parcels: Parcels | null): CargoDetails | null {
  return parcels?.items.length
    ? {
        name: 'Посылки',
        quantity: parcels?.items.length || 0,
      }
    : null;
}

export function getAutoParts(data: AutoParts | null): CargoDetails | null {
  return data?.items.length
    ? {
        name: 'Автозапчасти',
        quantity: data?.items.length || 0,
      }
    : null;
}

export function getOtherCargo(data: OtherCargo | null): CargoDetails | null {
  return data?.item?.name && data.quantity
    ? {
        name: data?.item?.name || null,
        quantity: data?.quantity || 0,
      }
    : null;
}
