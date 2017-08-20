import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { Http, HttpModule, RequestOptions } from '@angular/http';

import { ToolbarComponent } from './toolbar/toolbar.component';
import { NavbarComponent } from './navbar/navbar.component';
import { JwtConstants, HttpConstants } from './index';

/**
 * Angular 2 material imports.
 */
import { MdCoreModule, OVERLAY_PROVIDERS, MdProgressBarModule, MdInputModule,
         MdButtonModule, MdCardModule, MdToolbarModule, MdTooltipModule,
         MdIconModule, MdIconRegistry, MdMenuModule, MdChipsModule, MdCheckboxModule,
         MdDatepickerModule, MdNativeDateModule, MdButtonToggleModule, MdDialogModule,
         MdRadioModule, MdListModule, MdOptionModule, MdSelectModule, MdSliderModule,
         MdSelectionModule, MdLineModule, MdExpansionModule, MdTableModule, MdSortModule,
         MdTabsModule, MdProgressSpinnerModule, MdSlideToggleModule, MdGridListModule,
         MdPaginatorModule, MdRippleModule, MdSidenavModule, MdSnackBarModule } from '@angular/material';
const angular2MdModules: any = [MdCoreModule, MdProgressBarModule, MdInputModule,
                                MdCardModule, MdButtonModule, MdToolbarModule, MdTooltipModule,
                                MdIconModule, MdMenuModule, MdChipsModule, MdCheckboxModule, MdDatepickerModule,
                                MdNativeDateModule, MdButtonToggleModule, MdDialogModule, MdRadioModule, MdListModule,
                                MdOptionModule, MdSelectModule, MdSliderModule, MdSelectionModule, MdLineModule,
                                MdExpansionModule, MdTableModule, MdSortModule, MdTabsModule, MdProgressSpinnerModule,
                                MdSlideToggleModule, MdGridListModule, MdPaginatorModule, MdRippleModule,
                                MdSidenavModule, MdSnackBarModule];
const angular2MdProviders: any = [MdIconRegistry, OVERLAY_PROVIDERS];

/**
 * ng2-file-upload imports.
 */
import { FileUploadModule } from 'ng2-file-upload';

/**
 * ng2-completer imports.
 */
import { Ng2CompleterModule } from 'ng2-completer';

/**
 * Other 3rd party imports.
 */
import { AuthHttp, AuthConfig } from 'angular2-jwt';


/** Angular2 JWT. */
export function authHttpServiceFactory(http: Http, options: RequestOptions) {
   return new AuthHttp(new AuthConfig({
    headerName: HttpConstants.HTTP_HEADER_AUTHORIZATION,
    headerPrefix: HttpConstants.HTTP_HEADER_VALUE_BEARER_PREFIX,
    tokenName: JwtConstants.JWT_STORE_ACCESSTOKEN_KEY,
    tokenGetter: () => sessionStorage.getItem(JwtConstants.JWT_STORE_ACCESSTOKEN_KEY),
    globalHeaders: [],
    noJwtError: true,
    noTokenScheme: true
  }), http, options);
}

export const angular2JwtProviders: any = [
  {
  provide: AuthHttp,
    useFactory: authHttpServiceFactory,
    deps: [Http]
  }
];



/**
 * Error pages.
 */
import { Http404Component } from '../error-pages/index';
const errorPages : any = [Http404Component];

/**
 * Shared Directives.
 */
import { HasPermissionDirective, HasAllPermissionDirective, HasAnyPermissionDirective } from './index';
const sharedDirectives: any = [HasAllPermissionDirective, HasAnyPermissionDirective, HasPermissionDirective];

/**
 * Shared Services.
 */
import { AuthoritiesService, AuthTokenService, AuthStateService, AuthTokenRefreshMonitorService,
         ChatService, HttpRestService, HttpCallbackHandlerService, LoggerService, TenantResolverService,
         WebsocketService, ProfileLiteService, EventService } from './index';

const sharedServices: any = [AuthoritiesService, AuthTokenService, AuthStateService, AuthTokenRefreshMonitorService,
  ChatService, HttpRestService, HttpCallbackHandlerService, LoggerService, TenantResolverService,
  WebsocketService, ProfileLiteService, EventService];


/**
 * Shared components.
 */
import { ErrorBoxComponent, LogoutButtonComponent, FormSubmitButtonComponent,
        FormResetButtonComponent, FormFieldErrorLabelComponent, AutoCompleteInputComponent,
        FormFileUploadComponent } from './index';

const sharedComponents: any = [ErrorBoxComponent, LogoutButtonComponent, FormSubmitButtonComponent,
                               FormResetButtonComponent, FormFieldErrorLabelComponent, AutoCompleteInputComponent,
                               FormFileUploadComponent];

/**
 * Do not specify providers for modules that might be imported by a lazy loaded module.
 */

@NgModule({
  imports: [CommonModule, RouterModule, angular2MdModules, ReactiveFormsModule, Ng2CompleterModule, FormsModule, FileUploadModule],
  declarations: [ToolbarComponent, NavbarComponent, sharedDirectives, errorPages, sharedComponents],
  exports: [ToolbarComponent, NavbarComponent, sharedComponents,
            CommonModule, FormsModule, ReactiveFormsModule, RouterModule, sharedDirectives,
            angular2MdModules, Ng2CompleterModule, FileUploadModule]
})
export class SharedModule {
  static forRoot(): ModuleWithProviders {
    return {
      ngModule: SharedModule,
      providers: [sharedServices, angular2JwtProviders, angular2MdProviders]
    };
  }
}




