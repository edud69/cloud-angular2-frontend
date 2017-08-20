import { BaseModel } from '../base.model';

export class ApiError extends BaseModel {

    constructor(private _code : string,
                private _message : string,
                private _errorParams? : any) {
        super();
    }

     get code() : string {
         return this._code;
     }

     get message() : string {
         return this._message;
     }

     get errorParams() : any {
         return this._errorParams;
     }
}

BaseModel.registerType({bindingClassName: 'ApiError', targetClass: ApiError});
