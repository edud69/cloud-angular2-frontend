import { BaseForm, FormValidationError } from '../../../shared/index';

export class ChangePasswordForm extends BaseForm {

    constructor() {
        super();
    }

    get newPassword() {
        return this._doGetFormValue('newPassword');
    }

    set newPassword(newPassword : string) {
        this._doSetFormValue('newPassword', newPassword);
    }

    get newPasswordConfirm() {
        return this._doGetFormValue('newPasswordConfirm');
    }

    set newPasswordConfirm(newPasswordConfirm : string) {
        this._doSetFormValue('newPasswordConfirm', newPasswordConfirm);
    }

    get previousPassword() {
        return this._doGetFormValue('previousPassword');
    }

    set previousPassword(previousPassword : string) {
        this._doSetFormValue('previousPassword', previousPassword);
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
