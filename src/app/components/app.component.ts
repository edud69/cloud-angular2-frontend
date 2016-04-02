import {Component} from 'angular2/core';
import {ROUTER_DIRECTIVES, RouteConfig} from 'angular2/router';
import {NavbarComponent} from './navbar.component';
import {ToolbarComponent} from './toolbar.component';
import {HomeComponent} from '../../home/components/home.component';
import {SigninComponent} from '../../modules/authentication/signin/components/signin.component';
import {SignupComponent} from '../../modules/authentication/signup/components/signup.component';
import {AboutComponent} from '../../about/components/about.component';
import {AuthTokenService} from '../../shared/services/auth-token.service';
import {NameListService} from '../../shared/services/name-list.service';
import {SigninService} from '../../modules/authentication/signin/services/signin.service';
import {SignupService} from '../../modules/authentication/signup/services/signup.service';

@Component({
  selector: 'sd-app',
  viewProviders: [AuthTokenService, NameListService, SigninService, SignupService],
  moduleId: module.id,
  templateUrl: './app.component.html',
  directives: [ROUTER_DIRECTIVES, NavbarComponent, ToolbarComponent]
})
@RouteConfig([
  { path: '/',      name: 'Home',  component: HomeComponent  },
  { path: '/login', name: 'Login', component: SigninComponent  },
  { path: '/signup', name: 'Signup', component: SignupComponent  },
  { path: '/about', name: 'About', component: AboutComponent }
])
export class AppComponent {}
