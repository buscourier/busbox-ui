import type { ParcelItem } from './parcels.types';

export interface AutoParts {
  items: AutoPart[];
}

export interface AutoPart {
  preset: AutoPartPreset | null;
  params: ParcelItem;
}

export interface AutoPartPreset {
  name: string;
  width: number;
  height: number;
  length: number;
  weight: number;
}

export interface AutoPartPresetResponse {
  name: string;
  width: string;
  height: string;
  length: string;
  weight: string;
}
