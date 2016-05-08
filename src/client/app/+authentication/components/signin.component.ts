import {Component, Injectable, OnInit} from 'angular2/core';
import {CORE_DIRECTIVES, FORM_DIRECTIVES} from 'angular2/common';

import {SigninService, ISocialProviderSigninLinks} from '../index';

//TODO remove this service...
import {AuthTokenService} from '../../shared/index';

@Component({
  selector: 'sd-signin',
  providers: [SigninService],
  templateUrl: 'app/+authentication/components/signin.component.html',
  styleUrls: ['app/+authentication/components/signin.component.css'],
  directives: [FORM_DIRECTIVES, CORE_DIRECTIVES]
})
/**
 * The SigninComponent class.
 */
@Injectable()
export class SigninComponent implements OnInit {

  isLogged : boolean = false;

  socialProviderLinks : ISocialProviderSigninLinks = null;

  /**
   * Ctor.
   */
  constructor(
      private _signinService: SigninService,
      private _authTokenService : AuthTokenService) {
    }

  /**
   * Initializer.
   */
  ngOnInit() {
    //TODO put this login in another service...
    this.isLogged = !this._authTokenService.isRefreshTokenExpired();
    this._authTokenService.subscribeToTokenClearEvent({
      onTokenCleared: () => this.isLogged = false
    });
    this._authTokenService.subscribeToTokenRefreshEvent({
      onTokenRefreshed: newToken => this.isLogged = true
    });

    this.socialProviderLinks = this._signinService.socialProviderLinks;
    this._signinService.checkForSocialSignIn();
  }

  /**
   * Login the users.
   */
  login(event : Event, username : string, password : string) {
    event.preventDefault();
    this._signinService.login(username, password).subscribe(
      data => alert(data),
      error => alert(error)
    );
  }

  logout() {
    //TODO remove from here... only for tests...
    this._authTokenService.clearTokens();
  }

  refreshAccessToken() {
    // TODO remove from here... (only for tests)
    this._authTokenService.refreshAccessToken();
  }
}
