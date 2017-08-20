import { UpdatePasswordRequest } from '../../index';

export class RestorePasswordRequest extends UpdatePasswordRequest {

    constructor(_username : string,
                private _lostPasswordToken : string,
                _newPassword : string) {
                    super(_username, _newPassword, true);
                }

    get lostPasswordToken() {
        return this._lostPasswordToken;
    }
}
