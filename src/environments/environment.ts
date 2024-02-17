// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
    production: false,
    hostAPI: 'https://dev.zeyada.org/admin/',
    authAPI: 'https://dev.zeyada.org/auth/api/v1/',
    chatAPI: 'https://dev.zeyada.org/community/api/v1/',
    communityAPI: 'https://dev.zeyada.org/community/api/v1/',
    admissionAPI: 'https://dev.zeyada.org/admission/',
    socketAPI: 'wss://dev-community.zeyada.org'
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.
