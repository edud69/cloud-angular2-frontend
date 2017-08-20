import { ServiceMockingUtils } from '../../../../testing/index';
import { SigninService, SigninForm } from '../../index';
import { AuthTokenService, LoggerService, HttpCallbackHandlerService, EmptySuccessServerResponse,
         TenantResolverService, IApiResult, JwtConstants, HttpUrlUtils, OAuth2Token } from '../../../shared/index';

export function main() {

    describe('Signin Service', () => {

        class MockedAuthTokenService extends AuthTokenService { }
        class MockedHttpCallbackHandlerService extends HttpCallbackHandlerService { }

        let mockedLoggerService: LoggerService;
        let mockedAuthTokenService: AuthTokenService;
        let mockedTenantResolverService: TenantResolverService;
        let mockedHttpCallbackHandlerService: HttpCallbackHandlerService;
        let serviceUnderTest: SigninService;
        let mockedHttp: any;

        let expectedResponse: IApiResult<EmptySuccessServerResponse>;

        beforeEach(() => {
            expectedResponse = ServiceMockingUtils.createMockedServiceResponse();
            mockedHttp = {};
            mockedLoggerService = ServiceMockingUtils.createMockedLoggerService();
            mockedAuthTokenService = new MockedAuthTokenService(null, mockedLoggerService);
            mockedTenantResolverService = new TenantResolverService();
            mockedHttpCallbackHandlerService = new MockedHttpCallbackHandlerService();
            serviceUnderTest = new SigninService(mockedHttp, mockedAuthTokenService, mockedLoggerService,
                mockedTenantResolverService, mockedHttpCallbackHandlerService);
        });


        it('should get social provider links', () => {
            let socialProviderLinks = serviceUnderTest.socialProviderLinks;
            expect(socialProviderLinks).toBeDefined();
            expect(socialProviderLinks.facebook.endsWith('/signin/facebook')).toBeTruthy();
            expect(socialProviderLinks.google.endsWith('/signin/google')).toBeTruthy();
        });


        it('should handle the social login callback', () => {
            let refreshToken = 'aRefreshToken';
            spyOn(HttpUrlUtils, 'getUrlParameterByName').and.callFake((input: string) => {
                if (input === JwtConstants.JWT_REFRESH_URL_PARAM) {
                    return refreshToken;
                }
                return null;
            });

            spyOn(mockedAuthTokenService, 'updateToken');
            spyOn(mockedAuthTokenService, 'refreshAccessToken');

            serviceUnderTest.checkForSocialSignIn();

            expect(mockedAuthTokenService.updateToken).toHaveBeenCalledWith(new OAuth2Token(null, refreshToken));
            expect(mockedAuthTokenService.refreshAccessToken).toHaveBeenCalled();
        });

        it('should login', () => {
            let accessToken = 'anAccessToken';
            let refreshToken = 'aRefreshToken';

            let username = 'someone@somedomain.com';
            let password = 'aPassword';
            let form = new SigninForm();
            form.username = username;
            form.password = password;

            mockedHttp.post = (url : string, body : any, options : any) : any => {
                return null;
            };

            spyOn(mockedHttpCallbackHandlerService, 'handle').and.callFake((httpCall: any, serviceActions : any) => {
                let token = serviceActions.onSuccess(new OAuth2Token(accessToken, refreshToken));
                serviceActions.onCompletion();
                return ServiceMockingUtils.createMockedServiceResponse(token);
            });

            spyOn(mockedAuthTokenService, 'updateToken');
            spyOn(mockedHttp, 'post');

            let result = serviceUnderTest.login(form);
            expect(result).toBeDefined();
            let responseReceived = false;
            result.subscribe(response => {
                responseReceived = true;
                expect(response.accessToken).toBe(accessToken);
                expect(response.refreshToken).toBe(refreshToken);
            });

            expect(responseReceived).toBeTruthy();
            expect(mockedAuthTokenService.updateToken).toHaveBeenCalled();
            expect(mockedHttp.post).toHaveBeenCalled();
        });
    });
}
