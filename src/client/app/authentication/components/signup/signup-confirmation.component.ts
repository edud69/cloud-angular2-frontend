import { Component, OnInit, Injectable } from '@angular/core';

import { SignupConfirmationService } from '../../index';

import { BaseForm, ManagedComponent } from '../../../shared/index';

@Component({
  moduleId: module.id,
  selector: 'sd-signup-confirm',
  templateUrl: 'signup-confirmation.component.html'
})
/**
 * The signup confirmation component.
 */
@Injectable()
export class SignupConfirmationComponent extends ManagedComponent<BaseForm> implements OnInit {

  accountConfirmed : boolean = false;

  /**
   * Ctor.
   */
  constructor(private _signupConfirmationService: SignupConfirmationService) {
    super();
  }

  /**
   * Initializer.
   */
  ngOnInit() {
    this._invokeAsyncService(() => this._signupConfirmationService.confirmSignup())
      .then(response => this.accountConfirmed = true,
            error => this.accountConfirmed = false,
            () => {/*nothing*/});
  }
}
