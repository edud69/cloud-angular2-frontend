import { ApiError, BaseModel, IServiceSubscription } from '../../index';

export interface IApiResult<T extends BaseModel> {
  subscribe(observerOrNext?: ((value: T) => void), error?: (error: ApiError) => void, complete?: () => void) : IServiceSubscription;
}
