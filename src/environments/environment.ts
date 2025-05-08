export const environment = {
  production: process.env['NODE_ENV'] == 'production',
  apiUrl: `${process.env['API_URL']}`,
  dopplerConfig: process.env['DOPPLER_CONFIG'],
  apiKey: process.env['API_KEY'],
};
