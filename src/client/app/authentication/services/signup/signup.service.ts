import { Injectable } from '@angular/core';

import { EmptySuccessServerResponse, IApiResult,
         HttpRestService, TenantResolverService } from '../../../shared/index';

import { SignupRequest, SignupForm } from '../../index';

/**
 * Signup Service.
 */
@Injectable()
export class SignupService {

  constructor(private _httpRestService : HttpRestService,
              private _tenantResolverService : TenantResolverService) {}

/**
 * Signup.
 */
  signup(signupForm : SignupForm) : IApiResult<EmptySuccessServerResponse> {
    var signupRequest = new SignupRequest(signupForm.username, signupForm.password, this._tenantResolverService.resolveCurrentTenant());
    return this._httpRestService.httpPost('<%= BACKEND_API.AUTHSERVICE_API_userSubscribe %>', signupRequest);
  }
}
