import { BaseModel } from '../../../index';

export abstract class ChatMessage extends BaseModel {

    private _sentTime : Date = new Date();

    constructor(private _message : string, private _senderUsername : string) {
        super();
    }

     get message() : string {
         return this._message;
     }

     get senderUsername() : string {
         return this._senderUsername;
     }

     get sentTime() : Date {
         return this._sentTime;
     }
}
