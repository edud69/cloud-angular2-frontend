import { ServiceMockingUtils } from '../../../../testing/index';

import { AuthTokenRefreshMonitorService, JwtConstants, AuthTokenService, LoggerService } from '../../index';

export function main() {

  describe('AuthTokenRefreshMonitor Service', () => {

        class MockedAuthTokenService extends AuthTokenService {}
        class MockedLoggerService {}
        class MockedSubscription {}

        let mockedAuthService : AuthTokenService;
        let mockedLoggerService : LoggerService;

        let tokenRefreshSub : MockedSubscription;
        let tokenClearSub : MockedSubscription;
        let serviceUnderTest : AuthTokenRefreshMonitorService;

        let jwt_refresh_check_interval = JwtConstants.JWT_REFRESH_CHECK_INTERVAL_IN_SECONDS;

        beforeEach(() => {
            mockedAuthService = new MockedAuthTokenService(null, ServiceMockingUtils.createMockedLoggerService());
            mockedLoggerService = ServiceMockingUtils.createMockedLoggerService();

            (<any>mockedAuthService)['subscribeToTokenRefreshEvent'] = (sub : any) => {
                tokenRefreshSub = new MockedSubscription();
                return tokenRefreshSub;
            };

            (<any>mockedAuthService)['subscribeToTokenClearEvent'] = (sub : any) => {
                tokenClearSub = new MockedSubscription();
                return tokenClearSub;
            };

            mockedLoggerService.log = (msg : any, arg : any) => {/*nothing*/};
            mockedLoggerService.debug = (msg : any, arg : any) => {/*nothing*/};

            serviceUnderTest = new AuthTokenRefreshMonitorService(mockedAuthService, mockedLoggerService);
        });

        afterEach(() => {
            //restore values
            JwtConstants.JWT_REFRESH_CHECK_INTERVAL_IN_SECONDS = jwt_refresh_check_interval;
        });

      it('should subscribe at construction', () => {
                expect(tokenRefreshSub).toBeDefined();
                expect(tokenClearSub).toBeDefined();
      });

      it('should unsubscribe on destroy', () => {
                    let tokenRefreshUnsubCalled = false;
                    let tokenClearUnsubCalled = false;

                    (<any>tokenRefreshSub)['unsubscribe'] = () => tokenRefreshUnsubCalled = true;
                    (<any>tokenClearSub)['unsubscribe'] = () => tokenClearUnsubCalled = true;

                    serviceUnderTest.ngOnDestroy();

                    expect(tokenRefreshUnsubCalled).toBeTruthy();
                    expect(tokenClearUnsubCalled).toBeTruthy();
      });

      it('should stop monitoring when refresh token is expired', () => {
          mockedAuthService.isRefreshTokenExpired = () => true;
          let called = false;
          (<any>serviceUnderTest)['_stopMonitoring'] = () => called = true;
          JwtConstants.JWT_REFRESH_CHECK_INTERVAL_IN_SECONDS = 0.001; // will speed the loop to 1ms
          serviceUnderTest.startMonitoring();
          expect(called).toBeTruthy();
      });

      it('should refresh when access token is not present', () => {
          mockedAuthService.isRefreshTokenExpired = () => false;
          mockedAuthService.getAccessTokenExpirationTime = () : any => { return null; };
          mockedAuthService.refreshAccessToken = () => {/*nothing*/};
          spyOn(mockedAuthService, 'refreshAccessToken');
          JwtConstants.JWT_REFRESH_CHECK_INTERVAL_IN_SECONDS = 0.001; // will speed the loop to 1ms
          serviceUnderTest.startMonitoring();
          expect((<any>mockedAuthService).refreshAccessToken).toHaveBeenCalled();
      });

      it('should refresh when access token is about to expire or is expired', () => {
          mockedAuthService.isRefreshTokenExpired = () => false;
          mockedAuthService.getAccessTokenExpirationTime = () : any => { return new Date(1); };
          mockedAuthService.refreshAccessToken = () => {/*nothing*/};
          spyOn(mockedAuthService, 'refreshAccessToken');
          JwtConstants.JWT_REFRESH_CHECK_INTERVAL_IN_SECONDS = 0.001; // will speed the loop to 1ms
          serviceUnderTest.startMonitoring();
          expect((<any>mockedAuthService).refreshAccessToken).toHaveBeenCalled();
      });
  });
}
