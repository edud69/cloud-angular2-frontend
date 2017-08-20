import { Injectable } from '@angular/core';

import { IApiResult, EmptySuccessServerResponse, HttpUrlUtils,
         HttpRestService, LoggerService } from '../../../shared/index';

import { LostPasswordRequest, RestorePasswordRequest, LostPasswordForm, RestorePasswordForm } from '../../index';

const EMAIL_URL_PARAM: string = 'email';
const TOKEN_URL_PARAM: string = 'token';

/**
 * LostPasswordService.
 */
@Injectable()
export class LostPasswordService {

  /**
   * Ctor.
   */
  constructor(
    private _httpRestService: HttpRestService,
    private _loggerService: LoggerService
  ) { }

  /**
   * Parses the client url to retrieve lost password token.
   */
  loadLostPasswordToken(): { email: string, token: string } {
    let email = HttpUrlUtils.getUrlParameterByName(EMAIL_URL_PARAM);
    let token = HttpUrlUtils.getUrlParameterByName(TOKEN_URL_PARAM);

    this._loggerService.info(`Retrieved lost password token for user:${email} and token:${token}.`);

    return { email: email, token: token };
  }

  /**
   * Creates a lost password request and send it to the server.
   */
  buildAndSendLostPasswordRequest(lostPasswordForm: LostPasswordForm): IApiResult<EmptySuccessServerResponse> {
    let request = new LostPasswordRequest(lostPasswordForm.username);
    return this._httpRestService.httpPost('<%= BACKEND_API.AUTHSERVICE_API_lostPassword %>', request);
  }

  /**
   * Updates the username to the new given password by validating lost password token.
   */
  restorePassword(lostPasswordForm: RestorePasswordForm): IApiResult<EmptySuccessServerResponse> {
    let request = new RestorePasswordRequest(lostPasswordForm.username, lostPasswordForm.lostPasswordToken, lostPasswordForm.newPassword);
    return this._httpRestService.httpPost('<%= BACKEND_API.AUTHSERVICE_API_restorePassword %>', request);
  }
}
