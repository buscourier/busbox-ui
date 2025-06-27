import { errorHandlingEffects } from './error-handling.effects';
import { zoneTariffsEffects } from './zone-tariffs.effects';
import { zonesEffects } from './zones.effects';

export const TariffsEffects = {
  ...zonesEffects,
  ...zoneTariffsEffects,
  ...errorHandlingEffects,
};
