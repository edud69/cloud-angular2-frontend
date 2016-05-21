import {Component, OnInit} from '@angular/core';
import {ROUTER_DIRECTIVES, Routes} from '@angular/router';
import { HTTP_PROVIDERS} from '@angular/http';

// shared components
import {NavbarComponent} from './shared/navbar/index';
import {ToolbarComponent} from './shared/toolbar/index';
import {HomeComponent} from './+home/index';
import {AboutComponent} from './+about/index';
import {SigninComponent} from './+authentication/index';
import {SignupComponent} from './+authentication/index';
import {SignupConfirmationComponent} from './+authentication/index';

import {AuthTokenRefreshMonitorService} from './shared/index';

/**
 * This class represents the main application component. Within the @Routes annotation is the configuration of the
 * applications routes, configuring the paths for the lazy loaded components (HomeComponent, AboutComponent).
 */// AppComponent
@Component({
  moduleId: module.id,
  selector: 'sd-app',
  templateUrl: 'app.component.html',
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
