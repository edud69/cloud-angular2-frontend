import {Injectable} from 'angular2/core';
import {Http, Headers, Response} from 'angular2/http';
import {Observable} from 'rxjs/Observable';

import {HttpConstants} from '../../shared/index';

import {AuthTokenService} from '../../shared/index';
import {LoggerService} from '../../shared/index';

/**
 * Signin Service.
 */
@Injectable()
export class SigninService {

  constructor(private _http : Http,
    private _authTokenService: AuthTokenService, private _loggerService : LoggerService) { }

  /**
   * Login.
   */
  login(username: string, password: string) : Observable<Response> {
    let headers : any = {};
    headers[HttpConstants.HTTP_HEADER_TENANTID] = 'master'; //TODO get current tenant
    headers[HttpConstants.HTTP_HEADER_ACCEPT] = HttpConstants.HTTP_HEADER_VALUE_APPLICATIONJSON;
    headers[HttpConstants.HTTP_HEADER_CONTENT_TYPE] = HttpConstants.HTTP_HEADER_VALUE_APPLICATIONJSON;
    headers[HttpConstants.HTTP_HEADER_AUTHORIZATION] =
          HttpConstants.HTTP_HEADER_VALUE_BASIC_PREFIX + ' ' + btoa(username + ':' + password);

    let obs = this._http.post('<%= AUTHSERVICE_API_login %>', '', { headers: headers })

    obs.subscribe(
      json => this._authTokenService.updateToken(json),
      error => this._loggerService.error('An error occurred. Trace: ' + error),
      () => this._loggerService.log('Request completed.')
    );

    return obs;
  }

}
