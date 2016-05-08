import {Injectable} from 'angular2/core';
import {Http, Response} from 'angular2/http';
import {Observable} from 'rxjs/Observable';

import {JwtConstants, HttpConstants} from '../../shared/index';

import {AuthTokenService} from '../../shared/index';
import {LoggerService} from '../../shared/index';
import {TenantResolverService} from '../../shared/index';

import {ObservableServiceAction} from '../../shared/index';

import {HttpUrlUtils} from '../../shared/index';

/**
 * Social signing api links.
 */
export interface ISocialProviderSigninLinks {
  facebook : string;
  google : string;
}

/**
 * Signin Service.
 */
@Injectable()
export class SigninService {

  private _socialProviderLinks : ISocialProviderSigninLinks = {
    facebook : '<%= AUTHSERVICE_API_facebookLogin %>',
    google : '<%= AUTHSERVICE_API_googleLogin %>'
  };

  /**
   * Ctor.
   */
  constructor(private _http : Http,
    private _authTokenService: AuthTokenService, private _loggerService : LoggerService,
    private _tenantResolverService : TenantResolverService) { }

  /**
   * Gets the social api signin links.
   */
  get socialProviderLinks() : ISocialProviderSigninLinks {
    return this._socialProviderLinks;
  }

  /**
   * Login.
   */
  login(username: string, password: string) : Observable<Response> {
    let headers : any = {};
    headers[HttpConstants.HTTP_HEADER_TENANTID] = this._tenantResolverService.resolveCurrentTenant();
    headers[HttpConstants.HTTP_HEADER_ACCEPT] = HttpConstants.HTTP_HEADER_VALUE_APPLICATIONJSON;
    headers[HttpConstants.HTTP_HEADER_CONTENT_TYPE] = HttpConstants.HTTP_HEADER_VALUE_APPLICATIONJSON;
    headers[HttpConstants.HTTP_HEADER_AUTHORIZATION] =
          HttpConstants.HTTP_HEADER_VALUE_BASIC_PREFIX + ' ' + btoa(username + ':' + password);

    let httpCall = this._http.post('<%= AUTHSERVICE_API_login %>', '', { headers: headers });

    return ObservableServiceAction.fromHttpCallObservable(httpCall, {
      onSuccess: response => {
        this._authTokenService.updateToken(response);
        return response;
      },
      onError: error => {
        this._loggerService.error('An error occurred. Trace: ' + error);
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
      localStorage.setItem(JwtConstants.JWT_STORE_REFRESHTOKEN_KEY, refreshToken);
      this._authTokenService.refreshAccessToken();
    }
  }
}
