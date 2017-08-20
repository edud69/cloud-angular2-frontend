import { Injectable } from '@angular/core';

import { IApiResult, EmptySuccessServerResponse,
         AuthTokenService, HttpRestService } from '../../../shared/index';

import { ChangePasswordRequest, ChangePasswordForm, SigninService, SigninForm } from '../../index';

/**
 * ChangePasswordService.
 */
@Injectable()
export class ChangePasswordService {

  /**
   * Ctor.
   */
  constructor(
    private _httpRestService : HttpRestService,
    private _authTokenService : AuthTokenService,
    private _signinService : SigninService
  ) {}

  /**
   * Updates the username to the new given password by validating the previous password.
   */
  changePassword(changePasswordForm : ChangePasswordForm) : IApiResult<EmptySuccessServerResponse> {
    let request = new ChangePasswordRequest(this._authTokenService.currentUsername(),
                                            changePasswordForm.previousPassword, changePasswordForm.newPassword);
    let apiResult = this._httpRestService.httpPost('<%= BACKEND_API.AUTHSERVICE_API_updatePassword %>', request);
    this._autoSignin(apiResult, changePasswordForm.newPassword);
    return apiResult;
  }

  /**
   * Uses the updated credentials to get the new access / refresh tokens.
   */
  private _autoSignin(apiResult : IApiResult<EmptySuccessServerResponse>, newPassword : string) {
    let signinForm : SigninForm = new SigninForm();
    signinForm.username = this._authTokenService.currentUsername();
    signinForm.password = newPassword;

    let sub : any = apiResult.subscribe(
                            response => {
                              let loginSub : any = this._signinService.login(signinForm).subscribe(
                                                  response => {/*nothing*/},
                                                  error => {/*Nothing*/},
                                                  () => { if(loginSub) { loginSub.unsubscribe(); }});
                            },
                            error => {/*nothing*/},
                            () => { if(sub) { sub.unsubscribe(); }});
  }
}
