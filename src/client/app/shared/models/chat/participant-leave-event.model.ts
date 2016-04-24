import {BaseModel} from '../base.model';

export abstract class ParticipantLeaveEvent extends BaseModel {

    constructor(private _participantName : string, private _channelName : string,
        private _leaveTime : Date) {
        super();
    }

     get participantName() : string {
         return this._participantName;
     }
     get channelName() : string {
         return this._channelName;
     }
     get leaveTime() : Date {
         return this._leaveTime;
     }
}

BaseModel.registerType({bindingClassName: 'ParticipantLeaveEventMsg', targetClass: ParticipantLeaveEvent});

