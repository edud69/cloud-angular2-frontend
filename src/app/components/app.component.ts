import {Component} from 'angular2/core';
import {ROUTER_DIRECTIVES, RouteConfig} from 'angular2/router';
import {NavbarComponent} from './navbar.component';
import {ToolbarComponent} from './toolbar.component';
import {HomeComponent} from '../../home/components/home.component';
import {LoginComponent} from '../../login/components/login.component';
import {AboutComponent} from '../../about/components/about.component';
import {NameListService} from '../../shared/services/name-list.service';
import {LoginService} from '../../login/services/login.service';

@Component({
  selector: 'sd-app',
  viewProviders: [NameListService, LoginService],
  moduleId: module.id,
  templateUrl: './app.component.html',
  directives: [ROUTER_DIRECTIVES, NavbarComponent, ToolbarComponent]
})
@RouteConfig([
  { path: '/',      name: 'Home',  component: HomeComponent  },
  { path: '/login', name: 'Login', component: LoginComponent  },
  { path: '/about', name: 'About', component: AboutComponent }
])
export class AppComponent {}
