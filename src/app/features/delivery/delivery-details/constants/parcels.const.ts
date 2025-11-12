import type { ParcelItemLimits, ParcelsLimits } from '../types';

/**
 * Groups of city IDs where the same city might have different IDs
 * depending on the shipping origin. Used for applying city-specific
 * delivery limits.
 */
const CITY_GROUPS = {
  VANINO: ['1675', '1885', '414', '1756', '1615', '1775', '1932'],
  SOVGAVAN: ['1676', '1888', '1759', '1824', '1933'],
  // DALNEGORSK: ['754', '192', '4', '12', '1783', '101'],
  // OLGA: ['1627', '207', '30', '235', '119', '1808', '180'],
};

/** Limits for group of parcels without special conditions */
const PARCELS_DEFAULT_LIMITS: ParcelsLimits = {
  MAX_PARCELS: 6,
  TOTAL_QUANTITY_MAX: 14,
  TOTAL_WEIGHT_MAX: 200,
  TOTAL_DIMENSIONS_MAX: 500,
};

/**
 * Limits for group of parcels under special conditions (office, courier, city).
 * Currently, the restrictions are the same for offices, couriers, and cities.
 */
const PARCELS_BASE_LIMITS: ParcelsLimits = {
  MAX_PARCELS: 4,
  TOTAL_QUANTITY_MAX: 10,
  TOTAL_WEIGHT_MAX: 100,
  TOTAL_DIMENSIONS_MAX: 300,
};

/** Limits for single parcel without special conditions */
const PARCEL_ITEM_DEFAULT_LIMITS: ParcelItemLimits = {
  QUANTITY: {
    MIN: 1,
    MAX: 20,
  },
  WEIGHT: {
    MIN: 0.5,
    MAX: 40,
  },
  DIMENSIONS: {
    MIN: 1,
    MAX: 250,
  },
} as const;

/**
 * Limits for a single parcel under special conditions (office, courier, city).
 * Currently, the restrictions are the same for offices, couriers, and cities.
 */
const PARCEL_ITEM_BASE_LIMITS: ParcelItemLimits = {
  QUANTITY: {
    MIN: 1,
    MAX: 20,
  },
  WEIGHT: {
    MIN: 0.5,
    MAX: 20,
  },
  DIMENSIONS: {
    MIN: 1,
    MAX: 130,
  },
};

/** Creates limits for a group of parcels with optional base values override */
function createParcelsLimits(overrides: Partial<typeof PARCELS_BASE_LIMITS> = {}) {
  return { ...PARCELS_BASE_LIMITS, ...overrides };
}

/** Creates limits for a single parcel with optional base values override */
function createParcelLimits(overrides: Partial<typeof PARCEL_ITEM_BASE_LIMITS> = {}) {
  return { ...PARCEL_ITEM_BASE_LIMITS, ...overrides };
}

/**
 * Creates group limits for parcels based on the city selected for delivery.
 * Each city is represented by a set of IDs, as a city with the same name may
 * have different IDs depending on the departure city.
 * Currently, the restrictions are identical for all cities and match the base limits.
 */
function createCityParcelsLimits(): ReadonlyMap<readonly string[], ParcelsLimits> {
  return new Map([
    [CITY_GROUPS.VANINO, { ...createParcelsLimits() }],
    [CITY_GROUPS.SOVGAVAN, { ...createParcelsLimits() }],
    // [CITY_GROUPS.DALNEGORSK, { ...createParcelsLimits() }],
    // [CITY_GROUPS.OLGA, { ...createParcelsLimits() }],
  ]);
}

/**
 * Creates single parcel limits based on the city selected for delivery.
 * Each city is represented by a set of IDs, as a city with the same name may
 * have different IDs depending on the departure city.
 */
function createParcelLimitsByCity(): ReadonlyMap<readonly string[], ParcelItemLimits> {
  return new Map([
    [CITY_GROUPS.VANINO, { ...createParcelLimits() }],
    [CITY_GROUPS.SOVGAVAN, { ...createParcelLimits() }],
    // [CITY_GROUPS.DALNEGORSK, { ...createParcelLimits({ WEIGHT: { MIN: 0.5, MAX: 40 } }) }],
    // [CITY_GROUPS.OLGA, { ...createParcelLimits({ WEIGHT: { MIN: 0.5, MAX: 50 } }) }],
  ]);
}

export const PARCELS_LIMITS = {
  DEFAULT: PARCELS_DEFAULT_LIMITS,
  OFFICE: createParcelsLimits(),
  COURIER: createParcelsLimits(),
  CITY: createCityParcelsLimits(),
};

export const PARCEL_ITEM_LIMITS = {
  DEFAULT: PARCEL_ITEM_DEFAULT_LIMITS,
  OFFICE: createParcelLimits(),
  COURIER: createParcelLimits(),
  CITY: createParcelLimitsByCity(),
};

export const RESTRICTION_MESSAGES = {
  START_OFFICE: 'Из выбранного офиса отправка не осуществляется',
  END_OFFICE: 'В выбранный офис доставка не осуществляется',
  START_COURIER: 'Отправка курьером не осуществляется',
  END_COURIER: 'Доставка курьером не осуществляется',
} as const;
