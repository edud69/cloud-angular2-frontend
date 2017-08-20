import { ServiceMockingUtils } from '../../../../testing/index';
import { SignupService, SignupForm, SignupRequest } from '../../index';
import { HttpRestService, EmptySuccessServerResponse, IApiResult, TenantResolverService } from '../../../shared/index';

export function main() {

    describe('Signup Service', () => {

        class MockedHttpRestService extends HttpRestService { }

        let mockedTenantResolverService: TenantResolverService;
        let mockedHttpRestService: HttpRestService;
        let serviceUnderTest: SignupService;

        let expectedResponse : IApiResult<EmptySuccessServerResponse>;

        beforeEach(() => {
            expectedResponse = ServiceMockingUtils.createMockedServiceResponse();
            mockedTenantResolverService = new TenantResolverService();
            mockedHttpRestService = new MockedHttpRestService(null, null, null, null, null, null);
            serviceUnderTest = new SignupService(mockedHttpRestService, mockedTenantResolverService);
        });


        it('should signup', () => {
                let aTenant = 'aTenant';
                let aUsername = 'username';
                let aPassword = 'aPassword';
                let actualUrl : string;
                let actualPayload : SignupRequest;

                spyOn(mockedTenantResolverService, 'resolveCurrentTenant').and.callFake(() => aTenant);

                spyOn(mockedHttpRestService, 'httpPost').and.callFake((url : string, payload: SignupRequest) => {
                    actualPayload = payload;
                    actualUrl = url;
                    return expectedResponse;
                });

                let form = new SignupForm();
                form.username = aUsername;
                form.password = aPassword;

                let result = serviceUnderTest.signup(form);
                expect(result).toBe(expectedResponse);
                expect(actualPayload.email).toBe(aUsername);
                expect(actualPayload.password).toBe(aPassword);
                expect(actualUrl.endsWith('/user/subscription')).toBeTruthy();
            });
    });
}
