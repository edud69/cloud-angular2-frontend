import {Component, OnInit} from 'angular2/core';
import {ROUTER_DIRECTIVES, RouteConfig} from 'angular2/router';

// shared components
import {NavbarComponent} from './navbar.component';
import {ToolbarComponent} from './toolbar.component';
import {HomeComponent} from '../+home/index';
import {AboutComponent} from '../+about/index';
import {SigninComponent} from '../+authentication/components/signin.component';
import {SignupComponent} from '../+authentication/components/signup.component';
import {SignupConfirmationComponent} from '../+authentication/components/signup-confirmation.component';

import {AuthTokenRefreshMonitorService} from '../shared/index';

// AppComponent
@Component({
  selector: 'sd-app',
  templateUrl: './app/components/app.component.html',
  directives: [ROUTER_DIRECTIVES, NavbarComponent, ToolbarComponent]
})

@RouteConfig([
  { path: '/', name: 'Home', component: HomeComponent },
  { path: '/signin', name: 'Signin', component: SigninComponent },
  { path: '/signup/confirm', name: 'SignupConfirmation', component: SignupConfirmationComponent },
  { path: '/signup', name: 'Signup', component: SignupComponent },
  { path: '/about', name: 'About', component: AboutComponent }
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
