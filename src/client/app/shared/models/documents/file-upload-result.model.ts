import { BaseModel } from '../base.model';

export class FileUploadResult extends BaseModel {

    constructor(private _uploadedDestination : string) {
        super();
    }

     get uploadedDestination() : string {
         return this._uploadedDestination;
     }
}

BaseModel.registerType({bindingClassName: 'FileUploadResultMessage', targetClass: FileUploadResult});
