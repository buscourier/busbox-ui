import { type ApplicationConfig } from '@angular/core';
import { mergeApplicationConfig } from '@angular/core';
import { provideServerRendering, withRoutes } from '@angular/ssr';
import { UNIVERSAL_PROVIDERS } from '@ng-web-apis/universal';

import { appConfig } from './app.config';
import { serverRoutes } from './app.routes.server';

const serverConfig: ApplicationConfig = {
  providers: [provideServerRendering(withRoutes(serverRoutes)), UNIVERSAL_PROVIDERS],
};

export const config = mergeApplicationConfig(appConfig, serverConfig);
