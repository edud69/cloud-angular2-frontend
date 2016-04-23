import {Component} from 'angular2/core';
import {CORE_DIRECTIVES, FORM_DIRECTIVES} from 'angular2/common';

import {NameListService} from '../../shared/index';
import {ChatService} from '../../shared/index';

@Component({
  selector: 'sd-home',
  templateUrl: 'app/+home/components/home.component.html',
  styleUrls: ['app/+home/components/home.component.css'],
  directives: [FORM_DIRECTIVES, CORE_DIRECTIVES]
})
export class HomeComponent {
  newName: string;
  constructor(public nameListService: NameListService, public chatService: ChatService) {}

  /*
   * @param newname  any text as input.
   * @returns return false to prevent default form submit behavior to refresh the page.
   */
  addName(): boolean {
    //TODO remove this block... only for testing
    if(this.newName !== null && this.newName !== undefined && this.newName.length > 0) {
      this.chatService.sendChat(this.newName);
    } else {
      this.chatService.openSession(); //TODO remove this, testing prototype... anyways home component will disappear...
    }

    this.nameListService.add(this.newName);
    this.newName = '';
    return false;
  }
}
