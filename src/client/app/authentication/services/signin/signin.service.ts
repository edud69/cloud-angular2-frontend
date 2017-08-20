import { Injectable } from '@angular/core';
import { Http } from '@angular/http';

import { IApiResult, JwtConstants, HttpConstants,
         OAuth2Token, AuthTokenService, LoggerService,
         TenantResolverService, HttpCallbackHandlerService, HttpUrlUtils } from '../../../shared/index';

import { SigninForm, ISocialProviderSigninLinks } from '../../index';

/**
 * Signin Service.
 */
@Injectable()
export class SigninService {

  private _socialProviderLinks : ISocialProviderSigninLinks = {
    facebook : '<%= BACKEND_API.AUTHSERVICE_API_facebookLogin %>',
    google : '<%= BACKEND_API.AUTHSERVICE_API_googleLogin %>'
  };

  /**
   * Ctor.
   */
  constructor(private _http : Http,
    private _authTokenService: AuthTokenService, private _loggerService : LoggerService,
    private _tenantResolverService : TenantResolverService,
    private _httpCallbackHandlerService : HttpCallbackHandlerService) { }

  /**
   * Gets the social api signin links.
   */
  get socialProviderLinks() : ISocialProviderSigninLinks {
    return this._socialProviderLinks;
  }

  /**
   * Login.
   */
  login(signinForm : SigninForm) : IApiResult<OAuth2Token> {
    let headers : any = {};
    headers[HttpConstants.HTTP_HEADER_TENANTID] = this._tenantResolverService.resolveCurrentTenant();
    headers[HttpConstants.HTTP_HEADER_ACCEPT] = HttpConstants.HTTP_HEADER_VALUE_APPLICATIONJSON;
    headers[HttpConstants.HTTP_HEADER_CONTENT_TYPE] = HttpConstants.HTTP_HEADER_VALUE_APPLICATIONJSON;
    headers[HttpConstants.HTTP_HEADER_AUTHORIZATION] =
          HttpConstants.HTTP_HEADER_VALUE_BASIC_PREFIX + ' ' + btoa(signinForm.username + ':' + signinForm.password);

    let httpCall = this._http.post('<%= BACKEND_API.AUTHSERVICE_API_login %>', '', { headers: headers });

    return this._httpCallbackHandlerService.handle(httpCall, {
      onSuccess: response => {
        let concreteModel = <OAuth2Token>response;
        this._authTokenService.updateToken(concreteModel);
        return concreteModel;
      },
      onError: (error, statusCode) => {
        this._loggerService.error('An error occurred. Trace: {0} with status code {1}.', [error, statusCode]);
        return error;
      },
      onCompletion: () => this._loggerService.log('Request completed.')
    });
  }

  /**
   * Checks if a social refresh_token is given back from a social signin callback.
   */
  checkForSocialSignIn() {
    let refreshToken = HttpUrlUtils.getUrlParameterByName(JwtConstants.JWT_REFRESH_URL_PARAM);
    if(refreshToken) {
      this._authTokenService.updateToken(new OAuth2Token(null, refreshToken));
      this._authTokenService.refreshAccessToken();
    }
  }
}
