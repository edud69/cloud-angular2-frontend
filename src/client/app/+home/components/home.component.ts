import {Component} from 'angular2/core';
import {Observable} from 'rxjs/Rx';
import {CORE_DIRECTIVES, FORM_DIRECTIVES} from 'angular2/common';

import {ChatService} from '../../shared/index';

@Component({
  selector: 'sd-home',
  templateUrl: 'app/+home/components/home.component.html',
  styleUrls: ['app/+home/components/home.component.css'],
  directives: [FORM_DIRECTIVES, CORE_DIRECTIVES]
})
export class HomeComponent {
  chatMessage: string;
  status : string = 'OFFLINE';

  private _messages : string[] = [];

  private _typingActionSub : any;

  constructor(public chatService: ChatService) {}

  displayChatMessages() : string[] {
    return this._messages;
  }

  connectChat() {
    this.chatService.openSession({
      onConnectionEstablished: () => {
        this.status = 'ONLINE';
        this.chatService.join('aChannelName', {
          onMessageReceive: (message) => {
            this._messages.push(message.toJsonString());
          },
          onTypingActionReceive: (typingAction) => {
            this._messages.push(typingAction.toJsonString());
          }
        });
      },
      onConnectionClose: () => this.status = 'OFFLINE'
    });
  }

  disconnectChat() {
    this.chatService.closeSession();
  }

  sendChat() {
    if(this.chatMessage !== null && this.chatMessage !== undefined && this.chatMessage.length > 0) {
      if(this._typingActionSub) {
        this._typingActionSub.unsubscribe();
        this._typingActionSub = null;
      }

      this.chatService.sendChat('aChannelName', this.chatMessage);
      this.chatMessage = '';
    }
  }

  enableTypingAction() {
    if(!this._typingActionSub) { //TODO create a map, one subscription per channel
      this._typingActionSub = Observable.interval(500).subscribe((x : any) => {
        if(x > 3) {
          this._typingActionSub.unsubscribe();
          this._typingActionSub = null;
        }

        this.chatService.notifyTypingActionToChannel('aChannelName');
      });
    }
  }
}
