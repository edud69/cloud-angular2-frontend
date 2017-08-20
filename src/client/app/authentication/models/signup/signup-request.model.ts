import { BaseModel } from '../../../shared/index';

export class SignupRequest extends BaseModel {

    constructor(private _email : string,
                private _password : string,
                private _tenantId : string) {
        super();
    }

     get email() : string {
         return this._email;
     }

     get tenantId() : string {
         return this._tenantId;
     }

     get password() : string {
         return this._password;
     }
}
