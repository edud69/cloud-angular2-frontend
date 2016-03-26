import {Component} from 'angular2/core';
import {CORE_DIRECTIVES, FORM_DIRECTIVES} from 'angular2/common';

import {LoginService} from '../services/login.service';

@Component({
  selector: 'sd-login',
  moduleId: module.id,
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  directives: [FORM_DIRECTIVES, CORE_DIRECTIVES]
})
export class LoginComponent {

  socialProviderLinks : any = {
    facebook : '<%= AUTHSERVICE_API_facebookLogin %>'
  };

  constructor(public loginService: LoginService) {}

  login(event : Event, username : string, password : string) {
    this.loginService.login(event, username, password);
  }

  refreshAccessToken() {
    this.loginService.refreshAccessToken();
  }
}
