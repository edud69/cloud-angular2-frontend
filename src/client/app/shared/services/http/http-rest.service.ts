import { Injectable, Injector } from '@angular/core';
import { Http, Headers } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { AuthHttp } from 'angular2-jwt';

import { HttpConstants, BaseModel, IApiResult, IServiceActions,
         UnmappedServerResponse, AuthTokenService, LoggerService,
         TenantResolverService, HttpCallbackHandlerService } from '../../index';

/**
 * HttpRestService Service.
 */
@Injectable()
export class HttpRestService {

  /**
   * Ctor.
   */
  constructor(
    private _authHttp : AuthHttp,
    private _http : Http,
    private _loggerService : LoggerService,
    private _tenantResolverService : TenantResolverService,
    private _injector : Injector,
    private _httpCallbackHandlerService : HttpCallbackHandlerService
  ) {}

  /**
   * Query for HTTP Get.
   */
  public httpGet<T extends BaseModel>(url : string, headers? : Headers) {
    let httpCall = this._createRequest(url, HttpConstants.HTTP_METHOD_GET, null, headers);
    return this._sendRequest<T>(httpCall);
  }

  /**
   * Query for HTTP Post.
   */
  public httpPost<T extends BaseModel>(url : string, model : BaseModel, headers? : Headers) {
    let httpCall = this._createRequest(url, HttpConstants.HTTP_METHOD_POST, model.toJsonString(), headers);
    return this._sendRequest<T>(httpCall);
  }

  /**
   * Query for HTTP Patch.
   */
  public httpPatch<T extends BaseModel>(url : string, model : BaseModel, headers? : Headers) {
    let httpCall = this._createRequest(url, HttpConstants.HTTP_METHOD_PATCH, model.toJsonString(), headers);
    return this._sendRequest<T>(httpCall);
  }

  /**
   * Query for HTTP Delete.
   */
  public httpDelete<T extends BaseModel>(url : string, headers? : Headers) {
    let httpCall = this._createRequest(url, HttpConstants.HTTP_METHOD_DELETE, null, headers);
    return this._sendRequest<T>(httpCall);
  }

  /**
   * Query for HTTP Put.
   */
  public httpPut<T extends BaseModel>(url : string, model : BaseModel, headers? : Headers) {
    let httpCall = this._createRequest(url, HttpConstants.HTTP_METHOD_PUT, model.toJsonString(), headers);
    return this._sendRequest<T>(httpCall);
  }


  /**
   * Gets the AuthTokenService.
   */
  private get _authTokenService() : AuthTokenService {
    // we use the injector because AuthTokenService has a dependency on httpService and vice-versa
    return this._injector.get(AuthTokenService);
  }

  /**
   * Creates the http headers.
   */
  private createHeaders(additionalHeaders? : Headers) {
    var headers : Headers = new Headers();
    if(!additionalHeaders || !additionalHeaders.has(HttpConstants.HTTP_HEADER_ACCEPT)) {
      headers.append(HttpConstants.HTTP_HEADER_ACCEPT, HttpConstants.HTTP_HEADER_VALUE_APPLICATIONJSON);
    }
    if(!additionalHeaders || !additionalHeaders.has(HttpConstants.HTTP_HEADER_CONTENT_TYPE)) {
      headers.append(HttpConstants.HTTP_HEADER_CONTENT_TYPE, HttpConstants.HTTP_HEADER_VALUE_APPLICATIONJSON);
    }
    if(additionalHeaders) {
      additionalHeaders.keys().forEach(headerName =>
                                          additionalHeaders.getAll(headerName).forEach(headerVal =>
                                                      headers.append(headerName, headerVal)));
    }

    let tenantId = this._tenantResolverService.resolveCurrentTenant();
    if(tenantId) {
      headers.append(HttpConstants.HTTP_HEADER_TENANTID, tenantId);
    }

    return headers;
  }

  /**
  * Send request.
  */
  private _sendRequest<T extends BaseModel>(httpCall : Observable<any>) : IApiResult<T> {
    let serviceActions : IServiceActions<T> = {
      onSuccess: (response : T) => {
        this._loggerService.debug('Query returned success result confirmed.');
        if(response instanceof UnmappedServerResponse) {
          this._loggerService.warn('The response received from the server is not mapped to a ' +
                                    'BaseModel object. Response = {0}.', [response]);
        }
        return response;
      },
      onError: (error, statusCode) => {
        this._loggerService.error('An error occurred. Trace: {0} and statusCode {1}.', [error, statusCode]);
        return error;
      },
      onCompletion: () => this._loggerService.log('Request completed')
    };
    return this._httpCallbackHandlerService.handle(httpCall, serviceActions);
  }

  /**
   * Creates the http request.
   */
  private _createRequest(url : string, httpMethod : string, body? : string, headers? : Headers) {
      let options = { headers: this.createHeaders(headers) };
      let http = this._authTokenService.isAccessTokenExpired() ? this._http : this._authHttp;

      if(HttpConstants.HTTP_METHOD_DELETE === httpMethod) {
        return http.delete(url, options);
      } else if(HttpConstants.HTTP_METHOD_GET === httpMethod) {
        return http.get(url, options);
      } else if(HttpConstants.HTTP_METHOD_PATCH === httpMethod) {
        return http.patch(url, body, options);
      } else if(HttpConstants.HTTP_METHOD_POST === httpMethod) {
        return http.post(url, body, options);
      } else if(HttpConstants.HTTP_METHOD_PUT === httpMethod) {
        return http.put(url, body, options);
      } else {
          throw new Error(`Unsupported HttpMethod : ${httpMethod}.`);
      }
  }
}
