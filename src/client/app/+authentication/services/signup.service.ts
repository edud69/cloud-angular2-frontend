import {Injectable} from 'angular2/core';
import {Http, Headers, Response} from 'angular2/http';
import {Observable} from 'rxjs/Observable';

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
  signup(username : string, password : string) : Observable<Response> {
    var headers : Headers = new Headers();
    headers.append(HttpConstants.HTTP_HEADER_ACCEPT, HttpConstants.HTTP_HEADER_VALUE_APPLICATIONJSON);
    headers.append(HttpConstants.HTTP_HEADER_CONTENT_TYPE, HttpConstants.HTTP_HEADER_VALUE_APPLICATIONJSON);
    headers.append(HttpConstants.HTTP_HEADER_TENANTID, 'master'); //TODO

    var body : string = JSON.stringify({
        email: username,
        password: password,
        tenantId: 'master' //TODO
      });

    let obs = this._http.post('<%= AUTHSERVICE_API_userSubscribe %>', body, { headers: headers });

    obs.subscribe(
      json => this._loggerService.debug('Subscription confirmed.'),
      error => this._loggerService.error('An error occurred. Trace: ' + error),
      () => this._loggerService.log('Request completed')
    );

    return obs;
  }
}
