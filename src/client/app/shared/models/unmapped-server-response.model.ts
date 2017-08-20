import { BaseModel } from './base.model';

export class UnmappedServerResponse extends BaseModel {

    constructor(private _internalResponse : any) {
        super();
    }

     get internalResponse() : any {
         return this._internalResponse;
     }
}
