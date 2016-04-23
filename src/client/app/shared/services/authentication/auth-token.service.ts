import 'rxjs/add/operator/map';
import {Injectable} from 'angular2/core';
import {Http, Headers} from 'angular2/http';
import {JwtHelper} from 'angular2-jwt/angular2-jwt';
import {LoggerService} from '../logger/logger.service';

/**
 * Authentication Token Service.
 */
@Injectable()
export class AuthTokenService {

  jwtHelper: JwtHelper = new JwtHelper();

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

    let parameters : string = '?refresh_token=' + refreshToken;

    let headers : Headers = new Headers();
    headers.append('X-Tenant-id', 'master'); //TODO use a constant class and get the current tenant


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
    sessionStorage.removeItem('jwt_access_token');
    localStorage.removeItem('jwt_refresh_token');
  }

  /**
   * Gets access token.
   */
  getAccessToken() : string {
    return sessionStorage.getItem('jwt_access_token');
  }

  /**
   * Gets refresh token.
   */
  getRefreshToken() : string {
    return localStorage.getItem('jwt_refresh_token');
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
    sessionStorage.setItem('jwt_access_token', json.access_token);
    localStorage.setItem('jwt_refresh_token', json.refresh_token);
  }

  /**
   * Token expired.
   */
  private _isTokenExpired(token : string) : boolean {
    if(!token) {
      return true;
    }

    return this.jwtHelper.isTokenExpired(token);
  }
}
