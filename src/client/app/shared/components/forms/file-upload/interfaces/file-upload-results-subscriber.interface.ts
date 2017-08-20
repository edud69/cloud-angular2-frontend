/**
 * Callback when to track the file upload process (passed as argument of the directive).
 */
export interface IFileUploadResultsSubscriber {
    onUploadStarted() : void;
    onFileUploaded(filename : string, uploadedDestination: string) : void;
    onFileError(filename : string) : void;
    onUploadCompleted() : void;
}
