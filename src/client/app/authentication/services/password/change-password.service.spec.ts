import { ServiceMockingUtils } from '../../../../testing/index';
import { ChangePasswordService, ChangePasswordForm, ChangePasswordRequest, SigninService } from '../../index';
import { AuthTokenService, LoggerService, HttpRestService, EmptySuccessServerResponse, IApiResult } from '../../../shared/index';

export function main() {

    describe('ChangePassword Service', () => {

        class MockedAuthTokenService extends AuthTokenService { }
        class MockedHttpRestService extends HttpRestService { }
        class MockedSigninService extends SigninService { }

        let mockedLoggerService: LoggerService;
        let mockedAuthTokenService: AuthTokenService;
        let mockedHttpRestService: HttpRestService;
        let mockedSigninService: MockedSigninService;
        let serviceUnderTest: ChangePasswordService;

        let expectedResponse : IApiResult<EmptySuccessServerResponse>;

        beforeEach(() => {
            expectedResponse = ServiceMockingUtils.createMockedServiceResponse();
            mockedLoggerService = ServiceMockingUtils.createMockedLoggerService();
            mockedAuthTokenService = new MockedAuthTokenService(null, mockedLoggerService);
            mockedHttpRestService = new MockedHttpRestService(null, null, null, null, null, null);
            mockedSigninService = new MockedSigninService(null, null, null, null, null);
            serviceUnderTest = new ChangePasswordService(mockedHttpRestService, mockedAuthTokenService, mockedSigninService);
        });


        it('should change the password', () => {
                let username = 'aUsername';
                let actualUrl : string;
                let actualPayload : ChangePasswordRequest;

                spyOn(mockedAuthTokenService, 'currentUsername').and.returnValue(username);
                spyOn(mockedHttpRestService, 'httpPost').and.callFake((url : string, payload: ChangePasswordRequest) => {
                    actualPayload = payload;
                    actualUrl = url;
                    return expectedResponse;
                });

                spyOn(mockedSigninService, 'login').and.returnValue(ServiceMockingUtils.createMockedServiceResponse());

                let previousPassword = 'anOldPassword';
                let newPassword = 'aNewPassword';
                let changePasswordForm = new ChangePasswordForm();
                changePasswordForm.newPassword = newPassword;
                changePasswordForm.previousPassword = previousPassword;

                let result = serviceUnderTest.changePassword(changePasswordForm);
                expect(result).toBe(expectedResponse);
                expect(actualPayload.newPassword).toBe(newPassword);
                expect(actualPayload.oldPassword).toBe(previousPassword);
                expect(actualUrl.endsWith('/password/update')).toBeTruthy();
                expect(mockedSigninService.login).toHaveBeenCalled();
            });
    });
}
