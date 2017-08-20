import { BaseModel } from '../../../shared/index';

export class SignupConfirmation extends BaseModel {

    constructor(private _email : string,
                private _confirmationToken : string,
                private _tenantId : string) {
        super();
    }

     get email() : string {
         return this._email;
     }

     get tenantId() : string {
         return this._tenantId;
     }

     get confirmationToken() : string {
         return this._confirmationToken;
     }
}
