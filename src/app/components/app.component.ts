import {Component} from 'angular2/core';
import {ROUTER_DIRECTIVES, RouteConfig, AsyncRoute} from 'angular2/router';

// shared components
import {NavbarComponent} from './navbar.component';
import {ToolbarComponent} from './toolbar.component';
import {HomeComponent} from '../../home/components/home.component';
import {AboutComponent} from '../../about/components/about.component';

// shared service
import {NameListService} from '../../shared/services/name-list.service';

// lazy-loaded routes
var signinLazyLoadRoute : AsyncRoute = new AsyncRoute({
    path: '/signin',
    name: 'Signin',
    loader: () => System.import('../../modules/authentication/signin/components/signin.component').then((m : any) => m.SigninComponent)
  });
var signupLazyLoadRoute : AsyncRoute = new AsyncRoute({
    path: '/signup',
    name: 'Signup',
    loader: () => System.import('../../modules/authentication/signup/components/signup.component').then((m : any) => m.SignupComponent)
  });
var signupConfirmationLazyLoadRoute : AsyncRoute = new AsyncRoute({
    path: '/signup/confirm/:args',
    name: 'SignupConfirmation',
    loader: () => System.import('../../modules/authentication/signup/components/signup-confirmation.component')
                    .then((m : any) => m.SignupConfirmationComponent)
  });


// AppComponent
@Component({
  selector: 'sd-app',
  viewProviders: [NameListService],
  moduleId: module.id,
  templateUrl: './app.component.html',
  directives: [ROUTER_DIRECTIVES, NavbarComponent, ToolbarComponent]
})

@RouteConfig([
  { path: '/',      name: 'Home',  component: HomeComponent  },
  signinLazyLoadRoute,
  signupLazyLoadRoute,
  signupConfirmationLazyLoadRoute,
  { path: '/about', name: 'About', component: AboutComponent }
])
export class AppComponent {}
