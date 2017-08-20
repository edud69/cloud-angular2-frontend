import {Route} from '@angular/router';

import {ProfileComponent} from './index';

import {PermissionConstants} from '../shared/index';

export const ProfileRoutes: Route[] = [
  {
    path: 'profile/view',
    component: ProfileComponent,
    data: {permissions: [PermissionConstants.ACCOUNT_READ]}
  }
];
