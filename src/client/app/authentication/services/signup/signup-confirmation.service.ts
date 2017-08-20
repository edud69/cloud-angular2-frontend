import { Injectable } from '@angular/core';

import { SignupConfirmation } from '../../index';

import { ErrorCodeConstants, IApiResult, ApiResultFactory,
         ApiError, EmptySuccessServerResponse, HttpRestService,
         LoggerService, TenantResolverService, HttpUrlUtils } from '../../../shared/index';

const EMAIL_URL_PARAM : string = 'email';
const TOKEN_URL_PARAM : string = 'token';

/**
 * Signup Confirmation Service.
 */
@Injectable()
export class SignupConfirmationService {

  constructor(private _loggerService : LoggerService,
              private _tenantResolverService : TenantResolverService,
              private _httpRestService : HttpRestService) {}

  /**
   * Confirms a signup.
   */
  confirmSignup() : IApiResult<EmptySuccessServerResponse> {
    let email = HttpUrlUtils.getUrlParameterByName(EMAIL_URL_PARAM);
    let token = HttpUrlUtils.getUrlParameterByName(TOKEN_URL_PARAM);

    this._loggerService.info('Confirming account with email: {0} and token: {1}.', [email, token]);

    if(email && token) {
      return this._doConfirmSignup(email, token);
    }

    return ApiResultFactory
              .createInstantError(new ApiError(ErrorCodeConstants.ERROR_CODE_UNKNOWN, 'Confirmation needs a valid token and email.'));
  }

  /**
   * Confirm a signup.
   */
  private _doConfirmSignup(email : string, confirmationToken : string) : IApiResult<EmptySuccessServerResponse> {
    let requestBody = new SignupConfirmation(email, confirmationToken, this._tenantResolverService.resolveCurrentTenant());
    return this._httpRestService.httpPost('<%= BACKEND_API.AUTHSERVICE_API_userSubscribeConfirmation %>', requestBody);
  }
}
