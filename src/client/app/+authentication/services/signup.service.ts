import {Injectable} from '@angular/core';
import {Http, Headers, Response} from '@angular/http';
import {Observable} from 'rxjs/Observable';

import {HttpConstants} from '../../shared/index';

import {LoggerService} from '../../shared/index';
import {TenantResolverService} from '../../shared/index';

import {ObservableServiceAction} from '../../shared/index';

/**
 * Signup Service.
 */
@Injectable()
export class SignupService {

  constructor(private _http : Http, private _loggerService : LoggerService,
              private _tenantResolverService : TenantResolverService) {}

/**
 * Signup.
 */
  signup(username : string, password : string) : Observable<Response> {
    var headers : Headers = new Headers();
    headers.append(HttpConstants.HTTP_HEADER_ACCEPT, HttpConstants.HTTP_HEADER_VALUE_APPLICATIONJSON);
    headers.append(HttpConstants.HTTP_HEADER_CONTENT_TYPE, HttpConstants.HTTP_HEADER_VALUE_APPLICATIONJSON);
    headers.append(HttpConstants.HTTP_HEADER_TENANTID, this._tenantResolverService.resolveCurrentTenant());

    var body : string = JSON.stringify({
        email: username,
        password: password,
        tenantId: this._tenantResolverService.resolveCurrentTenant()
      });

    let httpCall = this._http.post('<%= AUTHSERVICE_API_userSubscribe %>', body, { headers: headers });

    return ObservableServiceAction.fromHttpCallObservable(httpCall, {
      onSuccess: response => {
        this._loggerService.debug('Subscription confirmed.');
        return response;
      },
      onError: error => {
        this._loggerService.error('An error occurred. Trace: ' + error);
        return error;
      },
      onCompletion: () => this._loggerService.log('Request completed')
    });
  }
}
