import {Injectable} from 'angular2/core';

import {HttpConstants} from '../../shared/index';

import {AuthTokenService} from '../../shared/index';
import {LoggerService} from '../../shared/index';

declare var fetch: any;

/**
 * Signin Service.
 */
@Injectable()
export class SigninService {

  constructor(private _authTokenService: AuthTokenService, private _loggerService : LoggerService) { }

  /**
   * Login.
   */
  login(username: string, password: string) {
    // TODO pass something in the body, zuul does not like the fact that the body is empty...

    let headers : any = {};
    headers[HttpConstants.HTTP_HEADER_TENANTID] = 'master'; //TODO get current tenant
    headers[HttpConstants.HTTP_HEADER_ACCEPT] = HttpConstants.HTTP_HEADER_VALUE_APPLICATIONJSON;
    headers[HttpConstants.HTTP_HEADER_CONTENT_TYPE] = HttpConstants.HTTP_HEADER_VALUE_APPLICATIONJSON;
    headers[HttpConstants.HTTP_HEADER_AUTHORIZATION] =
          HttpConstants.HTTP_HEADER_VALUE_BASIC_PREFIX + ' YWRtaW46YXNkZmFzZGY='; //TODO encode credentials

    fetch('<%= AUTHSERVICE_API_login %>', {
      method: HttpConstants.HTTP_METHOD_POST,
      headers: headers
    })
      .then((response: any) => response.json())
      .then((json: any) => this._authTokenService.updateToken(json))
      .catch((error: any) => this._loggerService.error('An error occurred. Trace: ' + error));
  }

}
