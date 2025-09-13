import { DocumentRegex, PHONE_REGEX, TEXT_BASE_REGEX } from '@shared/regex';

export interface FieldConfig {
  minLength: number;
  maxLength: number;
  pattern: RegExp;
}

// export type FieldGroup = Record<string, FieldConfig | Record<string, FieldConfig>>;
// export type ValidationLimits = Record<string, FieldGroup>;

export interface ValidationLimits {
  user: {
    fullName: FieldConfig;
    lastName: FieldConfig;
    firstName: FieldConfig;
    middleName: FieldConfig;
    [key: string]: FieldConfig;
  };
  address: {
    street: FieldConfig;
    building: FieldConfig;
    apartment: FieldConfig;
    [key: string]: FieldConfig;
  };
  document: {
    passport: {
      number: FieldConfig;
    };
    driverLicense: {
      number: FieldConfig;
    };
    other: {
      number: FieldConfig;
    };
    [key: string]: FieldConfig | Record<string, FieldConfig>;
  };

  contact: {
    phone: FieldConfig;
  };

  [entityType: string]: Record<string, FieldConfig | Record<string, FieldConfig>>;
}

export const DEFAULT_VALIDATION_LIMITS: ValidationLimits = {
  user: {
    fullName: { minLength: 2, maxLength: 40, pattern: TEXT_BASE_REGEX },
    lastName: { minLength: 2, maxLength: 15, pattern: TEXT_BASE_REGEX },
    firstName: { minLength: 2, maxLength: 15, pattern: TEXT_BASE_REGEX },
    middleName: { minLength: 2, maxLength: 15, pattern: TEXT_BASE_REGEX },
  },
  address: {
    street: { minLength: 3, maxLength: 30, pattern: TEXT_BASE_REGEX },
    building: { minLength: 1, maxLength: 10, pattern: TEXT_BASE_REGEX },
    apartment: { minLength: 1, maxLength: 10, pattern: TEXT_BASE_REGEX },
  },
  document: {
    passport: {
      number: { minLength: 1, maxLength: 12, pattern: DocumentRegex.PASSPORT },
    },
    driverLicense: {
      number: { minLength: 1, maxLength: 12, pattern: DocumentRegex.DRIVER_LICENSE },
    },
    other: {
      number: { minLength: 1, maxLength: 20, pattern: TEXT_BASE_REGEX },
    },
  },
  contact: {
    phone: { minLength: 1, maxLength: 20, pattern: PHONE_REGEX },
  },
};
