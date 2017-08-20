import 'rxjs/add/operator/map';
import { Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';
import { JwtHelper } from 'angular2-jwt';

import { OAuth2Token, IServiceSubscription, RandomUtils, LoggerService,
         JsonModelConverter, ApiError, JwtConstants, HttpConstants } from '../../index';

/**
 * Authentication Token Service.
 */
@Injectable()
export class AuthTokenService {

  private _jwtHelper: JwtHelper = new JwtHelper();

  private _tokenRefreshEventSubscribers: { [key: string]: ((newToken: string) => void) } = {};

  private _tokenClearedSubscribers: { [key: string]: (() => void) } = {};

  constructor(private _http: Http, private _loggerService: LoggerService) {
        // application has just started, we want to get a new access token from the session (if possible)
        this.refreshAccessToken();
   }

  /**
   * Refresh the tokens.
   */
  refreshAccessToken() {
    let refreshToken: string = this.getRefreshToken();
    if (!refreshToken) {
      this._loggerService.debug('No refresh token found.');
      return;
    }

    let parameters: string = '?' + JwtConstants.JWT_REFRESH_URL_PARAM + '=' + refreshToken;
    let headers: Headers = new Headers();
    headers.append(HttpConstants.HTTP_HEADER_TENANTID, this._getTokenProperty(JwtConstants.JWT_TOKEN_PROPERTY_TID, refreshToken));

    this._http.post('<%= BACKEND_API.AUTHSERVICE_API_refreshJwtToken %>' + parameters, '', { headers: headers })
      .map(response => response.json()).finally(() => this._loggerService.log('Request completed'))
      .subscribe(
      (data: any) => {
        let oauth2Token = new OAuth2Token(data.access_token, data.refresh_token);
        this.updateToken(oauth2Token);
      },
      err => {
        let apiError: ApiError = null;

        try {
          apiError = <ApiError>JsonModelConverter.fromJson(err.json());
          this._loggerService.warn('Token has been revoked, details: {0}.', [apiError.message]);
          this.clearTokens();
        } catch (ex) {
          if (err.status && err.status === HttpConstants.HTTP_STATUSCODE_FORBIDDEN) {
            // token has been revoked
            this._loggerService.warn('Token has been revoked, details: {0}.', [err]);
            this.clearTokens();
          } else {
            this._loggerService.error('Error: {0}.', [err]);
          }
        }
      }
      );
  }

  /**
   * Subscribes to token refresh events.
   */
  subscribeToTokenRefreshEvent(subscriber: ((newToken: string) => void)): IServiceSubscription {
    if (subscriber) {
      let uniqueKey = RandomUtils.randomString(12);
      this._tokenRefreshEventSubscribers[uniqueKey] = subscriber;
      this._loggerService.log('AuthTokenService: Subscription to token refresh count is now at {0}.',
        [this._getSubscribersCount(this._tokenRefreshEventSubscribers)]);
      return { unsubscribe: () => delete this._tokenRefreshEventSubscribers[uniqueKey] };
    }
    return {
      unsubscribe: () => {
        // no subscriber, empty block
      }
    };
  }

  /**
   * Subsribes to token clear events.
   */
  subscribeToTokenClearEvent(subscriber: (() => void)): IServiceSubscription {
    if (subscriber) {
      let uniqueKey = RandomUtils.randomString(12);
      this._tokenClearedSubscribers[uniqueKey] = subscriber;
      this._loggerService.log('AuthTokenService: Subscription to token clear count is now at {0}.',
        [this._getSubscribersCount(this._tokenClearedSubscribers)]);
      return { unsubscribe: () => delete this._tokenClearedSubscribers[uniqueKey] };
    }
    return {
      unsubscribe: () => {
        // no subscriber, empty block
      }
    };
  }

  /**
   * Clear the tokens.
   */
  clearTokens() {
    sessionStorage.removeItem(JwtConstants.JWT_STORE_ACCESSTOKEN_KEY);
    localStorage.removeItem(JwtConstants.JWT_STORE_REFRESHTOKEN_KEY);

    for (let key in this._tokenClearedSubscribers) {
      let subscriber = this._tokenClearedSubscribers[key];
      if (subscriber) {
        subscriber();
      }
    }
  }

  /**
   * Gets access token.
   */
  getAccessToken(): string {
    return this._nullIfStringIsNullOrEmpty(sessionStorage.getItem(JwtConstants.JWT_STORE_ACCESSTOKEN_KEY));
  }

  /**
   * Gets refresh token.
   */
  getRefreshToken(): string {
    return this._nullIfStringIsNullOrEmpty(localStorage.getItem(JwtConstants.JWT_STORE_REFRESHTOKEN_KEY));
  }

  /**
   * Is access token expired.
   */
  isAccessTokenExpired(): boolean {
    return this._isTokenExpired(this.getAccessToken());
  }

  /**
   * Is refresh token expired.
   */
  isRefreshTokenExpired(): boolean {
    return this._isTokenExpired(this.getRefreshToken());
  }

  /**
   * Returns the token expiration date or null if no refresh token exists.
   */
  getAccessTokenExpirationTime(): Date {
    let exp = this._getTokenProperty(JwtConstants.JWT_TOKEN_PROPERTY_EXP, this.getAccessToken());
    if (exp) {
      return new Date(exp * 1000);
    }
    return null;
  }

  /**
   * Updates the tokens.
   */
  updateToken(oauth2Token: OAuth2Token) {
    this._loggerService.info('Refresh token and access token are refreshed.');
    if (oauth2Token.refreshToken) {
      localStorage.setItem(JwtConstants.JWT_STORE_REFRESHTOKEN_KEY, oauth2Token.refreshToken);
    }
    if (oauth2Token.accessToken) {
      sessionStorage.setItem(JwtConstants.JWT_STORE_ACCESSTOKEN_KEY, oauth2Token.accessToken);
      for (let key in this._tokenRefreshEventSubscribers) {
        let subscriber = this._tokenRefreshEventSubscribers[key];
        if (subscriber) {
          subscriber(oauth2Token.accessToken);
        }
      }
    }
  }

  /**
   * Gets the current username.
   */
  currentUsername(): string {
    return this._getTokenProperty(JwtConstants.JWT_TOKEN_PROPERTY_USERNAME, this.getAccessToken());
  }

  /**
   * Gets the current tenant.
   */
  currentTenant(): string {
    return this._getTokenProperty(JwtConstants.JWT_TOKEN_PROPERTY_TID, this.getAccessToken());
  }

  /**
   * Gets the current user id.
   */
  currentUserId(): number {
    return this._getTokenProperty(JwtConstants.JWT_TOKEN_PROPERTY_UID, this.getAccessToken());
  }

  /**
   * Gets authorities.
   */
  getAuthorities(): string[] {
    return this._getTokenProperty(JwtConstants.JWT_TOKEN_PROPERTY_AUT, this.getAccessToken());
  }

  /**
   * Ensures null is not stringyfied.
   */
  private _nullIfStringIsNullOrEmpty(token: string) {
    if (token === 'null' || token === 'undefined') {
      return null;
    }
    return token;
  }

  /**
   * Gets the number of subscribers.
   */
  private _getSubscribersCount(subMap: { [key: string]: ((newToken: string) => void) }) {
    let count = 0;
    if (subMap) {
      for (let key in subMap) {
        if (subMap[key]) {
          count++;
        }
      }
    }

    return count;
  }

  /**
   * Token expired.
   */
  private _isTokenExpired(token: string): boolean {
    if (!token) {
      return true;
    }

    return this._jwtHelper.isTokenExpired(token);
  }

  /**
   * Gets a property value from accessToken.
   */
  private _getTokenProperty(property: string, token: string): any {
    if (!token) {
      return null;
    }

    let decoded: any = this._jwtHelper.decodeToken(token);
    return decoded[property];
  }

}
