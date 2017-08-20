import { UpdatePasswordRequest } from '../../index';

export class ChangePasswordRequest extends UpdatePasswordRequest {

    constructor(_username : string,
                private _oldPassword : string,
                _newPassword : string) {
                    super(_username, _newPassword, false);
                }

    get oldPassword() {
        return this._oldPassword;
    }
}
