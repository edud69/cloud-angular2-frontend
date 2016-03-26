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
  newName: string;
  constructor(public loginService: LoginService) {}

  /*
   * @param newname  any text as input.
   * @returns return false to prevent default form submit behavior to refresh the page.
   */
  addName(): boolean {
    this.loginService.add(this.newName);
    this.newName = '';
    return false;
  }

  login(event : Event, username : string, password : string) {
	this.loginService.login(event, username, password);
  }
}
