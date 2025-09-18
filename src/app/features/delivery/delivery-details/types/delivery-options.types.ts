import type { AutoPartPreset } from './auto-parts.types';
import type { Cargo } from './cargo.types';
import type { Service } from './service.types';

export interface DeliveryOptions {
  cargos: Cargo[];
  services: Service[];
  autoPartPresets: AutoPartPreset[];
}
