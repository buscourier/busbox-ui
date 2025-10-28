import { InjectionToken } from '@angular/core';

export const APP_MEDIA_BASE_URL = new InjectionToken<() => string>('APP_MEDIA_BASE_URL');
export const APP_IMGPROXY_BASE_URL = new InjectionToken<() => string>('APP_IMGPROXY_BASE_URL');
