import 'rxjs/add/operator/map';
import {Inject} from 'angular2/core';
import {Http, Headers} from 'angular2/http';
import {JwtHelper} from 'angular2-jwt/angular2-jwt';

export class AuthTokenService {

  jwtHelper: JwtHelper = new JwtHelper();

  constructor(@Inject(Http) public http:Http) {}

  refreshAccessToken() {
    let refreshToken : string = this.getRefreshToken();
    if(!refreshToken) {
      alert('no refresh token');
      return;
    }

    let parameters : string = '?refresh_token=' + refreshToken;

    let headers : Headers = new Headers();
    headers.append('X-Tenant-id', 'master'); //TODO


    this.http.post('<%= AUTHSERVICE_API_refreshJwtToken %>' + parameters, '', { headers: headers })
      .map(response => response.json())
      .subscribe(
        data  => this.updateToken(data),
        err => console.log(err),
        () => console.log('Refresh completed')
      );
  }

  getAccessToken() : string {
    return sessionStorage.getItem('jwt_access_token');
  }

  getRefreshToken() : string {
    return localStorage.getItem('jwt_refresh_token');
  }

  isAccessTokenExpired() : boolean {
    return this._isTokenExpired(this.getAccessToken());
  }

  isRefreshTokenExpired() : boolean {
    return this._isTokenExpired(this.getRefreshToken());
  }

  updateToken(json : any) {
    alert(JSON.stringify(json));
    sessionStorage.setItem('jwt_access_token', json.access_token);
    localStorage.setItem('jwt_refresh_token', json.refresh_token);
  }

  private _isTokenExpired(token : string) : boolean {
    if(!token) {
      return true;
    }

    return this.jwtHelper.isTokenExpired(token);
  }
}
