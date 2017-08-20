import { Injectable, OnDestroy } from '@angular/core';

import { IServiceSubscription, LoggerService, AuthTokenService, RandomUtils, AuthenticationState } from '../../index';

/**
 * Authentication State Service.
 */
@Injectable()
export class AuthStateService implements OnDestroy {

    private _currentUserAuthState : AuthenticationState;

    private _subscribers : {[key : string] : ((state : AuthenticationState) => void)} = {};

    private _subscriptions : IServiceSubscription[] = [];

    /**
     * Ctor.
     */
    constructor(private _authTokenService : AuthTokenService,
                private _loggerService : LoggerService) {
        this._currentUserAuthState = this._authTokenService.isAccessTokenExpired() ?
                            AuthenticationState.Anonymous : AuthenticationState.Authenticated;
        this._loggerService.debug('Authentication state changed to {0}.', [AuthenticationState[this._currentUserAuthState]]);

        this._subscriptions.push(this._authTokenService.subscribeToTokenClearEvent(
                () => this._updateStateAndNotifySubscribers(AuthenticationState.Anonymous)));

        this._subscriptions.push(this._authTokenService.subscribeToTokenRefreshEvent(
                () => this._updateStateAndNotifySubscribers(AuthenticationState.Authenticated)));
    }

    /**
     * Gets the current user state.
     */
    get currentUserAuthenticationState() {
        return this._currentUserAuthState;
    }

    /**
     * On Destroy.
     */
    ngOnDestroy() {
        this._subscriptions.forEach(sub => sub.unsubscribe());
    }

    /**
     * Subscribes to user state change.
     */
    subscribe(subscriber : ((state : AuthenticationState) => void)) : IServiceSubscription {
        if(subscriber) {
            let uniqueKey = RandomUtils.randomString(12);
            this._subscribers[uniqueKey] = subscriber;
            this._loggerService.log('AuthStateService: subscription -> Subscription count is now at {0}.', [this._getSubscribersCount()]);
            return { unsubscribe: () => delete this._subscribers[uniqueKey] };
        }

        return { unsubscribe : () => {
            // empty subscriber
        }};
    }

    private _getSubscribersCount() {
        let count = 0;
        for(let key in this._subscribers) {
            if(this._subscribers[key]) {
                count++;
            }
        }
        return count;
    }

    private _updateStateAndNotifySubscribers(newState : AuthenticationState) {
        if(this._currentUserAuthState === newState) {
            return;
        }

        this._currentUserAuthState = newState;
        this._loggerService.debug('Authentication state changed to {0}.', [AuthenticationState[this._currentUserAuthState]]);

        for(let key in this._subscribers) {
            let subscriber = this._subscribers[key];
            if(subscriber) {
                subscriber(this._currentUserAuthState);
            }
        }
    }
}
