import {Component} from 'angular2/core';
import {ROUTER_DIRECTIVES, RouteConfig} from 'angular2/router';

// shared components
import {NavbarComponent} from './navbar.component';
import {ToolbarComponent} from './toolbar.component';
import {HomeComponent} from '../+home/index';
import {AboutComponent} from '../+about/index';
import {SigninComponent} from '../+authentication/components/signin.component';
import {SignupComponent} from '../+authentication/components/signup.component';
import {SignupConfirmationComponent} from '../+authentication/components/signup-confirmation.component';


// shared service
import {NameListService} from '../shared/index';
import {AuthTokenService} from '../shared/index';
import {LoggerService} from '../shared/index';

// AppComponent
@Component({
  selector: 'sd-app',
  providers: [AuthTokenService, LoggerService, NameListService],
  templateUrl: 'app/components/app.component.html',
  directives: [ROUTER_DIRECTIVES, NavbarComponent, ToolbarComponent]
})

@RouteConfig([
  { path: '/', name: 'Home', component: HomeComponent },
  { path: '/signin', name: 'Signin', component: SigninComponent },
  { path: '/signup', name: 'Signup', component: SignupComponent },
  { path: '/signup/confirmation', name: 'SignupConfirmation', component: SignupConfirmationComponent },
  { path: '/about', name: 'About', component: AboutComponent }
])
export class AppComponent {}
