import { Component, Injectable } from '@angular/core';

import { LostPasswordService, LostPasswordForm } from '../../index';

import { ManagedComponent } from '../../../shared/index';

@Component({
  moduleId: module.id,
  selector: 'sd-lost-password',
  templateUrl: 'lost-password.component.html'
})
/**
 * The LostPasswordComponent class.
 */
@Injectable()
export class LostPasswordComponent extends ManagedComponent<LostPasswordForm> {

  /**
   * Ctor.
   */
  constructor(private _lostPasswordService : LostPasswordService) {
    super(new LostPasswordForm());
  }

  /**
   * Sends the query.
   */
  submit() {
    this._invokeAsyncService(() => this._lostPasswordService.buildAndSendLostPasswordRequest(this.form));
  }
}
