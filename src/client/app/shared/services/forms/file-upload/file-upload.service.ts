import { Injectable } from '@angular/core';

import { FileUploader, Headers } from 'ng2-file-upload';

import { JsonModelConverter } from '../../../models/json-model-converter';
import { HttpConstants, AuthTokenService, LoggerService, TenantResolverService,
         FileUploadResult, ApiError, IFileUploadResultsSubscriber, UploaderType } from '../../../index';

/**
 * Service used for the file-upload directive (not a singleton).
 */
@Injectable()
export class FileUploadService {

    private _uploader : FileUploader;
    private _maxSize : number;
    private _allowedFileTypes : string[];
    private _subscriber : IFileUploadResultsSubscriber;
    private _uploaderType : UploaderType;
    private _errorMessages : string[];

    /**
     * Ctor.
     */
    constructor(private _authTokenService : AuthTokenService,
                private _tenantResolverService : TenantResolverService,
                private _loggerService : LoggerService) {}

    set subscriber(subscriber : IFileUploadResultsSubscriber) {
        this._subscriber = subscriber;
    }

    get subscriber() {
        return this.subscriber;
    }

    /**
     * Uploads all files.
     */
    public uploadAll() {
        let sub = this._subscriber;
        if(sub) {
            this._subscriber.onUploadStarted();
        }

        this._uploader.uploadAll();
    }

    /**
     * Clears upload queue.
     */
    public clearAll() {
        this._uploader.clearQueue();
        this._errorMessages.splice(0, this._errorMessages.length);
    }

    /**
     * Creates the uploader.
     */
    public initialize(uploaderType : UploaderType, url : string, maxSize : number, allowedFileTypes : string[], errorMessages : string[]) {
        this._errorMessages = errorMessages;

        if(url) {
            this._maxSize = maxSize;
            this._allowedFileTypes = allowedFileTypes;
            this._uploaderType = uploaderType;

            let headers : Array<Headers> = [];
            let accessToken = this._authTokenService.getAccessToken();

            if(accessToken) {
                let headerValue = HttpConstants.HTTP_HEADER_VALUE_BEARER_PREFIX + ' ' + accessToken;
                headers.push({name: HttpConstants.HTTP_HEADER_AUTHORIZATION, value: headerValue});
            }

            headers.push({name: HttpConstants.HTTP_HEADER_TENANTID, value: this._tenantResolverService.resolveCurrentTenant()});

            // restore previous elements if they exists
            let elementsInQueue : any[] = null;
            if(this._uploader) {
                elementsInQueue = this._uploader.queue;
            }

            this._uploader = new FileUploader(
                {url: url, headers: headers, maxFileSize: maxSize, allowedFileType: allowedFileTypes });

            if(elementsInQueue) {
                elementsInQueue.forEach(item => this._uploader.addToQueue(item));
            }

            this._initializeCallbacks();
        }

        return this._uploader;
    }

    /**
     * Setups the callbacks.
     */
    private _initializeCallbacks() {
        // setup the callback for getting detailed errors from a file upload error
        // also used to get back the uploaded url
        this._uploader.onCompleteItem = (item : any, response : any, status : any, headers : any) => {
            if(status !== HttpConstants.HTTP_STATUSCODE_OK) {
                this._loggerService.warn('File {0} could not be uploaded, error: {1} with status: {2}.',
                                        [item.file.name, response, status]);
                this._processUploadError(item, response, status);
            } else {
                this._processUploadSuccess(item.file.name, response);
            }
        };

        // when one of the filters fail before contacting backend (frontend validation)
        this._uploader.onWhenAddingFileFailed = (item: any, filter: any, options: any) =>
                                                    this._processFilterError(item, filter, options);

        // after a file was added by the user
        this._uploader.onAfterAddingFile = (fileItem: any) => {
            if(this._errorMessages.length > 0) {
                this._errorMessages.splice(0, this._errorMessages.length);
            }

            // file is already there check
            let toBeRemoved = this._uploader.queue
                                    .filter(item => item.file.name === fileItem.file.name && item.file.size === fileItem.file.size);
            for(let i = 1; i < toBeRemoved.length; i++) {
                this._uploader.removeFromQueue(toBeRemoved[i]);
            }

            if(this._uploaderType === UploaderType.singlefile) {
                // keep only the last element (this one)
                let toBeRemoved = this._uploader.queue.filter(item => item.file.name !== fileItem.file.name);
                toBeRemoved.forEach((item : any) => this._uploader.removeFromQueue(item));
            }

            fileItem['withCredentials'] = false; // prevents CORS errors
        };

        // after upload job is completed
        this._uploader.onCompleteAll = () => {
            this._uploader.clearQueue();

            let sub = this._subscriber;
            if(sub) {
                sub.onUploadCompleted();
            }
        };
    }

    /**
     * Received a success response after upload.
     */
    private _processUploadSuccess(filename : string, response : any) {
        this._loggerService.debug('File {0} was uploaded with success.', [filename]);
        let asModel : FileUploadResult = <FileUploadResult>JsonModelConverter.fromJson(JSON.parse(response));
        let sub = this._subscriber;

        if(sub) {
            sub.onFileUploaded(filename, asModel.uploadedDestination);
        }
    }

    /**
     * Error received during the filter validation (when adding a file).
     */
    private _processFilterError(item: any, filter: any, options: any) : any {
        this._uploader.clearQueue(); // its all are none, if one item fails, all must fail
        if(this._errorMessages.length > 0) {
            this._errorMessages.splice(0, this._errorMessages.length);
        }

        if(filter.name === 'fileType') {
            let params = {allowedTypes: this._allowedFileTypes, filename: item.name};
            this._createErrorMessage(new ApiError('1x0006', 'Filetype is not allowed for file: ' + item.name + '.', params));
        } else if(filter.name === 'fileSize') {
            let params = {maxFileSize: (this._maxSize / 1000000).toFixed(3),
                          currentSize: (item.size / 1000000).toFixed(3), filename: item.name};
            this._createErrorMessage(new ApiError('1x0005', 'File is oversized: ' + item.name + '.', params));
        } else {
            this._loggerService.error('Error should be handled, unknown filterType: {0}.', [filter.name]);
            this._createErrorMessage(new ApiError('0x0000', 'Unexpected error while trying to add file: ' + item.name + '.'));
        }

        return null;
    }

    /**
     * Receives error response after upload.
     */
    private _processUploadError(item : any, response : any, status : any) {
        this._uploader.removeFromQueue(item); //removes from queue

        let sub = this._subscriber;
        if(sub) {
            sub.onFileError(item.file.name);
        }

        let apiError : ApiError = null;
        try {
            apiError = <ApiError>JsonModelConverter.fromJson(response);
        } catch (ex) {
            this._loggerService.error('Exception occurred: {0}.', [ex]);
        }

        if(apiError) {
            // reply from backend
            this._createErrorMessage(apiError);
        } else {
            // backend offline
            this._createErrorMessage(new ApiError('0x0000', 'Unexpected error while uploading file: ' + item.file.name + '.'));
        }
    }

    /**
     * Creates a readable error for the user.
     */
    private _createErrorMessage(apiError : ApiError) {
        let errorCode = 'ErrorCodes.' + apiError.code;
        let errorParams = apiError.errorParams;
        //TODO translate this
        let translatedStr = 'TODO translate: ' + errorCode + errorParams;
        this._errorMessages.push(translatedStr);
    }
}
