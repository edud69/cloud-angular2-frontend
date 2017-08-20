import { Observable } from 'rxjs/Observable';
import { Injectable } from '@angular/core';

import { BaseModel, EmptySuccessServerResponse,
         UnmappedServerResponse, ApiError,
         ErrorCodeConstants, HttpConstants,
         IApiResult, JsonModelConverter, IServiceActions } from '../../index';

/**
 * Converts an http observable to a managed callback that would either send an ApiError or a Model.
 */
@Injectable()
export class HttpCallbackHandlerService {

    /**
     * Wraps an http call observable into a new observable.
     * This allows multiple subscribe() without firerring new http requests for each subscription.
     */
    handle<T extends BaseModel>(httpCall : Observable<any>, servicesActions :
      IServiceActions<T>) : IApiResult<T> {
          let apiCallObservable : IApiResult<T> = {
            subscribe: (successFct, errorFct, completionFct) => {
              let sub = httpCall
                  .finally(
                    () => {
                      servicesActions.onCompletion();
                      if(completionFct) {
                        completionFct();
                      }
                    }
                  )
                  .subscribe(
                    response => {
                      if(successFct) {
                        successFct(this._processResponse(response, servicesActions));
                      }
                    },
                    error => {
                      if(errorFct) {
                        errorFct(this._processError(error, servicesActions));
                      }
                    }
                  );

                  return {
                    unsubscribe: () => {
                      sub.unsubscribe();
                    }
                  };
            }
          };

          return apiCallObservable;
    }

    /**
     * Processes an error.
     */
    private _processError<T extends BaseModel>(error : any, servicesActions : IServiceActions<T>) : ApiError {
        let apiError : ApiError;

        let statusCode : any = null;
        if(error && error.status) {
          statusCode = error.status;
        }

        try {
          let json = error.json();
          let asModel = JsonModelConverter.fromJson(json);
          apiError = <ApiError>(asModel);
        } catch (ex) {
          if(statusCode === HttpConstants.HTTP_STATUSCODE_UNAUTHORIZED) {
            apiError = new ApiError(ErrorCodeConstants.ERROR_CODE_BAD_CREDENTIALS, 'Bad credentials.');
          } else {
            apiError = new ApiError(ErrorCodeConstants.ERROR_CODE_UNKNOWN, error);
          }
        }

        return servicesActions.onError(apiError, statusCode);
    }

    /**
     * Processes a OK response.
     */
    private _processResponse<T extends BaseModel>(response : any, servicesActions : IServiceActions<T>) : T {
      try {
        if(response._body !== undefined && response._body.length === 0) {
          return servicesActions.onSuccess(new EmptySuccessServerResponse());
        } else {
          let json = response.json();
          let asModel = JsonModelConverter.fromJson(json);
          return servicesActions.onSuccess(asModel);
        }
      } catch (ex) {
        let model = new UnmappedServerResponse(response);
        return servicesActions.onSuccess(model);
      }
    }
}
