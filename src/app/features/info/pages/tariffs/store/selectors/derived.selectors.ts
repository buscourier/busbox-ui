import { createSelector } from '@ngrx/store';

import { AsyncStatus } from '@shared/types';

import type {
  ParcelZoneGroup,
  ShippingZoneTariff,
  ZoneGroup,
  ParcelsTableData,
  ParcelTableCell,
  ParcelTableRow,
  TableData,
  TableRow,
} from '../../types';

import type { BaseSelectors } from './base-selectors.types';
import type { DerivedSelectors } from './derived-selectors.types';

export const createDerivedSelectors = (baseSelectors: BaseSelectors): DerivedSelectors => {
  const selectIsZonesLoading = createSelector(
    baseSelectors.selectZonesStatus,
    (status) => status === AsyncStatus.LOADING,
  );

  const selectIsZonesLoaded = createSelector(
    baseSelectors.selectZonesStatus,
    (status) => status === AsyncStatus.LOADED,
  );

  const selectIsZonesError = createSelector(
    baseSelectors.selectZonesStatus,
    (status) => status === AsyncStatus.LOADED,
  );

  const selectHasZones = createSelector(
    baseSelectors.selectZones,
    selectIsZonesLoaded,
    (data, isLoaded) => isLoaded && !!data,
  );

  const selectIsZoneTariffsLoading = createSelector(
    baseSelectors.selectZoneTariffsStatus,
    (status) => status === AsyncStatus.LOADING,
  );

  const selectIsZoneTariffsLoaded = createSelector(
    baseSelectors.selectZoneTariffsStatus,
    (status) => status === AsyncStatus.LOADED,
  );

  const selectIsZoneTariffsError = createSelector(
    baseSelectors.selectZoneTariffsStatus,
    (status) => status === AsyncStatus.ERROR,
  );

  const selectHasZoneTariffs = createSelector(
    baseSelectors.selectZoneTariffs,
    selectIsZonesLoaded,
    (data, isLoaded) => isLoaded && !!data,
  );

  const selectAutoPartsTable = createSelector(
    baseSelectors.selectZoneTariffs,
    (tariffs): TableData => {
      // 1. Group by zones
      const zoneGroups = tariffs.reduce(
        (acc, tariff) => {
          const zoneKey = tariff.zone;

          if (!acc[zoneKey]) {
            acc[zoneKey] = {
              zone_id: tariff.zone_id,
              zone_name: tariff.zone,
              parts: [],
            };
          }

          if (tariff.main_type === 'Автозапчасти') {
            acc[zoneKey].parts.push(tariff);
          }

          return acc;
        },
        {} as Record<string, ZoneGroup>,
      );

      // 2. Build zones list for headers
      const zones = Object.values(zoneGroups)
        .sort((a, b) => parseInt(a.zone_id) - parseInt(b.zone_id))
        .map((zone) => ({
          zone_id: zone.zone_id,
          zone_name: zone.zone_name,
        }));

      // 3. Get all unique cargo types
      const allPartTypes = new Set<string>();
      Object.values(zoneGroups).forEach((zone: ZoneGroup) => {
        zone.parts.forEach((part: ShippingZoneTariff) => {
          allPartTypes.add(part.type);
        });
      });

      // 4. Build table rows
      const rows: TableRow[] = Array.from(allPartTypes)
        .sort() // sort by alphabet
        .map((partType) => {
          const row: TableRow = {
            type: partType,
            zones: {},
          };

          // Fill prices for each zone
          Object.values(zoneGroups).forEach((zone: ZoneGroup) => {
            const partInZone = zone.parts.find(
              (part: ShippingZoneTariff) => part.type === partType,
            );
            if (partInZone) {
              row.zones[zone.zone_id] = parseInt(partInZone.price);
            }
          });

          return row;
        });

      console.log('zones', zones);
      console.log('rows', rows);

      return {
        zones,
        rows,
      };
    },
  );

  const selectOtherTable = createSelector(baseSelectors.selectZoneTariffs, (tariffs): TableData => {
    // 1. Group by zones
    const zoneGroups = tariffs.reduce(
      (acc, tariff) => {
        const zoneKey = tariff.zone;

        if (!acc[zoneKey]) {
          acc[zoneKey] = {
            zone_id: tariff.zone_id,
            zone_name: tariff.zone,
            parts: [],
          };
        }

        if (tariff.main_type === 'Другое') {
          acc[zoneKey].parts.push(tariff);
        }

        return acc;
      },
      {} as Record<string, ZoneGroup>,
    );

    // 2. Build zones list for headers
    const zones = Object.values(zoneGroups)
      .sort((a, b) => parseInt(a.zone_id) - parseInt(b.zone_id))
      .map((zone) => ({
        zone_id: zone.zone_id,
        zone_name: zone.zone_name,
      }));

    // 3. Get all unique cargo types
    const allPartTypes = new Set<string>();
    Object.values(zoneGroups).forEach((zone: ZoneGroup) => {
      zone.parts.forEach((part: ShippingZoneTariff) => {
        allPartTypes.add(part.type);
      });
    });

    // 4. Build table rows
    const rows: TableRow[] = Array.from(allPartTypes)
      .sort() // sort by alphabet
      .map((partType) => {
        const row: TableRow = {
          type: partType,
          zones: {},
        };

        // Fill prices for each zone
        Object.values(zoneGroups).forEach((zone: ZoneGroup) => {
          const partInZone = zone.parts.find((part: ShippingZoneTariff) => part.type === partType);
          if (partInZone) {
            row.zones[zone.zone_id] = parseInt(partInZone.price);
          }
        });

        return row;
      });

    return {
      zones,
      rows,
    };
  });

  const selectParcelsTable = createSelector(
    baseSelectors.selectZoneTariffs,
    (tariffs): ParcelsTableData => {
      // 1. Group by zones
      const zoneGroups = tariffs.reduce(
        (acc, tariff) => {
          const zoneKey = tariff.zone;

          if (!acc[zoneKey]) {
            acc[zoneKey] = {
              zone_id: tariff.zone_id,
              zone_name: tariff.zone,
              documents: [],
              parcels: [],
            };
          }

          if (tariff.main_type === 'Документы (формат А4)') {
            acc[zoneKey].documents.push(tariff);
          } else if (tariff.main_type === 'Посылки') {
            acc[zoneKey].parcels.push(tariff);
          }

          return acc;
        },
        {} as Record<string, ParcelZoneGroup>,
      );

      // 2. Build zones list for headers
      const zones = Object.values(zoneGroups)
        .sort((a, b) => parseInt(a.zone_id) - parseInt(b.zone_id))
        .map((zone) => ({
          zone_id: zone.zone_id,
          zone_name: zone.zone_name,
        }));

      // 3. Size categories
      const sizeCategories = ['до 50 см', 'до 100 см', 'до 130 см', 'до 160 см'];

      // 4. Build table rows
      const rows: ParcelTableRow[] = sizeCategories.map((sizeCategory, sizeIndex) => {
        const row: ParcelTableRow = {
          size: sizeCategory,
          zones: {},
        };

        const sizeValue = getSizeValue(sizeCategory); // "50", "100", "130", "160"

        // Fill data for each zone
        Object.values(zoneGroups).forEach((zone: ParcelZoneGroup) => {
          const cell: ParcelTableCell = {};

          // Add document price only for the first row
          if (sizeIndex === 0 && zone.documents[0]) {
            cell.documents = parseInt(zone.documents[0].price);
          }

          // Find parcel tariffs for this size in this zone
          const parcelsForSize = zone.parcels.filter(
            (p: ShippingZoneTariff) => p.size === sizeValue,
          );

          // Fill weight categories
          parcelsForSize.forEach((parcel: ShippingZoneTariff) => {
            const price = parseInt(parcel.price);
            switch (parcel.weight) {
              case '0 - 5':
                cell.weight_0_5 = price;
                break;
              case '5 - 10':
                cell.weight_5_10 = price;
                break;
              case '10 - 20':
                cell.weight_10_20 = price;
                break;
            }
          });

          row.zones[zone.zone_id] = cell;
        });

        return row;
      });

      return {
        zones,
        rows,
        sizeCategories,
      };
    },
  );

  // const selectAutoPartsZones = createSelector(
  //   selectAutoPartsTableData,
  //   (data) => data.zones
  // );
  //
  // const selectAutoPartsRows = createSelector(
  //   selectAutoPartsTableData,
  //   (data) => data.rows
  // );

  return {
    selectIsZonesLoading,
    selectIsZonesLoaded,
    selectIsZonesError,
    selectHasZones,
    selectIsZoneTariffsLoading,
    selectIsZoneTariffsLoaded,
    selectIsZoneTariffsError,
    selectHasZoneTariffs,
    selectAutoPartsTable,
    selectOtherTable,
    selectParcelsTable,
  };
};

function getSizeValue(sizeCategory: string): string {
  const match = sizeCategory.match(/(\d+)/);
  return match ? match[1] : '';
}
