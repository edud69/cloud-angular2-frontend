import { ApiError, BaseModel, IApiResult } from '../index';

export class ApiResultFactory {

  /**
   * Returns an IApiResult that will immediatly send the
   * given ApiError to the subribers as soon as they subscribe.
   */
  static createInstantError<T extends BaseModel>(apiError : ApiError) : IApiResult<T> {
      return {
            subscribe: (success, error, completion) => {
              if(error) {
                error(apiError);
              }
              if(completion) {
                completion();
              }

              return {
                unsubscribe: () => {
                  // empty: no internal subscription to unsubscribe
                }
              };
        }
      };
  }
}
