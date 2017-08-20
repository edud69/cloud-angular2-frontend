import { BaseForm, FormValidationError } from '../../../shared/index';

export class SigninForm extends BaseForm {

    constructor() {
        super();
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

    protected _doAdditionalValidationOnField(fieldName : string, value : any) : FormValidationError[] {
        // no validation
        return [];
    }
}
