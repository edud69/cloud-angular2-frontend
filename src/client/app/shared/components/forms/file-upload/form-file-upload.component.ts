import { Component, Injectable, Input, OnDestroy } from '@angular/core';

import { FileDropDirective, FileSelectDirective, FileUploader } from 'ng2-file-upload';

import { FileUploadService } from '../../../services/forms/file-upload/file-upload.service';
import { AuthStateService, UploaderType, IFileUploadResultsSubscriber } from '../../../index';

@Component({
  moduleId: module.id,
  selector: 'sd-file-upload',
  templateUrl: 'form-file-upload.component.html',
  providers: [FileUploadService, FileDropDirective, FileSelectDirective]
})
@Injectable()
export class FormFileUploadComponent implements OnDestroy {

    hasBaseDropZoneOver : boolean = false;
    errorMessages : string[] = [];
    uploader : FileUploader;

    private _url : string;
    private _allowedFileTypes : string[];
    private _maxSize : number;
    private _subscriptionToAuthState : any;
    private _uploaderType : UploaderType;

    /**
     * Ctor.
     */
    constructor(private _authStateService : AuthStateService,
                private _fileUploadService : FileUploadService) {
                    // when we get a new token, make sure the file uploader gets refreshed
                    this._subscriptionToAuthState = this._authStateService.subscribe(state => this._initialize());
                }

    /**
     * Stringified uploader type.
     */
    get uploaderTypeStringify() : string {
        return UploaderType[this._uploaderType];
    }

    /**
     * Argument to subscriber to the upload process.
     */
    @Input()
    set subscriber(subscriber : IFileUploadResultsSubscriber) {
        this._fileUploadService.subscriber = subscriber;
    }


    /**
     * Uploader type.
     */
    @Input()
    set uploaderType(type : UploaderType) {
        this._uploaderType = type;
    }

    /**
     * Url where to make the upload.
     */
    @Input()
    set uploadUrl(url : string) {
        this._url  = url;
        this._initialize();
    }

    /**
     * Allowed filetypes. It is the MIME type prefix (ex: application/json, then it is 'json'.
     * So, available values are : image, application, audio, text, video, etc.).
     */
    @Input()
    set fileTypes(types : string) {
        if(types) {
            let asArr : string[] = types.split(',');
            if(asArr.length === 1 && asArr[0] === '*') {
                this._allowedFileTypes = null;
            } else {
                this._allowedFileTypes = asArr.map(elem => elem.trim());
            }
        } else {
            this._allowedFileTypes = null;
        }

        this._initialize();
    }

    /**
     * Maximum size per file (in kilobytes).
     */
    @Input()
    set maxSizeKb(maxSize : number) {
        this._maxSize = maxSize ? +maxSize * 1000 : null; // forces input to be number type (otherwise sometimes it is a string)
        this._initialize();
    }

    /**
     * On destroy.
     */
    public ngOnDestroy() {
        let sub = this._subscriptionToAuthState;
        if(sub) {
            sub.unsubscribe();
        }
    }

    /**
     * Starts the upload process.
     */
    public uploadAll() {
        this._fileUploadService.uploadAll();
    }

    /**
     * Clears the upload queue.
     */
    public clearAll() {
        this._fileUploadService.clearAll();
    }

    /**
     * Used for basedrop type when mouse is over.
     */
    public fileOverBase(e:any):void {
        this.hasBaseDropZoneOver = e;
    }

    /**
     * Initializes the service.
     */
    private _initialize() {
        this.uploader = this._fileUploadService
                        .initialize(this._uploaderType, this._url, this._maxSize, this._allowedFileTypes, this.errorMessages);
    }
}
