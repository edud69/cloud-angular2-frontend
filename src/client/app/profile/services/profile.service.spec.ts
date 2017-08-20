import { ServiceMockingUtils } from '../../../testing/index';
import { ProfileService, ProfileForm, Profile } from '../index';
import { HttpRestService, IApiResult, AuthTokenService, EventService } from '../../shared/index';

export function main() {

    describe('Profile Service', () => {

        class MockedHttpRestService extends HttpRestService { }

        let mockedAuthTokenService: AuthTokenService;
        let mockedHttpRestService: HttpRestService;
        let mockedEventService: EventService;
        let serviceUnderTest: ProfileService;

        let expectedResponse : IApiResult<Profile>;

        beforeEach(() => {
            expectedResponse = ServiceMockingUtils.createMockedServiceResponse();
            let mockedLogger = ServiceMockingUtils.createMockedLoggerService();
            mockedAuthTokenService = new AuthTokenService(null, mockedLogger);
            mockedHttpRestService = new MockedHttpRestService(null, null, null, null, null, null);
            mockedEventService = new EventService();
            serviceUnderTest = new ProfileService(mockedHttpRestService, mockedAuthTokenService, mockedEventService);
        });


        it('should get the profile', () => {
                let aUserId = 123;
                let actualUrl : string;

                spyOn(mockedAuthTokenService, 'currentUserId').and.returnValue(aUserId);

                spyOn(mockedHttpRestService, 'httpGet').and.callFake((url : string) => {
                    actualUrl = url;
                    return expectedResponse;
                });

                let result = serviceUnderTest.getProfile();
                expect(result).toBe(expectedResponse);
                expect(actualUrl.endsWith('/123')).toBeTruthy();
            });

        it('should update the profile', () => {
                let aUserId = 123;
                let aFirstName = 'aFirstName';
                let aLastName = 'aLastName';
                let actualUrl : string;
                let actualPayload : Profile;

                spyOn(mockedAuthTokenService, 'currentUserId').and.returnValue(aUserId);

                spyOn(mockedHttpRestService, 'httpPut').and.callFake((url : string, payload: Profile) => {
                    actualPayload = payload;
                    actualUrl = url;
                    return expectedResponse;
                });

                (<any>serviceUnderTest)['_addProfileUpdatedInterceptor'] = () => {/*nothing*/};

                let form = new ProfileForm(null, null, null, null, null);
                form.firstName = aFirstName;
                form.lastName = aLastName;

                let result = serviceUnderTest.updateProfile(form);
                expect(result).toBe(expectedResponse);
                expect(actualPayload.firstName).toBe(aFirstName);
                expect(actualPayload.lastName).toBe(aLastName);
                expect(actualPayload.userId).toBe(aUserId);
                expect(actualUrl.endsWith('/123')).toBeTruthy();
            });

        it('should create the profile', () => {
                let aUserId = 123;
                let actualUrl : string;
                let actualPayload : Profile;

                spyOn(mockedAuthTokenService, 'currentUserId').and.returnValue(aUserId);

                spyOn(mockedHttpRestService, 'httpPost').and.callFake((url : string, payload: Profile) => {
                    actualPayload = payload;
                    actualUrl = url;
                    return expectedResponse;
                });

                let result = serviceUnderTest.createProfile();
                expect(result).toBe(expectedResponse);
                expect(actualPayload.userId).toBe(aUserId);
                expect(actualUrl.endsWith('/')).toBeTruthy();
            });
    });
}
