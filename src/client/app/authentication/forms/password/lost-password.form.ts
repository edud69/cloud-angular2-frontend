import { BaseForm, FormValidationError } from '../../../shared/index';

export class LostPasswordForm extends BaseForm {

    constructor() {
        super();
    }

    get username() {
        return this._doGetFormValue('username');
    }

    set username(username : string) {
        this._doSetFormValue('username', username);
    }

    protected _doAdditionalValidationOnField(fieldName : string, value : any) : FormValidationError[] {
        let errors : FormValidationError[] = [];
        return errors;
    }
}
