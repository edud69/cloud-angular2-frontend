import { BaseModel } from '../../../index';

export class TypingAction extends BaseModel {

    private _actionTime : Date;

    constructor(private _author : string, private _channelName : string,
        private _targetUsername : string) {
        super();
        this._actionTime = new Date();
    }

     get channelName() : string {
         return this._channelName;
     }
     get author() : string {
         return this._author;
     }
     get targetUsername() : string {
         return this._targetUsername;
     }
     get actionTime() : Date {
         return this._actionTime;
     }
}

BaseModel.registerType({bindingClassName: 'TypingActionMsg', targetClass: TypingAction});
