import { Component, Injectable } from '@angular/core';

import { ChangePasswordService, ChangePasswordForm } from '../../index';

import { ManagedComponent } from '../../../shared/index';

@Component({
  moduleId: module.id,
  selector: 'sd-change-password',
  templateUrl: 'change-password.component.html'
})
/**
 * The ChangePasswordComponent class.
 */
@Injectable()
export class ChangePasswordComponent extends ManagedComponent<ChangePasswordForm> {

  /**
   * Ctor.
   */
  constructor(private _changePasswordService : ChangePasswordService) {
    super(new ChangePasswordForm());
  }

  /**
   * Submits.
   */
  submit() {
    this._invokeAsyncService(() => this._changePasswordService.changePassword(this.form));
  }
}
