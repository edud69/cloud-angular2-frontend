import {Injectable} from 'angular2/core';
import {Observable, Subscription} from 'rxjs/Rx';

import {AuthTokenService} from './auth-token.service';
import {LoggerService} from '../logger/logger.service';

import {JwtConstants} from '../../constants/jwt.constants';

/**
 * AuthTokenRefreshMonitorService class.
 */
@Injectable()
export class AuthTokenRefreshMonitorService {

    private _monitor : Subscription = null;

    /**
     * Ctor.
     */
    constructor(private _authTokenService : AuthTokenService, private _loggerService : LoggerService) {
        this._authTokenService.subscribeToTokenRefreshEvent({
           onTokenRefreshed : newToken => this.startMonitoring()
        });
        this._authTokenService.subscribeToTokenClearEvent({
           onTokenCleared : () => this._stopMonitoring()
        });
    }

    /**
     * Starts the monitoring of the token refresh.
     */
    public startMonitoring() {
        if(!this._monitor) {
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
