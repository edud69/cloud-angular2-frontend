import { BaseModel, ApiError } from '../../../index';

/**
 * The interface for service actions.
 */
export interface IServiceActions<T extends BaseModel> {
    onSuccess(response : BaseModel) : T;
    onError(error : ApiError, httpStatusCode : string) : ApiError;
    onCompletion() : void;
}
