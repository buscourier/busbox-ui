import { cityEffects } from './city.effects';
import { errorHandlingEffects } from './error-handling.effects';
import { routerEffects } from './router.effects';
import { zoneTariffsEffects } from './zone-tariffs.effects';
import { zonesEffects } from './zones.effects';

export const TariffsEffects = {
  ...zonesEffects,
  ...zoneTariffsEffects,
  ...errorHandlingEffects,
  ...routerEffects,
  ...cityEffects,
};
