import {Component, OnInit, Injectable} from '@angular/core';
import {CORE_DIRECTIVES, FORM_DIRECTIVES} from '@angular/common';

import {SignupConfirmationService} from '../index';

@Component({
  selector: 'sd-signup-confirm',
  providers: [SignupConfirmationService],
  templateUrl: 'app/+authentication/components/signup-confirmation.component.html',
  styleUrls: ['app/+authentication/components/signup-confirmation.component.css'],
  directives: [FORM_DIRECTIVES, CORE_DIRECTIVES]
})
/**
 * The signup confirmation component.
 */
@Injectable()
export class SignupConfirmationComponent implements OnInit {

  accountConfirmed : boolean = false;

  constructor(private _signupConfirmationService: SignupConfirmationService) {}

  /**
   * Initializer.
   */
  ngOnInit() {
    this._signupConfirmationService.confirmSignup().subscribe(
      response => alert(response),
      error => alert(error)
    );
  }
}
