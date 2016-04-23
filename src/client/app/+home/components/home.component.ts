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
  chatMessage: string;

  private _messages : string[] = [];

  constructor(public nameListService: NameListService, public chatService: ChatService) {}

  displayChatMessages() : string[] {
    return this._messages;
  }

  connectChat() {
    this.chatService.openSession({
      onConnectionEstablished: () => this.chatService.join({
        onReceive: (message : any) => {
          this._messages.push(message.body);
        }
      })
    });
  }

  sendChat() {
    if(this.chatMessage !== null && this.chatMessage !== undefined && this.chatMessage.length > 0) {
      this.chatService.sendChat(this.chatMessage);
    }
  }

  addName(): boolean {
    this.nameListService.add(this.newName);
    this.newName = '';
    return false;
  }
}
