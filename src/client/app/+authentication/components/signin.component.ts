import {Component, Injectable, OnInit} from 'angular2/core';
import {CORE_DIRECTIVES, FORM_DIRECTIVES} from 'angular2/common';

import {AuthTokenService} from '../../shared/index';
import {SigninService} from '../index';

@Component({
  selector: 'sd-signin',
  providers: [SigninService],
  templateUrl: 'app/+authentication/components/signin.component.html',
  styleUrls: ['app/+authentication/components/signin.component.css'],
  directives: [FORM_DIRECTIVES, CORE_DIRECTIVES]
})

@Injectable()
export class SigninComponent implements OnInit {

  isLogged : boolean = false;

  socialProviderLinks : any = {
    facebook : '<%= AUTHSERVICE_API_facebookLogin %>',
    google : '<%= AUTHSERVICE_API_googleLogin %>'
  };

  constructor(
      private _signinService: SigninService,
      private _authTokenService : AuthTokenService
    ) {}

  ngOnInit() {
    this.isLogged = !this._authTokenService.isRefreshTokenExpired(); //TODO put this login in authservice
    this._authTokenService.subscribeToTokenClearEvent({
      onTokenCleared: () => this.isLogged = false
    });
    this._authTokenService.subscribeToTokenRefreshEvent({
      onTokenRefreshed: newToken => this.isLogged = true
    });

    let refreshToken = this._getParameterByName('refresh_token');
    if(refreshToken) {
      localStorage.setItem('jwt_refresh_token', refreshToken);
      this._authTokenService.refreshAccessToken();
    }
  }

  login(event : Event, username : string, password : string) {
    event.preventDefault();
    this._signinService.login(username, password).subscribe(
      data => alert(data),
      error => alert(error)
    );
  }

  logout() {
    this._authTokenService.clearTokens();
  }

  refreshAccessToken() {
    this._authTokenService.refreshAccessToken();
  }

  private _getParameterByName(name : string) {
    let url = window.location.href;
    name = name.replace(/[\[\]]/g, "\\$&");
    let regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, " "));
}
}
