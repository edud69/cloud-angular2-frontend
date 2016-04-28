import {BaseModel} from '../base.model';
import {ChatMessage} from './chat-message.model';

export class GroupChatMessage extends ChatMessage {

    constructor(_message : string, _senderUsername : string, private _channelName : string) {
        super(_message, _senderUsername);
    }

     get channelName() : string {
         return this._channelName;
     }
}

BaseModel.registerType({bindingClassName: 'ChatGroupMsg', targetClass: GroupChatMessage});
