import {Observable} from 'rxjs/Observable';

import {JsonModelConverter} from '../models/json-model-converter';

/**
 * The interface for service actions.
 */
export interface IServiceActions {
    onSuccess(response : any) : any;
    onError(error : any) : any;
    onCompletion() : void;
}

/**
 * Wraps a service observable into a new observable for external uses.
 */
export class ObservableServiceAction {

    static fromHttpCallObservable(httpCall : Observable<any>, servicesActions : IServiceActions, convertResponseAsModel? : boolean) : Observable<any> {
        return Observable.create((observer : any) => {
          httpCall.subscribe(
            response => {
              try {
                let json = response.json();
                
                if(convertResponseAsModel) {
                  let asModel = JsonModelConverter.fromJson(JSON.parse(json));
                  observer.next(servicesActions.onSuccess(asModel));
                } else {
                  observer.next(servicesActions.onSuccess(json));
                }
              } catch (ex) {
                observer.next(servicesActions.onSuccess(response));
              }
            },
            error => {
              observer.error(servicesActions.onError(error));
            },
            () => {
              servicesActions.onCompletion();
              observer.complete();
            }
          );
        });
    }

}