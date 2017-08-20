import { ServiceMockingUtils } from '../../../../testing/index';
import { SignupConfirmation, SignupConfirmationService } from '../../index';
import { LoggerService, HttpRestService, EmptySuccessServerResponse, IApiResult, HttpUrlUtils,
         TenantResolverService, ApiError } from '../../../shared/index';

export function main() {

    describe('SignupConfirmation Service', () => {

        class MockedHttpRestService extends HttpRestService { }

        let mockedLoggerService: LoggerService;
        let mockedHttpRestService: HttpRestService;
        let mockedTenantResolverService: TenantResolverService;
        let serviceUnderTest: SignupConfirmationService;

        let expectedResponse : IApiResult<EmptySuccessServerResponse>;
        let expectedNestedResponse : EmptySuccessServerResponse;

        beforeEach(() => {
            expectedNestedResponse = new EmptySuccessServerResponse();
            expectedResponse = ServiceMockingUtils.createMockedServiceResponse(expectedNestedResponse);
            mockedLoggerService = ServiceMockingUtils.createMockedLoggerService();
            mockedTenantResolverService = new TenantResolverService();
            mockedHttpRestService = new MockedHttpRestService(null, null, null, null, null, null);
            serviceUnderTest = new SignupConfirmationService(mockedLoggerService, mockedTenantResolverService, mockedHttpRestService);
        });

        it('should return an error when token or email is not found from browser url', () => {
            spyOn(HttpUrlUtils, 'getUrlParameterByName').and.callFake((param : string) => {
                return '';
            });

            let result = serviceUnderTest.confirmSignup();
            let actualError : ApiError;
            result.subscribe(response => {/*nothing*/}, error => actualError = error);
            expect(actualError).toBeDefined();
        });

        it('should load signup confirm token from browser url', () => {
                let email = 'someone@somedomain.com';
                let token = '12sd897sdikjas82';
                let actualPayload : SignupConfirmation;
                let actualUrl : string;

                spyOn(HttpUrlUtils, 'getUrlParameterByName').and.callFake((param : string) => {
                    if(param === 'email') {
                        return email;
                    } else if(param === 'token') {
                        return token;
                    }
                    return null;
                });


                spyOn(mockedHttpRestService, 'httpPost').and.callFake((url : string, payload: SignupConfirmation) => {
                    actualPayload = payload;
                    actualUrl = url;
                    return expectedResponse;
                });

                let result = serviceUnderTest.confirmSignup();
                expect(result).toBeDefined();
                let actualResponse : any;
                result.subscribe(response => actualResponse = response);
                expect(actualResponse).toBe(expectedNestedResponse);
            });
    });
}
