import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, RouterStateSnapshot, CanActivate, CanDeactivate, Route } from '@angular/router';

import { Http404Component } from './error-pages/index';
import { AuthoritiesService, ManagedComponent, LoggerService,
         AuthenticationState, AuthStateService } from './shared/index';


/**
 * Secures the routes.
 * @param routes the route to be secured
 */
export function applySecurity(routes : Route[]) : Route[] {
  return injectErrorHandlingRoutes(routes.map(route => {
    route.canActivate = route.canActivate ? [RouteGuard, route.canActivate] : [RouteGuard];
    route.canDeactivate = route.canDeactivate ? [RouteGuard, route.canDeactivate] : [RouteGuard];
    return route;
  }));
}

/**
 * Injects the error handling route to the given routes.
 * @param routes the routes
 */
export function injectErrorHandlingRoutes(routes : Route[]) : Route[] {
  return [
    ...routes,
    { path: '**', component: Http404Component }
  ];
}


/**
 * Manager that checks a route against the permission the user has.
 */

@Injectable()
export class RouteGuard implements CanActivate, CanDeactivate<any> {

  constructor(private _authoritiesService : AuthoritiesService,
              private _authStateService : AuthStateService,
              private _loggerService : LoggerService) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    if(!route.data) {
      return true;
    }

    if(!route.data['permissions']) {
      if(route.data['isAuthenticationRequired'] &&
         this._authStateService.currentUserAuthenticationState !== AuthenticationState.Authenticated) {
        this._loggerService.warn('User needs to be authenticated to see the route {0}.', [route.url]);
        return false;
      }

      return true;
    }

    let permissions = route.data['permissions'];
    if(!this._authoritiesService.hasAllPermissions(permissions)) {
      this._loggerService.warn('User is not allowed to view the route {0}. Needed permissions are {1}.', [route.url, permissions]);
      return false;
    }

    return true;
  }

  canDeactivate(component: any, route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    // if a form is dirty, we ask the user to confirm if he wants to lose all his changes
    if(component instanceof ManagedComponent) {
      let asManagedComponent = <ManagedComponent<any>>component;
      if(asManagedComponent.form && asManagedComponent.form.isPreventChangesLossEnabled && asManagedComponent.form.isDirty) {
        return window.confirm('TODO : Translate this! Are you sure you want to leave, the form was modified.');
      }
    }

    return true;
  }
}
