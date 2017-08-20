import { Component, Injectable } from '@angular/core';

import { SigninService } from '../../index';

import { TenantResolverService } from '../../../shared/index';

@Component({
  moduleId: module.id,
  selector: 'sd-google-signin-button',
  template: '<form ngNoForm method="POST" [action]="getLink()"><button type="submit" color="primary" md-raised-button>' +
            'TODO translate:Forms.AuthenticationModule.googleSigninButton\'</button></form>'
})
/**
 * The GoogleSocialSigninButtonComponent class.
 */
@Injectable()
export class GoogleSocialSigninButtonComponent {

  constructor(private _signinService : SigninService, private _tenantResolverService : TenantResolverService) {}

  getLink() : string {
    let tid = this._tenantResolverService.resolveCurrentTenant();
    return this._signinService.socialProviderLinks.google + '?tenant=' + tid;
  }
}
