import { BaseModel } from '../../../shared/index';

export class LostPasswordRequest extends BaseModel {

    constructor(private _username : string) {
        super();
    }

     get username() : string {
         return this._username;
     }
}
