import { BaseModel } from '../../../shared/index';

export abstract class UpdatePasswordRequest extends BaseModel {

    constructor(private _username : string,
                private _newPassword : string,
                private _useLostPasswordToken : boolean) {
                    super();
                }

    get username() {
        return this._username;
    }

    get newPassword() {
        return this._newPassword;
    }
}
