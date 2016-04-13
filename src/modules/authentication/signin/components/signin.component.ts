import {Component, Injectable} from 'angular2/core';
import {CORE_DIRECTIVES, FORM_DIRECTIVES} from 'angular2/common';

import {AuthTokenService} from '../../../../shared/services/auth-token.service';
import {SigninService} from '../services/signin.service';

@Component({
  selector: 'sd-signin',
  providers: [AuthTokenService, SigninService],
  templateUrl: './modules/authentication/signin/components/signin.component.html',
  styleUrls: ['./modules/authentication/signin/components/signin.component.css'],
  directives: [FORM_DIRECTIVES, CORE_DIRECTIVES]
})

@Injectable()
export class SigninComponent {

  socialProviderLinks : any = {
    facebook : '<%= AUTHSERVICE_API_facebookLogin %>'
  };

  constructor(
      private _signinService: SigninService,
      private _authTokenService : AuthTokenService
    ) {}

  login(event : Event, username : string, password : string) {
    event.preventDefault();
    this._signinService.login(username, password);
  }

  refreshAccessToken() {
    this._authTokenService.refreshAccessToken();
  }
}
