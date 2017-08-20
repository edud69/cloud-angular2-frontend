import { BaseModel } from '../../index';

/**
 * The websocket token update request message class.
 */
export class WebsocketTokenUpdateRequestMsg extends BaseModel {

    constructor(private _newTokenValue : string) {
      super();
    }

     get newTokenValue() : string {
         return this._newTokenValue;
     }
}

BaseModel.registerType({bindingClassName: 'TokenUpdateRequestMsg', targetClass: WebsocketTokenUpdateRequestMsg});
