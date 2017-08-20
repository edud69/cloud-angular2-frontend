import { Component, Injectable, OnDestroy } from '@angular/core';

import { AuthTokenService, AuthStateService, AuthenticationState, IServiceSubscription } from '../../index';


@Component({
  moduleId: module.id,
  selector: 'sd-logout-button',
  templateUrl: 'logout-button.component.html',
  styleUrls: ['logout-button.component.css']
})

/**
 * The Logout button component class.
 */
@Injectable()
export class LogoutButtonComponent implements OnDestroy {

  isUserLogged : boolean;

  private _sub : IServiceSubscription;

  /**
   * Ctor.
   */
  constructor(private _authStateService : AuthStateService,
              private _authTokenService : AuthTokenService) {
      this.isUserLogged = this._authStateService.currentUserAuthenticationState === AuthenticationState.Authenticated;

      this._sub = this._authStateService.subscribe(state => {
        this.isUserLogged = this._authStateService.currentUserAuthenticationState === AuthenticationState.Authenticated;
      });
  }

  /**
   * On click.
   */
  onClick() {
    this._authTokenService.clearTokens();
  }

  /**
   * On Destroy.
   */
  ngOnDestroy() {
    if(this._sub) {
      this._sub.unsubscribe();
    }
  }

}
