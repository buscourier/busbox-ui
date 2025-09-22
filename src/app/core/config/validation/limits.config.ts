import { DocumentRegex, PHONE_REGEX, TEXT_BASE_REGEX } from '@shared/regex';

export interface FieldConfig {
  minLength: number;
  maxLength: number;
  pattern?: RegExp;
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
    fullName: { minLength: 1, maxLength: 128 },
    lastName: { minLength: 1, maxLength: 64 },
    firstName: { minLength: 1, maxLength: 64 },
    middleName: { minLength: 1, maxLength: 64 },
  },
  address: {
    street: { minLength: 1, maxLength: 64 },
    building: { minLength: 1, maxLength: 64 },
    apartment: { minLength: 1, maxLength: 64 },
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
