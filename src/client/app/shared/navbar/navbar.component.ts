import { Component, OnDestroy } from '@angular/core';

import { AuthStateService, AuthenticationState, IServiceSubscription } from '../index';

/**
 * This class represents the navigation bar component.
 */
@Component({
  moduleId: module.id,
  selector: 'sd-navbar',
  templateUrl: 'navbar.component.html',
  styleUrls: ['navbar.component.css'],
})

export class NavbarComponent implements OnDestroy {

  isAuthenticated : boolean;

  private _authStateSub: IServiceSubscription;

  constructor(private _authStateService: AuthStateService) {
    this._authStateSub = _authStateService.subscribe(authState => this.isAuthenticated = authState === AuthenticationState.Authenticated);
    this.isAuthenticated = this._authStateService.currentUserAuthenticationState === AuthenticationState.Authenticated;
  }


  ngOnDestroy() {
    if (this._authStateSub) {
      this._authStateSub.unsubscribe();
    }
  }
}
