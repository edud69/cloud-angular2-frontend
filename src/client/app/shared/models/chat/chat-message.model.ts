import {BaseModel} from '../base.model';

export abstract class ChatMessage extends BaseModel {

    constructor(private _message : string, private _senderUsername : string) {
        super();
    }

     get message() : string {
         return this._message;
     }

     get senderUsername() : string {
         return this._senderUsername;
     }
}
