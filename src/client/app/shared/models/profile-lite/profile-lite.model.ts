import { BaseModel } from '../../index';

export class ProfileLite extends BaseModel {

    constructor(private _firstName : string,
                private _lastName : string,
                private _avatarUrl : string,
                private _userId : number) {
      super();
    }

     get userId() : number {
         return this._userId;
     }
     get firstName() : string {
         return this._firstName;
     }
     get lastName() : string {
         return this._lastName;
     }
     get avatarUrl() : string {
         return this._avatarUrl;
     }
}

BaseModel.registerType({bindingClassName: 'AccountInfoLiteMsg', targetClass: ProfileLite});
