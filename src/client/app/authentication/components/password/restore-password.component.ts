import { Component, OnInit, Injectable } from '@angular/core';

import { LostPasswordService, RestorePasswordForm } from '../../index';

import { ManagedComponent } from '../../../shared/index';

@Component({
  moduleId: module.id,
  selector: 'sd-restore-password',
  templateUrl: 'restore-password.component.html'
})
/**
 * The RestorePasswordComponent class.
 */
@Injectable()
export class RestorePasswordComponent extends ManagedComponent<RestorePasswordForm> implements OnInit {

  /**
   * Ctor.
   */
  constructor(private _lostPasswordService : LostPasswordService) {
    super();
  }

  /**
   * Submit.
   */
  submit() {
    this._invokeAsyncService(() => this._lostPasswordService.restorePassword(this.form));
  }

  /**
   * Initializer.
   */
  ngOnInit() {
    let retrievedArgs = this._lostPasswordService.loadLostPasswordToken();
    let username = retrievedArgs.email;
    let lostPasswordToken = retrievedArgs.token;
    this.form = new RestorePasswordForm(username, lostPasswordToken);
  }
}
