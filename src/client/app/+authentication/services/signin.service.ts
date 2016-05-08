import {Injectable} from 'angular2/core';
import {Http, Response} from 'angular2/http';
import {Observable} from 'rxjs/Observable';

import {HttpConstants} from '../../shared/index';

import {AuthTokenService} from '../../shared/index';
import {LoggerService} from '../../shared/index';
import {TenantResolverService} from '../../shared/index';

import {ObservableServiceAction} from '../../shared/index';

/**
 * Signin Service.
 */
@Injectable()
export class SigninService {

  constructor(private _http : Http,
    private _authTokenService: AuthTokenService, private _loggerService : LoggerService,
    private _tenantResolverService : TenantResolverService) { }

  /**
   * Login.
   */
  login(username: string, password: string) : Observable<Response> {
    let headers : any = {};
    headers[HttpConstants.HTTP_HEADER_TENANTID] = this._tenantResolverService.resolveCurrentTenant();
    headers[HttpConstants.HTTP_HEADER_ACCEPT] = HttpConstants.HTTP_HEADER_VALUE_APPLICATIONJSON;
    headers[HttpConstants.HTTP_HEADER_CONTENT_TYPE] = HttpConstants.HTTP_HEADER_VALUE_APPLICATIONJSON;
    headers[HttpConstants.HTTP_HEADER_AUTHORIZATION] =
          HttpConstants.HTTP_HEADER_VALUE_BASIC_PREFIX + ' ' + btoa(username + ':' + password);

    let httpCall = this._http.post('<%= AUTHSERVICE_API_login %>', '', { headers: headers });

    return ObservableServiceAction.fromHttpCallObservable(httpCall, {
      onSuccess: response => {
        this._authTokenService.updateToken(response);
        return response;
      },
      onError: error => {
        this._loggerService.error('An error occurred. Trace: ' + error);
        return error;
      },
      onCompletion: () => this._loggerService.log('Request completed.')
    });
  }

}
