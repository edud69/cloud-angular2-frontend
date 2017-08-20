import { BaseForm, FormValidationError } from '../../../shared/index';

export class SignupForm extends BaseForm {

    constructor() {
        super(true);
    }

    get username() {
        return this._doGetFormValue('username');
    }

    set username(username : string) {
        this._doSetFormValue('username', username);
    }

    get password() {
        return this._doGetFormValue('password');
    }

    set password(password : string) {
        this._doSetFormValue('password', password);
    }

    get passwordConfirm() {
        return this._doGetFormValue('passwordConfirm');
    }

    set passwordConfirm(passwordConfirm : string) {
        this._doSetFormValue('passwordConfirm', passwordConfirm);
    }

    protected _doAdditionalValidationOnField(fieldName : string, value : any) : FormValidationError[] {
        let errors : FormValidationError[] = [];

        // password must match
        let fieldNameToCompare : string = null;
        if(fieldName === 'password') {
            fieldNameToCompare = 'passwordConfirm';
        } else if(fieldName === 'passwordConfirm') {
            fieldNameToCompare = 'password';
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
