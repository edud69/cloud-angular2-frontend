import {Component, OnInit} from '@angular/core';
import {ROUTER_DIRECTIVES, Routes} from '@angular/router';

// shared components
import {NavbarComponent} from './shared/navbar/index';
import {ToolbarComponent} from './shared/toolbar/index';
import {HomeComponent} from './+home/index';
import {AboutComponent} from './+about/index';
import {SigninComponent} from './+authentication/components/signin.component';
import {SignupComponent} from './+authentication/components/signup.component';
import {SignupConfirmationComponent} from './+authentication/components/signup-confirmation.component';

import {AuthTokenRefreshMonitorService} from './shared/index';

// AppComponent
@Component({
  selector: 'sd-app',
  templateUrl: './app/components/app.component.html',
  directives: [ROUTER_DIRECTIVES, NavbarComponent, ToolbarComponent]
})

@Routes([
  { path: '/', component: HomeComponent },
  { path: '/signin', component: SigninComponent },
  { path: '/signup/confirm', component: SignupConfirmationComponent },
  { path: '/signup', component: SignupComponent },
  { path: '/about', component: AboutComponent }
])

/**
 * The main App class.
 */
export class AppComponent implements OnInit {

  constructor(private _authTokenRefreshMonitorService : AuthTokenRefreshMonitorService) {}

  /**
   * Operations to be done at the application startup.
   */
  ngOnInit() {
    this._authTokenRefreshMonitorService.startMonitoring();
  }

}
