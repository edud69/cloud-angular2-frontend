/**
 * FormValidationError class.
 */
export class FormValidationError {

    constructor(private _errorCode : string, private _message : string, private _params? : {[key:string] : any}) {}

    get errorCode() : string {
        return this._errorCode;
    }

    get errorParams() : {[key:string] : any} {
        return this._params;
    }

    get message() : string {
        return this._message;
    }
}
