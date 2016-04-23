import {Injectable} from 'angular2/core';

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
    fetch('<%= AUTHSERVICE_API_login %>', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'X-Tenant-id': 'master', //TODO use the given tenant
        'Authorization': 'Basic YWRtaW46YXNkZmFzZGY=' //TODO create a Basic Auth value from username/password
      }
    })
      .then((response: any) => response.json())
      .then((json: any) => this._authTokenService.updateToken(json))
      .catch((error: any) => this._loggerService.error('An error occurred. Trace: ' + error));
  }

}
