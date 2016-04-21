import {Injectable} from 'angular2/core';
import {Http, Headers} from 'angular2/http';
import {LoggerService} from '../../shared/index';

/**
 * Signup Confirmation Service.
 */
@Injectable()
export class SignupConfirmationService {

  constructor(private _http : Http, private _loggerService : LoggerService) {}

  /**
   * Confirm a signup.
   */
  confirmSignup(email : string, confirmationToken : string) {
    var headers : Headers = new Headers();
    headers.append('Accept', 'application/json');
    headers.append('Content-Type', 'application/json');
    headers.append('X-Tenant-id', 'master'); //TODO

    var body : string = JSON.stringify({
        tenantId : 'master', //TODO,
        email: email,
        confirmationToken: confirmationToken
      });

    this._http.post('<%= AUTHSERVICE_API_userSubscribeConfirmation %>', body, { headers: headers })
    .subscribe(
      json => this._loggerService.debug('Account is activated.'),
      error => this._loggerService.error('Error occurred while activating the account. Details : ' + error),
      () => this._loggerService.log('Account activation request completed.')
    );
  }
}
