import { ServiceMockingUtils } from '../../../../testing/index';
import { ProfileLiteService } from '../../index';
import { HttpRestService, ProfileLite, IApiResult, EventService } from '../../../shared/index';

export function main() {

    describe('ProfileLite Service', () => {

        class MockedHttpRestService extends HttpRestService { }

        let mockedHttpRestService: HttpRestService;
        let mockedEventService: EventService;
        let serviceUnderTest: ProfileLiteService;

        let expectedResponse : IApiResult<ProfileLite>;

        beforeEach(() => {
            expectedResponse = ServiceMockingUtils.createMockedServiceResponse();
            mockedHttpRestService = new MockedHttpRestService(null, null, null, null, null, null);
            mockedEventService = new EventService();
            serviceUnderTest = new ProfileLiteService(mockedHttpRestService, mockedEventService);
        });


        it('should get the profile lite', () => {
                let actualUrl : string;
                let actualPayload : ProfileLite;

                spyOn(mockedHttpRestService, 'httpGet').and.callFake((url : string) => {
                    actualUrl = url;
                    return expectedResponse;
                });

                let result = serviceUnderTest.getProfileLite();
                let profileLite : ProfileLite;
                result.subscribe(response => profileLite = response);
                expect(result).toBe(expectedResponse);
                expect(profileLite).toBe(actualPayload);
                expect(actualUrl.endsWith('/lite')).toBeTruthy();
            });
    });
}
