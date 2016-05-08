import {Injectable} from 'angular2/core';
import {Http, Headers, Response} from 'angular2/http';
import {Observable} from 'rxjs/Observable';

import {HttpConstants} from '../../shared/index';

import {LoggerService} from '../../shared/index';
import {TenantResolverService} from '../../shared/index';

import {ObservableServiceAction} from '../../shared/index';

/**
 * Signup Confirmation Service.
 */
@Injectable()
export class SignupConfirmationService {

  constructor(private _http : Http, private _loggerService : LoggerService,
              private _tenantResolverService : TenantResolverService) {}

  /**
   * Confirm a signup.
   */
  confirmSignup(email : string, confirmationToken : string) : Observable<Response> {
    var headers : Headers = new Headers();
    headers.append(HttpConstants.HTTP_HEADER_ACCEPT, HttpConstants.HTTP_HEADER_VALUE_APPLICATIONJSON);
    headers.append(HttpConstants.HTTP_HEADER_CONTENT_TYPE, HttpConstants.HTTP_HEADER_VALUE_APPLICATIONJSON);
    headers.append(HttpConstants.HTTP_HEADER_TENANTID, this._tenantResolverService.resolveCurrentTenant());

    var body : string = JSON.stringify({
        tenantId : this._tenantResolverService.resolveCurrentTenant(),
        email: email,
        confirmationToken: confirmationToken
      });

    let httpCall = this._http.post('<%= AUTHSERVICE_API_userSubscribeConfirmation %>', body, { headers: headers });

    return ObservableServiceAction.fromHttpCallObservable(httpCall, {
      onSuccess: response => {
        this._loggerService.debug('Account is activated.');
        return response;
      },
      onError: error => {
        this._loggerService.error('Error occurred while activating the account. Details : ' + error);
        return error;
      },
      onCompletion: () => this._loggerService.log('Account activation request completed.')
    });
  }
}
