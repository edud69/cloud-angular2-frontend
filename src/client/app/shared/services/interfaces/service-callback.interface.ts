import { ApiError, BaseModel } from '../../../shared/index';

export interface IServiceCallback<T extends BaseModel> {
  then(success: ((response : T) => void), error: ((err : ApiError) => void), completed: (() => void)) : void;
}
