import { BaseModel } from '../../base.model';

export class OAuth2Token extends BaseModel {

    constructor(private _accessToken : string,
                private _refreshToken : string) {
        super();
    }

     get accessToken() : string {
         return this._accessToken;
     }

     get refreshToken() : string {
         return this._refreshToken;
     }
}

BaseModel.registerType({bindingClassName: 'OAuth2TokenMessage', targetClass: OAuth2Token});
