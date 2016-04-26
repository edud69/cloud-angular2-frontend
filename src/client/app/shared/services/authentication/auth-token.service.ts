import 'rxjs/add/operator/map';
import {Injectable} from 'angular2/core';
import {Http, Headers} from 'angular2/http';
import {JwtHelper} from 'angular2-jwt/angular2-jwt';

import {JwtConstants} from '../../constants/jwt.constants';
import {HttpConstants} from '../../constants/http.constants';

import {LoggerService} from '../logger/logger.service';

/**
 * Authentication Token Service.
 */
@Injectable()
export class AuthTokenService {

  private _jwtHelper: JwtHelper = new JwtHelper();

  constructor(private _http : Http, private _loggerService : LoggerService) {}

  /**
   * Refresh the tokens.
   */
  refreshAccessToken() {
    let refreshToken : string = this.getRefreshToken();
    if(!refreshToken) {
      this._loggerService.debug('No refresh token found.');
      return;
    }

    let parameters : string = '?' + JwtConstants.JWT_REFRESH_URL_PARAM  + '=' + refreshToken;

    let headers : Headers = new Headers();
    headers.append(HttpConstants.HTTP_HEADER_TENANTID, 'master'); //TODO use a constant class and get the current tenant


    this._http.post('<%= AUTHSERVICE_API_refreshJwtToken %>' + parameters, '', { headers: headers })
      .map(response => response.json())
      .subscribe(
        data  => this.updateToken(data),
        err => this._loggerService.error(err),
        () => this._loggerService.log('Refresh completed')
      );
  }

  /**
   * Clear the tokens.
   */
  clearTokens() {
    sessionStorage.removeItem(JwtConstants.JWT_STORE_ACCESSTOKEN_KEY);
    localStorage.removeItem(JwtConstants.JWT_STORE_REFRESHTOKEN_KEY);
  }

  /**
   * Gets access token.
   */
  getAccessToken() : string {
    return sessionStorage.getItem(JwtConstants.JWT_STORE_ACCESSTOKEN_KEY);
  }

  /**
   * Gets refresh token.
   */
  getRefreshToken() : string {
    return localStorage.getItem(JwtConstants.JWT_STORE_REFRESHTOKEN_KEY);
  }

  /**
   * Is access token expired.
   */
  isAccessTokenExpired() : boolean {
    return this._isTokenExpired(this.getAccessToken());
  }

  /**
   * Is refresh token expired.
   */
  isRefreshTokenExpired() : boolean {
    return this._isTokenExpired(this.getRefreshToken());
  }

  /**
   * Updates the tokens.
   */
  updateToken(json : any) {
    this._loggerService.info('Refresh token and access token are refreshed.');
    sessionStorage.setItem(JwtConstants.JWT_STORE_ACCESSTOKEN_KEY, json.access_token);
    localStorage.setItem(JwtConstants.JWT_STORE_REFRESHTOKEN_KEY, json.refresh_token);
  }

  /**
   * Gets the current username.
   */
  currentUsername() : string {
    return this._getTokenProperty(JwtConstants.JWT_TOKEN_PROPERTY_USERNAME);
  }

  /**
   * Gets authorities.
   */
  getAuthorities() : string[] {
    return this._getTokenProperty(JwtConstants.JWT_TOKEN_PROPERTY_AUT);
  }

  /**
   * Token expired.
   */
  private _isTokenExpired(token : string) : boolean {
    if(!token) {
      return true;
    }

    return this._jwtHelper.isTokenExpired(token);
  }

  /**
   * Gets a property value from accessToken.
   */
  private _getTokenProperty(property : string) : any {
    let token = this.getAccessToken();
    if(!token) {
      return null;
    }

    let decoded : any = this._jwtHelper.decodeToken(token);
    return decoded[property];
  }
}
