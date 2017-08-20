import { Component, Injectable } from '@angular/core';
import { Router } from '@angular/router';

import { SigninService, SigninForm, FacebookSocialSigninButtonComponent, GoogleSocialSigninButtonComponent } from '../../index';

import { AuthStateService, LoggerService, ManagedComponent } from '../../../shared/index';

@Component({
  moduleId: module.id,
  selector: 'sd-signin',
  templateUrl: 'signin.component.html',
  providers: [FacebookSocialSigninButtonComponent, GoogleSocialSigninButtonComponent]
})
/**
 * The SigninComponent class.
 */
@Injectable()
export class SigninComponent extends ManagedComponent<SigninForm> {

  /**
   * Ctor.
   */
  constructor(
      private _signinService: SigninService,
      private _loggerService : LoggerService,
      private _authStateService : AuthStateService,
      private _router : Router) {
        super(new SigninForm());
    }

  /**
   * Login the users.
   */
  login() {
    this._invokeAsyncService(() => this._signinService.login(this.form))
    .then(response => { this._router.navigate(['/home']); },
      error => {/*nothing*/},
      () => {/*nothing*/});
  }
}
