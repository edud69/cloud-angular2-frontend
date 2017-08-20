import { ServiceMockingUtils } from '../../../../testing/index';
import { LostPasswordService, LostPasswordForm, LostPasswordRequest,
         RestorePasswordForm, RestorePasswordRequest } from '../../index';
import { LoggerService, HttpRestService, EmptySuccessServerResponse, IApiResult, HttpUrlUtils } from '../../../shared/index';

export function main() {

    describe('LostPassword Service', () => {

        class MockedHttpRestService extends HttpRestService { }

        let mockedLoggerService: LoggerService;
        let mockedHttpRestService: HttpRestService;
        let serviceUnderTest: LostPasswordService;

        let expectedResponse : IApiResult<EmptySuccessServerResponse>;

        beforeEach(() => {
            expectedResponse = ServiceMockingUtils.createMockedServiceResponse();
            mockedLoggerService = ServiceMockingUtils.createMockedLoggerService();
            mockedHttpRestService = new MockedHttpRestService(null, null, null, null, null, null);
            serviceUnderTest = new LostPasswordService(mockedHttpRestService, mockedLoggerService);
        });


        it('should load lost password token from browser url', () => {
                let email = 'someone@somedomain.com';
                let token = '12sd897sdikjas82';

                spyOn(HttpUrlUtils, 'getUrlParameterByName').and.callFake((param : string) => {
                    if(param === 'email') {
                        return email;
                    } else if(param === 'token') {
                        return token;
                    }
                    return null;
                });

                let result = serviceUnderTest.loadLostPasswordToken();
                expect(result).toBeDefined();
                expect(result.email).toBe(email);
                expect(result.token).toBe(token);
            });

        it('should send lost password http request', () => {
                let actualUrl : string;
                let actualPayload : LostPasswordRequest;

                spyOn(mockedHttpRestService, 'httpPost').and.callFake((url : string, payload: LostPasswordRequest) => {
                    actualPayload = payload;
                    actualUrl = url;
                    return expectedResponse;
                });

                let username = 'aUsername';
                let form = new LostPasswordForm();
                form.username = username;

                let result = serviceUnderTest.buildAndSendLostPasswordRequest(form);
                expect(result).toBe(expectedResponse);
                expect(actualPayload.username).toBe(username);
                expect(actualUrl.endsWith('/password/lost')).toBeTruthy();
            });

        it('should send lost password http request', () => {
                let actualUrl : string;
                let actualPayload : RestorePasswordRequest;

                spyOn(mockedHttpRestService, 'httpPost').and.callFake((url : string, payload: RestorePasswordRequest) => {
                    actualPayload = payload;
                    actualUrl = url;
                    return expectedResponse;
                });

                let username = 'aUsername';
                let token = 'token';
                let newPassword = 'aNewPassword';
                let form = new RestorePasswordForm(username, token);
                form.newPassword = newPassword;

                let result = serviceUnderTest.restorePassword(form);
                expect(result).toBe(expectedResponse);
                expect(actualPayload.username).toBe(username);
                expect(actualPayload.lostPasswordToken).toBe(token);
                expect(actualPayload.newPassword).toBe(newPassword);
                expect(actualUrl.endsWith('/password/restore')).toBeTruthy();
            });
    });
}
