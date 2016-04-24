import {ChatMessage} from './chat-message.model';

export class PrivateChatMessage extends ChatMessage {

    constructor(_message : string, _senderUsername : string, private _targetUsername : string) {
        super(_message, _senderUsername);
    }

     get targetUsername() : string {
         return this._targetUsername;
     }
}
