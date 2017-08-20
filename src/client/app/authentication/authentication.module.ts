import { NgModule } from '@angular/core';

import { SharedModule } from '../shared/shared.module';
import { AuthenticationRoutingModule } from './authentication-routing.module';
import { ChangePasswordComponent, LostPasswordComponent, RestorePasswordComponent,
         SigninComponent, SignupComponent, SignupConfirmationComponent,
         ChangePasswordService, LostPasswordService,
         SigninService, SignupService, SignupConfirmationService,
         FacebookSocialSigninButtonComponent, GoogleSocialSigninButtonComponent } from './index';

@NgModule({
      imports: [AuthenticationRoutingModule, SharedModule],
      declarations: [ChangePasswordComponent, LostPasswordComponent, RestorePasswordComponent,
            SigninComponent, SignupComponent, SignupConfirmationComponent,
            FacebookSocialSigninButtonComponent, GoogleSocialSigninButtonComponent],
      exports: [ChangePasswordComponent, LostPasswordComponent, RestorePasswordComponent,
            SigninComponent, SignupComponent, SignupConfirmationComponent,
            FacebookSocialSigninButtonComponent, GoogleSocialSigninButtonComponent],
      providers: [ChangePasswordService, LostPasswordService,
            SigninService, SignupService, SignupConfirmationService]
})

export class AuthenticationModule { }
