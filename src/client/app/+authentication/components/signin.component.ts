import {Component, Injectable} from 'angular2/core';
import {CORE_DIRECTIVES, FORM_DIRECTIVES} from 'angular2/common';

import {AuthTokenService} from '../../shared/index';
import {SigninService} from '../index';

@Component({
  selector: 'sd-signin',
  providers: [AuthTokenService, SigninService],
  templateUrl: 'app/+authentication/components/signin.component.html',
  styleUrls: ['app/+authentication/components/signin.component.css'],
  directives: [FORM_DIRECTIVES, CORE_DIRECTIVES]
})

@Injectable()
export class SigninComponent {

  socialProviderLinks : any = {
    facebook : '<%= AUTHSERVICE_API_facebookLogin %>',
    google : '<%= AUTHSERVICE_API_googleLogin %>'
  };

  constructor(
      private _signinService: SigninService,
      private _authTokenService : AuthTokenService
    ) {}

  login(event : Event, username : string, password : string) {
    event.preventDefault();
    this._signinService.login(username, password).subscribe(
      data => alert(data),
      error => alert(error)
    );
  }

  refreshAccessToken() {
    this._authTokenService.refreshAccessToken();
  }
}
