import { Headers } from '@angular/http';

import { ServiceMockingUtils } from '../../../../testing/index';

import { HttpRestService, LoggerService, AuthTokenService, IServiceActions, BaseModel, IApiResult, ApiError,
         EmptySuccessServerResponse, HttpConstants } from '../../index';

export function main() {

    describe('HttpRest Service', () => {

        let mockedLoggerService: LoggerService;
        let mockedCallbackHandlerService: any;
        let mockedTenantResolverService: any;
        let mockedInjector: any;
        let mockedHttp: any;
        let mockedAuthHttp: any;
        let mockedAuthTokenService: any;

        let completed = false;
        let receivedResponse: any;
        let receivedError: any;
        let isAccessTokenExpired = false;
        let tenantHeaderValue: string = 'tenantId';
        let buildApiResult: (serviceActions: IServiceActions<ResponseModel>) => IApiResult<ResponseModel>;
        let returnError = false;
        let errorToBeReturned: any;
        let responseToBeReturned: any;
        let serviceUnderTest: HttpRestService;

        class ResponseModel extends BaseModel { }
        class RequestModel extends BaseModel {
            public someField : string = 'someValue';
        }

        function generateFakeHttp(): any {
            return {
                get: (url: any, options: any) => {/*nothing*/ },
                delete: (url: any, options: any) => {/*nothing*/ },
                patch: (url: any, body: any, options: any) => {/*nothing*/ },
                post: (url: any, body: any, options: any) => {/*nothing*/ },
                put: (url: any, body: any, options: any) => {/*nothing*/ }
            };
        }

        beforeEach(() => {
            mockedLoggerService = ServiceMockingUtils.createMockedLoggerService();
            mockedInjector = { get: (input: any) => input === AuthTokenService ? mockedAuthTokenService : null };
            mockedHttp = generateFakeHttp();
            mockedTenantResolverService = { resolveCurrentTenant: () => tenantHeaderValue };
            mockedAuthHttp = generateFakeHttp();
            mockedAuthTokenService = { isAccessTokenExpired: () => isAccessTokenExpired };
            mockedCallbackHandlerService = {
                handle: (httpCall: any, serviceActions: IServiceActions<BaseModel>) => buildApiResult(serviceActions)
            };

            serviceUnderTest = new HttpRestService(mockedAuthHttp, mockedHttp,
                mockedLoggerService, mockedTenantResolverService, mockedInjector, mockedCallbackHandlerService);

            buildApiResult = serviceActions => {
                let result: IApiResult<ResponseModel> = {
                    subscribe: (response: ((value: ResponseModel) => void),
                        error: (error: ApiError) => void,
                        complete: () => void) => {

                        if (returnError) {
                            error(errorToBeReturned);
                        } else {
                            response(responseToBeReturned);
                        }

                        complete();
                        return { unsubscribe: () => {/*nothing*/ } };
                    }
                };
                return result;
            };
        });

        it('should send http get', () => {
                returnError = false;
                responseToBeReturned = new ResponseModel();
                isAccessTokenExpired = true;

                spyOn(mockedHttp, 'get');

                serviceUnderTest.httpGet('http://domain.com/user/1').subscribe(
                    response => receivedResponse = response,
                    error => receivedError = error,
                    () => completed = true
                );

                expect(receivedResponse).toBe(responseToBeReturned);
                expect(completed).toBeTruthy();
                expect(mockedHttp.get).toHaveBeenCalledWith('http://domain.com/user/1', jasmine.anything());
            });

        it('should send http delete', () => {
                returnError = false;
                responseToBeReturned = new EmptySuccessServerResponse();
                isAccessTokenExpired = false;

                spyOn(mockedAuthHttp, 'delete');

                serviceUnderTest.httpDelete('http://domain.com/user/1').subscribe(
                    response => receivedResponse = response,
                    error => receivedError = error,
                    () => completed = true
                );

                expect(receivedResponse).toBe(responseToBeReturned);
                expect(completed).toBeTruthy();
                expect(mockedAuthHttp.delete).toHaveBeenCalledWith('http://domain.com/user/1', jasmine.anything());
            });


        it('should send http patch', () => {
                returnError = false;
                responseToBeReturned = new EmptySuccessServerResponse();
                isAccessTokenExpired = false;

                spyOn(mockedAuthHttp, 'patch');

                let requestBody = new RequestModel();
                let requestBodyAsJson = requestBody.toJsonString();
                serviceUnderTest.httpPatch('http://domain.com/user', requestBody).subscribe(
                    response => receivedResponse = response,
                    error => receivedError = error,
                    () => completed = true
                );

                expect(receivedResponse).toBe(responseToBeReturned);
                expect(completed).toBeTruthy();
                expect(mockedAuthHttp.patch).toHaveBeenCalledWith('http://domain.com/user',
                    requestBodyAsJson, jasmine.anything());
            });


        it('should send http post', () => {
                returnError = false;
                responseToBeReturned = new EmptySuccessServerResponse();
                isAccessTokenExpired = false;

                spyOn(mockedAuthHttp, 'post');

                let requestBody = new RequestModel();
                let requestBodyAsJson = requestBody.toJsonString();
                serviceUnderTest.httpPost('http://domain.com/user', requestBody).subscribe(
                    response => receivedResponse = response,
                    error => receivedError = error,
                    () => completed = true
                );

                expect(receivedResponse).toBe(responseToBeReturned);
                expect(completed).toBeTruthy();
                expect(mockedAuthHttp.post).toHaveBeenCalledWith('http://domain.com/user',
                    requestBodyAsJson, jasmine.anything());
            });

        it('should send http post and get an api error', () => {
                returnError = true;
                errorToBeReturned = new ApiError('0x0002', 'User not logged...');
                isAccessTokenExpired = true;

                spyOn(mockedHttp, 'post');

                let requestBody = new RequestModel();
                let requestBodyAsJson = requestBody.toJsonString();
                serviceUnderTest.httpPost('http://domain.com/user', requestBody).subscribe(
                    response => receivedResponse = response,
                    error => receivedError = error,
                    () => completed = true
                );

                expect(receivedError).toBe(errorToBeReturned);
                expect(completed).toBeTruthy();
                expect(mockedHttp.post).toHaveBeenCalledWith('http://domain.com/user',
                    requestBodyAsJson, jasmine.anything());
            });


        it('should send the appropriate headers', () => {
                returnError = false;
                responseToBeReturned = new ResponseModel();
                isAccessTokenExpired = true;

                let additionalHeaders : Headers = new Headers();
                additionalHeaders.append('aHeaderKey1', 'aHeaderValue1');
                additionalHeaders.append('aHeaderKey2', 'aHeaderValue2');
                additionalHeaders.append(HttpConstants.HTTP_HEADER_CONTENT_TYPE, 'custom-content');

                let actualHeaders : Headers;

                spyOn(mockedHttp, 'get').and.callFake((url: any, options: any) => {
                    actualHeaders = options.headers;
                    return {/*nothing*/};
                });

                serviceUnderTest.httpGet('http://domain.com/user/1', additionalHeaders).subscribe(
                    response => receivedResponse = response,
                    error => receivedError = error,
                    () => completed = true
                );

                expect(actualHeaders.get('aHeaderKey1')).toBe(additionalHeaders.get('aHeaderKey1'));
                expect(actualHeaders.get('aHeaderKey2')).toBe(additionalHeaders.get('aHeaderKey2'));
                expect(actualHeaders.get(HttpConstants.HTTP_HEADER_TENANTID)).toBe(tenantHeaderValue);
                expect(actualHeaders.get(HttpConstants.HTTP_HEADER_ACCEPT)).toBe(HttpConstants.HTTP_HEADER_VALUE_APPLICATIONJSON);
                expect(actualHeaders.get(HttpConstants.HTTP_HEADER_CONTENT_TYPE)).toBe('custom-content');
                expect(receivedResponse).toBe(responseToBeReturned);
                expect(completed).toBeTruthy();
                expect(mockedHttp.get).toHaveBeenCalledWith('http://domain.com/user/1', jasmine.anything());
            });
    });
}
