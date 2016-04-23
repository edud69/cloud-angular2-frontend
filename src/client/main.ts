import {provide, enableProdMode} from 'angular2/core';
import {bootstrap} from 'angular2/platform/browser';
import {ROUTER_PROVIDERS, APP_BASE_HREF} from 'angular2/router';
import {HTTP_PROVIDERS, Http} from 'angular2/http';
import {AuthHttp, AuthConfig} from 'angular2-jwt/angular2-jwt';
import {Logger} from 'angular2-logger/core';
import {AppComponent} from './app/components/app.component';

import {HttpConstants} from './app/shared/constants/http.constants';
import {JwtConstants} from './app/shared/constants/jwt.constants';


if ('<%= ENV %>' === 'prod') { enableProdMode(); }

bootstrap(AppComponent, [
  ROUTER_PROVIDERS,
  provide(APP_BASE_HREF, { useValue: '<%= APP_BASE %>' }),
  HTTP_PROVIDERS,
  Logger,
  provide(AuthHttp, {
    useFactory: (http : any) => {
      return new AuthHttp(new AuthConfig({
        headerName: HttpConstants.HTTP_HEADER_AUTHORIZATION,
        headerPrefix: HttpConstants.HTTP_HEADER_VALUE_BEARER_PREFIX,
        tokenName: JwtConstants.JWT_STORE_ACCESSTOKEN_KEY,
        tokenGetter: () => sessionStorage.getItem(JwtConstants.JWT_STORE_ACCESSTOKEN_KEY),
        noJwtError: true
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
