import {Component} from 'angular2/core';
import {CORE_DIRECTIVES, FORM_DIRECTIVES} from 'angular2/common';

import {SignupConfirmationService} from '../services/signup-confirmation.service';

@Component({
  selector: 'sd-signup-confirm',
  moduleId: module.id,
  providers: [SignupConfirmationService],
  templateUrl: './signup-confirmation.component.html',
  styleUrls: ['./signup-confirmation.component.css'],
  directives: [FORM_DIRECTIVES, CORE_DIRECTIVES]
})
export class SignupConfirmationComponent {

  constructor(public signupConfirmationService: SignupConfirmationService) {}

  confirmSignup(event : Event, username : string, password : string, confirmationToken : string) {
    event.preventDefault();
    this.signupConfirmationService.confirmSignup(username, password, confirmationToken);
  }
}
