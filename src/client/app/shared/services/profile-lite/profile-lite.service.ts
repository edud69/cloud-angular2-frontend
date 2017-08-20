import { Injectable, OnDestroy } from '@angular/core';

import { ProfileLite, IApiResult, HttpRestService, EventService,
         ProfileLiteRefreshEvent, IEventSubscription, RandomUtils, IServiceSubscription } from '../../../shared/index';

/**
 * ProfileLite Service.
 */
@Injectable()
export class ProfileLiteService implements OnDestroy {

  private _sub : IEventSubscription<ProfileLiteRefreshEvent> = null;

  private _subscribers : {[key : string] : IServiceSubscription} = {};

  constructor(private _httpRestService : HttpRestService,
              private _eventListenerService: EventService) {
                this._sub = this._eventListenerService.subscribe(event => this._onProfileChanged(event), ProfileLiteRefreshEvent);
              }

/**
 * On destroy.
 */
  ngOnDestroy() {
    if(this._sub) {
      this._sub.unsubscribe();
    }
    for(let key in this._subscribers) {
      this._subscribers[key].unsubscribe();
    }
  }

  /**
   * Subscribes.
   */
  subscribeToProfileChanged(subscriber : () => void) {
    let subscriberKey = RandomUtils.randomString(12);
    let sub : IServiceSubscription = { unsubscribe: () => delete this._subscribers[subscriberKey]};
    (<any>sub).callback = subscriber;
    this._subscribers[subscriberKey] = sub;
    return sub;
  }

 /**
  * Gets the profile.
  */
  getProfileLite() : IApiResult<ProfileLite> {
    return this._httpRestService.httpGet<ProfileLite>('<%= BACKEND_API.ACCOUNTSERVICE_API_getProfileLite %>');
  }

  /**
   * Profile changed.
   */
  private _onProfileChanged(event : ProfileLiteRefreshEvent) {
    let subs = this._subscribers;
    for(let key in subs) {
      (<any>subs[key]).callback();
    }
  }
}
