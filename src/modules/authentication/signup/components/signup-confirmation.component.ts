import {Component, OnInit} from 'angular2/core';
import {CORE_DIRECTIVES, FORM_DIRECTIVES} from 'angular2/common';
import {Router} from 'angular2/router';

import {SignupConfirmationService} from '../services/signup-confirmation.service';

@Component({
  selector: 'sd-signup-confirm',
  moduleId: module.id,
  providers: [SignupConfirmationService],
  templateUrl: './signup-confirmation.component.html',
  styleUrls: ['./signup-confirmation.component.css'],
  directives: [FORM_DIRECTIVES, CORE_DIRECTIVES]
})
export class SignupConfirmationComponent implements OnInit {

  constructor(private _signupConfirmationService: SignupConfirmationService, private _router : Router) {}

  ngOnInit() {
    if(window.location.hash) {
      let params : string[] = window.location.hash.split('#');
      if(params.length === 2) {
        let queryParams : string[] = params[1].split('&');
        if(queryParams.length === 2) {
          let param1 : string[] = queryParams[0].split('=');
          let param2 : string[] = queryParams[1].split('=');
          let email : string = decodeURIComponent(param1[0] === 'email' ? param1[1] : param2[1]);
          let confirmationToken : string = decodeURIComponent(param1[0] === 'token' ? param1[1] : param2[1]);
          this.doConfirmSignup(email, confirmationToken);
        }
      }
    }
  }

  private doConfirmSignup(username : string, confirmationToken : string) {
    this._signupConfirmationService.confirmSignup(username, confirmationToken);
  }
}
