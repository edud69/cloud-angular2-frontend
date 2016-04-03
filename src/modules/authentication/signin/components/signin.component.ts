import {Component} from 'angular2/core';
import {CORE_DIRECTIVES, FORM_DIRECTIVES} from 'angular2/common';

import {AuthTokenService} from '../../../../shared/services/auth-token.service';
import {SigninService} from '../services/signin.service';

@Component({
  selector: 'sd-signin',
  moduleId: module.id,
  providers: [SigninService],
  templateUrl: './signin.component.html',
  styleUrls: ['./signin.component.css'],
  directives: [FORM_DIRECTIVES, CORE_DIRECTIVES]
})
export class SigninComponent {

  socialProviderLinks : any = {
    facebook : '<%= AUTHSERVICE_API_facebookLogin %>'
  };

  constructor(private _signinService: SigninService, private _authTokenService : AuthTokenService) {}

  login(event : Event, username : string, password : string) {
    event.preventDefault();
    this._signinService.login(username, password);
  }

  refreshAccessToken() {
    this._authTokenService.refreshAccessToken();
  }
}
