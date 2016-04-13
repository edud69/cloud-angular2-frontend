import {Component} from 'angular2/core';
import {ROUTER_DIRECTIVES, RouteConfig} from 'angular2/router';

// shared components
import {NavbarComponent} from './navbar.component';
import {ToolbarComponent} from './toolbar.component';
import {HomeComponent} from '../../home/components/home.component';
import {AboutComponent} from '../../about/components/about.component';

// shared service
import {NameListService} from '../../shared/services/name-list.service';
import {AuthTokenService} from '../../shared/services/auth-token.service';
import {LoggerService} from '../../shared/services/logger.service';

// Components
import {SigninComponent} from '../../modules/authentication/signin/components/signin.component';
import {SignupComponent} from '../../modules/authentication/signup/components/signup.component';
import {SignupConfirmationComponent} from '../../modules/authentication/signup/components/signup-confirmation.component';


// AppComponent
@Component({
  selector: 'sd-app',
  providers: [AuthTokenService, LoggerService, NameListService],
  templateUrl: './app/components/app.component.html',
  directives: [ROUTER_DIRECTIVES, NavbarComponent, ToolbarComponent]
})

@RouteConfig([
  { path: '/',      name: 'Home',  component: HomeComponent  },
  { path: '/signin', name: 'Signin', component: SigninComponent },
  { path: '/signup', name: 'Signup', component: SignupComponent },
  { path: '/signup/confirmation', name: 'SignupConfirmation', component: SignupConfirmationComponent },
  { path: '/about', name: 'About', component: AboutComponent }
])
export class AppComponent {}
