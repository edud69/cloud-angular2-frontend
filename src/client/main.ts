import {provide, enableProdMode, PLATFORM_DIRECTIVES} from 'angular2/core';
import {bootstrap} from 'angular2/platform/browser';
import {ROUTER_PROVIDERS, } from 'angular2/router';
import {HTTP_PROVIDERS, Http} from 'angular2/http';
import {AuthHttp, AuthConfig} from 'angular2-jwt/angular2-jwt';
import {Logger} from 'angular2-logger/core';
import {AppComponent} from './app/components/app.component';

import {AuthTokenService, JwtConstants, HttpConstants} from './app/shared/index';


// shared directives
import {HasPermissionDirective, HasAllPermissionDirective, HasAnyPermissionDirective} from './app/shared/index';

var sharedDirectives = [
  provide(PLATFORM_DIRECTIVES, {useValue: HasAllPermissionDirective, multi: true }),
  provide(PLATFORM_DIRECTIVES, {useValue: HasAnyPermissionDirective, multi: true }),
  provide(PLATFORM_DIRECTIVES, {useValue: HasPermissionDirective, multi: true })
];

if ('<%= ENV %>' === 'prod') { enableProdMode(); }

var authHeaders : any = [];
authHeaders[HttpConstants.HTTP_HEADER_CONTENT_TYPE] = HttpConstants.HTTP_HEADER_VALUE_APPLICATIONJSON;

bootstrap(AppComponent, [
  ROUTER_PROVIDERS,
  sharedDirectives,
  HTTP_PROVIDERS,
  Logger,
  provide(AuthHttp, {
    useFactory: (http : any, authTokenService : AuthTokenService) => {
      return new AuthHttp(new AuthConfig({
        headerName: HttpConstants.HTTP_HEADER_AUTHORIZATION,
        headerPrefix: HttpConstants.HTTP_HEADER_VALUE_BEARER_PREFIX,
        tokenName: JwtConstants.JWT_STORE_ACCESSTOKEN_KEY,
        tokenGetter: () => authTokenService.getAccessToken(),
        globalHeaders: [authHeaders],
        noJwtError: true,
        noTokenScheme: true
      }), http);
    },
    deps: [Http]
  })
]);

// In order to start the Service Worker located at "./worker.js"
// uncomment this line. More about Service Workers here
// https://developer.mozilla.org/en-US/docs/Web/API/Service_Worker_API/Using_Service_Workers
//
// if ('serviceWorker' in navigator) {
//   (<any>navigator).serviceWorker.register('./worker.js').then((registration: any) =>
//       console.log('ServiceWorker registration successful with scope: ', registration.scope))
//     .catch((err: any) =>
//       console.log('ServiceWorker registration failed: ', err));
// }
