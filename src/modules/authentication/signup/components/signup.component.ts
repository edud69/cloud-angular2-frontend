import {Component} from 'angular2/core';
import {CORE_DIRECTIVES, FORM_DIRECTIVES} from 'angular2/common';

import {SignupService} from '../services/signup.service';

@Component({
  selector: 'sd-signup',
  providers: [SignupService],
  templateUrl: './modules/authentication/signup/components/signup.component.html',
  styleUrls: ['./modules/authentication/signup/components//signup.component.css'],
  directives: [FORM_DIRECTIVES, CORE_DIRECTIVES]
})
export class SignupComponent {

  constructor(private _signupService: SignupService) {}

  signup(event : Event, username : string, password : string) {
    event.preventDefault();
    this._signupService.signup(username, password);
  }
}
