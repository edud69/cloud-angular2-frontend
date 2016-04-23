import {Injectable} from 'angular2/core';
import {Http, Headers} from 'angular2/http';

import {HttpConstants} from '../../shared/index';

import {LoggerService} from '../../shared/index';

/**
 * Signup Service.
 */
@Injectable()
export class SignupService {

  constructor(private _http : Http, private _loggerService : LoggerService) {}

/**
 * Signup.
 */
  signup(username : string, password : string) {
    var headers : Headers = new Headers();
    headers.append(HttpConstants.HTTP_HEADER_ACCEPT, HttpConstants.HTTP_HEADER_VALUE_APPLICATIONJSON);
    headers.append(HttpConstants.HTTP_HEADER_CONTENT_TYPE, HttpConstants.HTTP_HEADER_VALUE_APPLICATIONJSON);
    headers.append(HttpConstants.HTTP_HEADER_TENANTID, 'master'); //TODO

    var body : string = JSON.stringify({
        email: username,
        password: password,
        tenantId: 'master' //TODO
      });

    this._http.post('<%= AUTHSERVICE_API_userSubscribe %>', body, { headers: headers })
    .subscribe(
      json => this._loggerService.debug('Subscription confirmed.'),
      error => this._loggerService.error('An error occurred. Trace: ' + error),
      () => this._loggerService.log('Request completed')
    );
  }
}
