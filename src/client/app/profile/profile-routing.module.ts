import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { Route } from '@angular/router';

import { applySecurity } from '../route-manager';
import { ProfileComponent } from './index';
import { PermissionConstants } from '../shared/index';



const ProfileRoutes: Route[] = [
  {
    path: '',
    component: ProfileComponent,
    data: {permissions: [PermissionConstants.ACCOUNT_READ]}
  }
];




@NgModule({
  imports: [RouterModule.forChild(applySecurity(ProfileRoutes))],
  exports: [RouterModule]
})
export class ProfileRoutingModule { }
