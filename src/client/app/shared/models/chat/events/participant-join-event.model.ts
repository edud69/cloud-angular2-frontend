import { BaseModel } from '../../../index';

export class ParticipantJoinEvent extends BaseModel {

    constructor(private _participantName : string, private _channelName : string,
        private _joinTime : Date) {
        super();
    }

     get participantName() : string {
         return this._participantName;
     }
     get channelName() : string {
         return this._channelName;
     }
     get joinTime() : Date {
         return this._joinTime;
     }
}

BaseModel.registerType({bindingClassName: 'ParticipantJoinEventMsg', targetClass: ParticipantJoinEvent});

