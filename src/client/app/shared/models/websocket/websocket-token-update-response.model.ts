import { BaseModel } from '../../index';

/**
 * The websocket token update response message class.
 */
export class WebsocketTokenUpdateResponseMsg extends BaseModel {

    constructor(private _tokenUpdateTime : Date) {
      super();
    }

     get tokenUpdateTime() : Date {
         return this._tokenUpdateTime;
     }
}

BaseModel.registerType({bindingClassName: 'TokenUpdateResponseMsg', targetClass: WebsocketTokenUpdateResponseMsg});
