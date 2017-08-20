import { BaseForm, FormValidationError } from '../../../shared/index';

export class RestorePasswordForm extends BaseForm {

    constructor(username: string, lostPasswordToken: string) {
        super(false, {'username' : username, 'lostPasswordToken': lostPasswordToken});
    }

    get username() {
        return this._doGetFormValue('username');
    }

    set username(username : string) {
        this._doSetFormValue('username', username);
    }

    get lostPasswordToken() {
        return this._doGetFormValue('lostPasswordToken');
    }

    set lostPasswordToken(lostPasswordToken : string) {
        this._doSetFormValue('lostPasswordToken', lostPasswordToken);
    }

    get newPassword() {
        return this._doGetFormValue('newPassword');
    }

    set newPassword(newPassword : string) {
        this._doSetFormValue('newPassword', newPassword);
    }

    get newPasswordConfirm() {
        return this._doGetFormValue('newPassword');
    }

    set newPasswordConfirm(newPasswordConfirm : string) {
        this._doSetFormValue('newPasswordConfirm', newPasswordConfirm);
    }

    protected _doAdditionalValidationOnField(fieldName : string, value : any) : FormValidationError[] {
        let errors : FormValidationError[] = [];

        // password must match
        let fieldNameToCompare : string = null;
        if(fieldName === 'newPassword') {
            fieldNameToCompare = 'newPasswordConfirm';
        } else if(fieldName === 'newPasswordConfirm') {
            fieldNameToCompare = 'newPassword';
        }

        if(fieldNameToCompare) {
            let areSame = this._doPasswordMatchValidation(fieldName, value, fieldNameToCompare);
            if(!areSame) {
                errors.push(new FormValidationError('1x0000', 'Password do not match.'));
            }
        }

        return errors;
    }
}
