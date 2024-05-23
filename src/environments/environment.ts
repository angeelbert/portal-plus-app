// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: true,
  API_URL: 'http://apigo.nuestrosparques.cl:8090', //http://190.98.194.147:8090/ . . http://apigoqa.nuestrosparques.cl
  //API_URL: 'http://localhost:8090', //http://190.98.194.147:8090/ . . http://apigoqa.nuestrosparques.cl
  TOKEN_NAME: 'access_token',
  BASIC_AUTH: 'Basic cmVtaXR0YW5jZWp3dGNsaWVudGlkOjVYRDhRd2Y2I2U0a0RZajJQXmUzUA==',
  USER_NAME: 'ares_prd',
  USER_PASS: 'nb2qEET72NTRpq7W7Z3267128'
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
