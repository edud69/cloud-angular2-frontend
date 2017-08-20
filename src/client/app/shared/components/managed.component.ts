import { OnDestroy } from '@angular/core';

import { ApiError, IServiceSubscription, BaseForm, BaseModel,
         RandomUtils, IApiResult, IServiceCallback } from '../../shared/index';

/**
 * Managed component that auto-closes resources and provides error and response fields for Form support.
 */
export abstract class ManagedComponent<T extends BaseForm> implements OnDestroy {


  error : ApiError;

  form : T;

  response : any;

  private _subs : {[key: string] : IServiceSubscription} = {};

  private _isWaitingForAsyncResponse = false;

  /**
   * Ctor.
   */
  constructor(form? : T) {
      this.form = form;
  }

  /**
   * Tells if this component is waiting for an async callback not completed.
   */
  get isProcessing() {
    return this._isWaitingForAsyncResponse;
  }

  /**
   * Resets the form.
   */
  resetForm() {
    if(this.form) {
      this.form.resetForm();
    }
  }

  /**
   * On destroy.
   */
  ngOnDestroy() {
    for(let key in this._subs) {
        this._unsubscribe(key);
    }
  }

  protected _onWaitForProcess() : void {
    //nothing
  }

  protected _onProcessingCompleted() : void {
    // nothing
  }

  /**
   * Invoke a service with async response and auto-closes resources after response is received.
   */
  protected _invokeAsyncService<E extends BaseModel>(fct : (() => IApiResult<E>)) : IServiceCallback<E> {
        this._updateWaitingState(true);

        let key = RandomUtils.randomString(12);
        let subSuccessFct : any;
        let subErrorFct : any;
        let subCompletedFct : any;

        this.error = null;
        this.response = null;

          // makes the async call
          this._subs[key] = fct().subscribe(
              response => {
                this.response = response;
                if(subSuccessFct) {
                  subSuccessFct(response);
                }
              },
              error => {
                this.error = error;
                if(subErrorFct) {
                  subErrorFct(error);
                }
              },
              () => {
                this._unsubscribe(key);
                if(subCompletedFct) {
                  subCompletedFct();
                }

                if(this._getSubsCount() === 0) {
                  this._updateWaitingState(false);
                }
              }
          );

      return {
        then(successFct, errorFct, completedFct) {
          subSuccessFct = successFct;
          subErrorFct = errorFct;
          subCompletedFct = completedFct;
        }
      };
  }

  /**
   * Updates the processing state.
   */
  private _updateWaitingState(isWaiting : boolean) {
    if(isWaiting !== this._isWaitingForAsyncResponse) {
      this._isWaitingForAsyncResponse = isWaiting;
      if(this._isWaitingForAsyncResponse) {
        this._onWaitForProcess();
      } else {
        this._onProcessingCompleted();
      }
    }
  }

  /**
   * Unsubscribes.
   */
  private _unsubscribe(key : string) {
    if(key && this._subs[key]) {
      this._subs[key].unsubscribe();
      delete this._subs[key];
    }
  }

  /**
   * Gets the subscribers count.
   */
  private _getSubsCount() {
    let count = 0;
    for(let key in this._subs) {
      if(this._subs[key]) {
        count++;
      }
    }
    return count;
  }
}
