import { Observable } from 'rxjs/Observable';
import { Observer } from 'rxjs/Observer';

import { HttpCallbackHandlerService, IServiceActions, BaseModel, ApiError, ErrorCodeConstants,
    HttpConstants, EmptySuccessServerResponse, UnmappedServerResponse, OAuth2Token } from '../../index';

export function main() {

    describe('HttpCallbackHandler Service', () => {

        let completedInternal = false;
        let completedToClient = false;
        let callCompleteFct: (() => void);
        let callErrorFct: ((err: any) => void);
        let callResponseFct: ((response: any) => void);
        let serviceActions: IServiceActions<BaseModel>;
        let observable: Observable<any>;
        let responseInterceptorCalled = false;
        let errorInterceptorCalled = false;
        let serviceUnderTest: HttpCallbackHandlerService;

        beforeEach(() => {
            serviceUnderTest = new HttpCallbackHandlerService();

            serviceActions = {
                onSuccess: model => {responseInterceptorCalled = true; return model;},
                onError: (error, statusCode) => {errorInterceptorCalled = true; return error;},
                onCompletion: () => completedInternal = true
            };

            observable = Observable.create((observer: Observer<any>) => {
                callErrorFct = err => observer.error(err);
                callResponseFct = response => observer.next(response);
                callCompleteFct = () => observer.complete();
            });
        });

        it('should dispatch the completion', () => {
                serviceUnderTest.handle(observable, serviceActions).subscribe(
                    model => {/*nothing*/ },
                    error => {/*nothing*/ },
                    () => completedToClient = true
                );

                callCompleteFct();

                expect(completedInternal).toBeTruthy();
                expect(completedToClient).toBeTruthy();
            });

        it('should dispatch the error when failing to convert and complete', () => {
                let clientError: ApiError;
                serviceUnderTest.handle(observable, serviceActions).subscribe(
                    model => {/*nothing*/ },
                    error => clientError = error,
                    () => completedToClient = true
                );

                callErrorFct('an error');
                callCompleteFct();

                expect(completedInternal).toBeTruthy();
                expect(completedToClient).toBeTruthy();
                expect(clientError.code).toBe(ErrorCodeConstants.ERROR_CODE_UNKNOWN);
                expect(clientError.message).toBe('an error');
            });


        it('should dispatch the error when bad credentials and when failing to convert and complete', () => {
                let clientError: ApiError;
                serviceUnderTest.handle(observable, serviceActions).subscribe(
                    model => {/*nothing*/ },
                    error => clientError = error,
                    () => completedToClient = true
                );

                callErrorFct({ status: HttpConstants.HTTP_STATUSCODE_UNAUTHORIZED, body: 'an error' });
                callCompleteFct();

                expect(completedInternal).toBeTruthy();
                expect(completedToClient).toBeTruthy();
                expect(errorInterceptorCalled).toBeTruthy();
                expect(clientError.code).toBe(ErrorCodeConstants.ERROR_CODE_BAD_CREDENTIALS);
                expect(clientError.message).toBe('Bad credentials.');
            });


        it('should dispatch the error when receiving an ApiError from backend and complete', () => {
                let clientError: ApiError;
                serviceUnderTest.handle(observable, serviceActions).subscribe(
                    model => {/*nothing*/ },
                    error => clientError = error,
                    () => completedToClient = true
                );

                let err = new ApiError('0x0002', 'some error message');
                (<any>err)['$bindingClassName'] = 'ApiError';

                let httpError = {json: () => err };
                callErrorFct(httpError);
                callCompleteFct();

                expect(completedInternal).toBeTruthy();
                expect(completedToClient).toBeTruthy();
                expect(errorInterceptorCalled).toBeTruthy();
                expect(clientError.code).toBe('0x0002');
                expect(clientError.message).toBe('some error message');
            });


        it('should dispatch the response when empty body and complete', () => {
                let interceptedResponse : any;

                serviceUnderTest.handle(observable, serviceActions).subscribe(
                    model => interceptedResponse = model,
                    error => {/*nothing*/},
                    () => completedToClient = true
                );

                callResponseFct({ _body: '' });
                callCompleteFct();

                expect(completedInternal).toBeTruthy();
                expect(completedToClient).toBeTruthy();
                expect(responseInterceptorCalled).toBeTruthy();
                expect(interceptedResponse).toEqual(new EmptySuccessServerResponse());
            });


        it('should dispatch the response when binding not found and complete', () => {
                let interceptedResponse : any;

                serviceUnderTest.handle(observable, serviceActions).subscribe(
                    model => interceptedResponse = model,
                    error => {/*nothing*/},
                    () => completedToClient = true
                );

                callResponseFct('some object');
                callCompleteFct();

                expect(completedInternal).toBeTruthy();
                expect(completedToClient).toBeTruthy();
                expect(responseInterceptorCalled).toBeTruthy();
                expect(interceptedResponse).toEqual(new UnmappedServerResponse('some object'));
            });


        it('should dispatch the response when binding found and complete', () => {
                let interceptedResponse : any;

                serviceUnderTest.handle(observable, serviceActions).subscribe(
                    model => interceptedResponse = model,
                    error => {/*nothing*/},
                    () => completedToClient = true
                );

                let response = new OAuth2Token('anAccessToken', 'aRefreshToken');
                (<any>response)['$bindingClassName'] = 'OAuth2TokenMessage';

                let httpResponse = {json: () => response };

                callResponseFct(httpResponse);
                callCompleteFct();

                expect(completedInternal).toBeTruthy();
                expect(completedToClient).toBeTruthy();
                expect(responseInterceptorCalled).toBeTruthy();
                expect(interceptedResponse.accessToken).toBe(response.accessToken);
                expect(interceptedResponse.refreshToken).toBe(response.refreshToken);
            });

    });
}
