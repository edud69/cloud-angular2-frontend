import { Component, Injectable } from '@angular/core';

import { SignupService, SignupForm } from '../../index';

import { ManagedComponent } from '../../../shared/index';

@Component({
  moduleId: module.id,
  selector: 'sd-signup',
  templateUrl: 'signup.component.html'
})
/**
 * The signup component class.
 */
@Injectable()
export class SignupComponent extends ManagedComponent<SignupForm> {

  success : boolean;

  /**
   * Ctor.
   */
  constructor(private _signupService: SignupService) {
    super(new SignupForm());
  }

  /**
   * Signup the user.
   */
  signup() {
    this._invokeAsyncService(() => this._signupService.signup(this.form)).then(
        success => this.success = true,
        error => this.success = false,
        () => {/*nothing*/});
  }
}
