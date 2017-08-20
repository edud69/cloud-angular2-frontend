import { Component } from '@angular/core';

import { Observable } from 'rxjs/Rx';

import { ChatService, IFileUploadResultsSubscriber } from '../../shared/index';


@Component({
  moduleId: module.id,
  selector: 'sd-home',
  templateUrl: 'home.component.html'
})
export class HomeComponent {

  tableDatasource : any[] = [{
         name: 'Matt',
         email: 'mymail@domain.com',
         city: 'mycity',
         age: '26',
     },
     {
         name: 'Bob',
         email: 'mymail2@domain.com',
         city: 'mycity2',
         age: '33',
     },
     {
         name: 'Jack',
         email: 'mymail3@domain.com',
         city: 'mycity3',
         age: '34',
     },
     {
         name: 'Elvis',
         email: 'mymail4@domain.com',
         city: 'mycity4',
         age: '35',
     },
     {
         name: 'Gaston',
         email: 'mymail5@domain.com',
         city: 'mycity5',
         age: '95',
     },
     {
         name: 'Igor',
         email: 'mymail6@domain.com',
         city: 'mycity6',
         age: '55',
     }];

  chatMessage: string;
  status : string = 'OFFLINE';
  docBackendApi : string = '<%= BACKEND_API.DOCUMENTSERVICE_API_uploadUserAvatar %>';
  fileuploadSub : IFileUploadResultsSubscriber = {
    onFileError: (filename : string) => console.log('Error with file ' + filename),
    onFileUploaded: (filename : string, destination : string) => console.log('File ' + filename + ' uploaded to ' + destination),
    onUploadCompleted: () => console.log('Upload process completed'),
    onUploadStarted: () => console.log('upload process started')
  };

  private _messages : string[] = [];

  private _typingActionSub : any;

  constructor(public chatService: ChatService) {}

  onAutoCompleteItemSelected(item : any) {
    console.log('Result returned from user selection. Item: ' + item);
  }

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
          },
          onParticipantJoin: (partipantJoinEvent) => {
            alert(partipantJoinEvent.toJsonString());
          },
          onParticipantLeave: (participantLeaveEvent) => {
            alert(participantLeaveEvent.toJsonString());
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
