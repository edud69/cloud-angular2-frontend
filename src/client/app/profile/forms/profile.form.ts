import { BaseForm, FormValidationError } from '../../shared/index';

import { Gender } from '../index';

/**
 * The profile form.
 */
export class ProfileForm extends BaseForm {

    constructor(firstName : string, lastName : string, gender : Gender, birthday : Date, avatarUrl : string) {
        super(true, {
            firstName: firstName,
            lastName: lastName,
            gender: gender,
            birthday: birthday,
            avatarUrl: avatarUrl
        });
    }

    get firstName() {
        return this._doGetFormValue('firstName');
    }

    set firstName(firstName : string) {
        this._doSetFormValue('firstName', firstName);
    }

    get lastName() {
        return this._doGetFormValue('lastName');
    }

    set lastName(lastName : string) {
        this._doSetFormValue('lastName', lastName);
    }

    get gender() {
        return this._doGetFormValue('gender');
    }

    set gender(gender : Gender) {
        this._doSetFormValue('gender', gender);
    }

    get birthday() {
        return this._doGetFormValue('birthday');
    }

    set birthday(birthday : Date) {
        this._doSetFormValue('birthday', birthday);
    }

    get avatarUrl() {
        return this._doGetFormValue('avatarUrl');
    }

    set avatarUrl(avatarUrl : string) {
        this._doSetFormValue('avatarUrl', avatarUrl);
    }

    protected _doAdditionalValidationOnField(fieldName : string, value : any) : FormValidationError[] {
        return null;
    }
}
