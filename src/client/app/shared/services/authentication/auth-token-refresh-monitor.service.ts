import { Injectable, OnDestroy } from '@angular/core';
import { Observable, Subscription } from 'rxjs/Rx';

import { AuthTokenService, IServiceSubscription, LoggerService, JwtConstants } from '../../index';

/**
 * AuthTokenRefreshMonitorService class.
 */
@Injectable()
export class AuthTokenRefreshMonitorService implements OnDestroy {

    private _monitor : Subscription = null;

    private _subscriptions : IServiceSubscription[] = [];

    /**
     * Ctor.
     */
    constructor(private _authTokenService : AuthTokenService, private _loggerService : LoggerService) {
        this._subscriptions.push(this._authTokenService.subscribeToTokenRefreshEvent(
                newToken => this.startMonitoring()));

        this._subscriptions.push(this._authTokenService.subscribeToTokenClearEvent(
                () => this._stopMonitoring()));
    }

    /**
     * On Destroy.
     */
    public ngOnDestroy() {
        this._stopMonitoring();
        this._subscriptions.forEach(sub => sub.unsubscribe());
    }

    /**
     * Starts the monitoring of the token refresh.
     */
    public startMonitoring() {
        if(!this._monitor) {
            this._loggerService.debug('Starting the Token refresh watchdog.');

            // call manually one loop before interval Starts
            this._monitorLoop();

            this._monitor = Observable.interval(JwtConstants.JWT_REFRESH_CHECK_INTERVAL_IN_SECONDS * 1000)
                .subscribe(() => this._monitorLoop());
        }
    }

    /**
     * Stops the monitoring of the token.
     */
    private _stopMonitoring() {
        if(this._monitor) {
            this._monitor.unsubscribe();
            this._monitor = null;
        }
    }

    /**
     * The logical loop for the token monitoring.
     */
    private _monitorLoop() {
        this._loggerService.log('Token refresh watchdog execution loop running.');

        if(this._authTokenService.isRefreshTokenExpired()) {
            this._loggerService.debug('Refresh token is expired. Token monitoring loop will stop.');
            this._stopMonitoring();
            return;
        }

        let expiration = this._authTokenService.getAccessTokenExpirationTime();
        if(!expiration) {
            this._authTokenService.refreshAccessToken();
            return;
        }

        let now = new Date().getTime();
        let expirationTime = expiration.getTime();
        if(now > (expirationTime - JwtConstants.JWT_REFRESH_CHECK_POLLING_START_BEFORE_EXP_IN_SECONDS * 1000)) {
            // refresh the token
            this._authTokenService.refreshAccessToken();
        }
    }
}
