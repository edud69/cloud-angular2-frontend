import { Component, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';

import { AuthTokenService, ProfileLiteService, AuthStateService, AuthenticationState,
         IServiceSubscription, ProfileLite } from '../index';

/**
 * This class represents the toolbar component.
 */
@Component({
  moduleId: module.id,
  selector: 'sd-toolbar',
  templateUrl: 'toolbar.component.html',
  styleUrls: ['toolbar.component.css']
})

export class ToolbarComponent implements OnDestroy {

  profileLite : ProfileLite;

  isAuthenticated : boolean;

  private _authStateSub: IServiceSubscription;

  private _profileRefreshedSub : IServiceSubscription;

  constructor(private _authTokenService: AuthTokenService,
    private _profileLiteService: ProfileLiteService,
    private _authStateService: AuthStateService,
    private _router: Router
    ) {
    this._profileRefreshedSub = this._profileLiteService.subscribeToProfileChanged(() => this._refreshProfileInfo());
    this._authStateSub = _authStateService.subscribe(authState => this._onAuthStateChanged(authState));
    this.isAuthenticated = this._authStateService.currentUserAuthenticationState === AuthenticationState.Authenticated;
    if(this.isAuthenticated) {
      this._refreshProfileInfo();
    }
  }

  public logout() {
    this._authTokenService.clearTokens();
    this._router.navigate(['/home']);
  }

  get connectedUserUsername() {
    return this._authTokenService.currentUsername();
  }

  ngOnDestroy() {
    if (this._authStateSub) {
      this._authStateSub.unsubscribe();
    }
    if(this._profileRefreshedSub) {
      this._profileRefreshedSub.unsubscribe();
    }
  }

  private _onAuthStateChanged(authState: AuthenticationState) {
    this.isAuthenticated = authState === AuthenticationState.Authenticated;
    if (this.isAuthenticated) {
      this._refreshProfileInfo();
    }
  }

  private _refreshProfileInfo() {
    let call : IServiceSubscription = this._profileLiteService.getProfileLite().subscribe(
      response => this.profileLite = response,
      error => {/*TODO, handle error*/ },
      () => call.unsubscribe());
  }

}
