import { BaseModel } from '../../shared/index';

import { Gender } from '../index';

export class Profile extends BaseModel {

    constructor(private _userId : number,
                private _firstName : string,
                private _lastName : string,
                private _gender : Gender,
                private _birthday : Date,
                private _avatarUrl : string) {
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

     get gender() : Gender {
         return this._gender;
     }

     get birthday() : Date {
         return this._birthday;
     }

     get avatarUrl() : string {
         return this._avatarUrl;
     }
}

BaseModel.registerType({bindingClassName: 'FullAccountInfoMsg', targetClass: Profile});
