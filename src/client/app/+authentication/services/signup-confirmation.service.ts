import {Injectable} from '@angular/core';
import {Http, Headers, Response} from '@angular/http';
import {Observable} from 'rxjs/Observable';

import {HttpConstants} from '../../shared/index';

import {LoggerService} from '../../shared/index';
import {TenantResolverService} from '../../shared/index';

import {ObservableServiceAction} from '../../shared/index';

import {HttpUrlUtils} from '../../shared/index';

const EMAIL_URL_PARAM : string = 'email';
const TOKEN_URL_PARAM : string = 'token';

/**
 * Signup Confirmation Service.
 */
@Injectable()
export class SignupConfirmationService {

  constructor(private _http : Http, private _loggerService : LoggerService,
              private _tenantResolverService : TenantResolverService) {}

  /**
   * Confirms a signup.
   */
  confirmSignup() : Observable<Response> {
    let email = HttpUrlUtils.getUrlParameterByName(EMAIL_URL_PARAM);
    let token = HttpUrlUtils.getUrlParameterByName(TOKEN_URL_PARAM);

    this._loggerService.info(`Confirming account with email:${email} and token:${token}.`);

    if(email && token) {
      return this._doConfirmSignup(email, token);
    }

    return Observable.create((observer : any) => {
      //TODO create a managed error/exception
      observer.error('Confirmation needs a valid token and email.');
      observer.complete();
    });
  }

  /**
   * Confirm a signup.
   */
  private _doConfirmSignup(email : string, confirmationToken : string) : Observable<Response> {
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
