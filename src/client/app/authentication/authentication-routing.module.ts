import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { Route } from '@angular/router';
import { applySecurity } from '../route-manager';

import { ChangePasswordComponent, LostPasswordComponent, RestorePasswordComponent,
         SigninComponent, SignupComponent, SignupConfirmationComponent } from './index';



const AuthenticationRoutes: Route[] = [
  {
    path: 'signin',
    component: SigninComponent,
  },
  {
    path: 'signup',
    component: SignupComponent
  },
  {
    path: 'signup/confirm',
    component: SignupConfirmationComponent
  },
  {
    path: 'password/lost',
    component: LostPasswordComponent
  },
  {
    path: 'password/change',
    component: ChangePasswordComponent,
    data: {isAuthenticationRequired: true}
  },
  {
    path: 'password/restore',
    component: RestorePasswordComponent
  }
];




@NgModule({
  imports: [RouterModule.forChild(applySecurity(AuthenticationRoutes))],
  exports: [RouterModule]
})
export class AuthenticationRoutingModule { }
