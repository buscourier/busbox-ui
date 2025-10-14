export const environment = {
  production: process.env['NODE_ENV'] === 'production',
  apiBaseUrl: process.env['APP_API_BASE_URL'],
  apiKey: process.env['APP_API_KEY'],
  mapApiKey: process.env['APP_MAP_KEY'],
  imageProviderUrl: process.env['APP_IMAGE_PROVIDER_URL'] || 'https://ik.imagekit.io/example',
  // dopplerConfig: '',
};
