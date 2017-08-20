import { Injectable } from '@angular/core';

import { IApiResult, HttpRestService, AuthTokenService, EventService, ProfileLiteRefreshEvent, HttpUrlUtils } from '../../shared/index';

import { ProfileForm, Profile, Gender } from '../index';

/**
 * Profile Service.
 */
@Injectable()
export class ProfileService {

  constructor(private _httpRestService : HttpRestService,
              private _authTokenService : AuthTokenService,
              private _eventEmitterService: EventService) {}

/**
 * Gets the profile.
 */
  getProfile() : IApiResult<Profile> {
    let userId = this._authTokenService.currentUserId();
    return this._httpRestService.httpGet(HttpUrlUtils.combineId('<%= BACKEND_API.ACCOUNTSERVICE_API_getProfile %>', userId));
  }

  /**
   * Updates the profile.
   */
  updateProfile(form : ProfileForm) : IApiResult<Profile> {
      let userId = this._authTokenService.currentUserId();
      let payload = new Profile(userId, form.firstName, form.lastName, form.gender, form.birthday, form.avatarUrl);
      let apiResult = this._httpRestService.httpPut<Profile>(
          HttpUrlUtils.combineId('<%= BACKEND_API.ACCOUNTSERVICE_API_updateProfile %>', payload.userId), payload);
      this._addProfileUpdatedInterceptor(apiResult);
      return apiResult;
  }

  /**
   * Create a user profile.
   */
  createProfile() : IApiResult<Profile> {
      let userId = this._authTokenService.currentUserId();
      let payload = new Profile(userId, null, null, Gender.NOT_KNOWN, null, null);
      return this._httpRestService.httpPost('<%= BACKEND_API.ACCOUNTSERVICE_API_createProfile %>', payload);
  }

  /**
   * Adds profile updated interceptor.
   */
  private _addProfileUpdatedInterceptor(apiResult : IApiResult<Profile>) {
    let sub : any = apiResult.subscribe(success => this._notifyProfileUpdated(), error => {/*nothing*/}, () => sub.unsubscribe());
  }

  /**
   * Sends a profile lite event refresh.
   */
  private _notifyProfileUpdated() {
    this._eventEmitterService.emit(new ProfileLiteRefreshEvent());
  }
}
