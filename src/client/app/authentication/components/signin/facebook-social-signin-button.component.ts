import { Component, Injectable } from '@angular/core';

import { SigninService } from '../../index';

import { TenantResolverService } from '../../../shared/index';

@Component({
  moduleId: module.id,
  selector: 'sd-facebook-signin-button',
  template: '<form ngNoForm method="POST" [action]="getLink()"><button type="submit" color="primary" md-raised-button>' +
            'TODO translate:Forms.AuthenticationModule.facebookSigninButton\</button></form>'
})
/**
 * The FacebookSocialSigninButtonComponent class.
 */
@Injectable()
export class FacebookSocialSigninButtonComponent {

  constructor(private _signinService : SigninService, private _tenantResolverService : TenantResolverService) {}

  getLink() : string {
    let tid = this._tenantResolverService.resolveCurrentTenant();
	  return this._signinService.socialProviderLinks.facebook + '?tenant=' + tid;
  }
  
}
