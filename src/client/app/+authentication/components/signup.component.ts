import {Component, Injectable} from 'angular2/core';
import {CORE_DIRECTIVES, FORM_DIRECTIVES} from 'angular2/common';

import {SignupService} from '../index';

@Component({
  selector: 'sd-signup',
  providers: [SignupService],
  templateUrl: 'app/+authentication/components/signup.component.html',
  styleUrls: ['app/+authentication/components/signup.component.css'],
  directives: [FORM_DIRECTIVES, CORE_DIRECTIVES]
})

@Injectable()
export class SignupComponent {

  constructor(private _signupService: SignupService) {}

  signup(event : Event, username : string, password : string) {
    event.preventDefault();
    this._signupService.signup(username, password);
  }
}
