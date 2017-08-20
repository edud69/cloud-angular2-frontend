import { AuthStateService, AuthenticationState } from '../../index';

export function main() {

  describe('AuthState Service', () => {

        class MockedSubscription {
            private _subscribed = true;

            constructor (private _subscribeFor : string) {}

            public unsubscribe() {
                this._subscribed = false;
            }
        }

        let tokenClearSub = new MockedSubscription('tokenClear');
        let tokenRefreshSub = new MockedSubscription('tokenRefresh');

        class MockedAuthTokenService {
            public isAccessTokenExpired() {
                return false;
            }

            public subscribeToTokenClearEvent(arg : any) {
                return tokenClearSub;
            }

            public subscribeToTokenRefreshEvent(arg : any) {
                return tokenRefreshSub;
            }
        }
        class MockedLoggerService {
            public debug() {/* do nothing */}
            public log() {/* do nothing */}
        }

        let serviceUnderTest : AuthStateService;

        beforeEach(() => {
            let mockedAuthService : any = new MockedAuthTokenService();
            let mockedLoggerService : any = new MockedLoggerService();
            serviceUnderTest = new AuthStateService(mockedAuthService, mockedLoggerService);
        });

      it('should contruct correctly', () => {
          expect(serviceUnderTest.currentUserAuthenticationState).toBe(AuthenticationState.Authenticated);
          expect(serviceUnderTest['_subscriptions']).toBeDefined();
          expect(serviceUnderTest['_subscriptions'].length).toBe(2);
          expect(serviceUnderTest['_subscriptions'][0]).toBe(tokenClearSub);
          expect(serviceUnderTest['_subscriptions'][1]).toBe(tokenRefreshSub);
      });

      it('should unsubscribe when destroyed', () => {
          let tokenClearSub : any = serviceUnderTest['_subscriptions'][0];
          let tokenRefreshSub : any = serviceUnderTest['_subscriptions'][1];
          expect(tokenClearSub['_subscribed']).toBeTruthy();
          expect(tokenRefreshSub['_subscribed']).toBeTruthy();
          serviceUnderTest.ngOnDestroy();
          expect(tokenClearSub['_subscribed']).toBeFalsy();
          expect(tokenRefreshSub['_subscribed']).toBeFalsy();
      });

      it('should manage in/out subscriptions', () => {
          //subscribe
          let subOneState = AuthenticationState.Anonymous;
          let subTwoState = AuthenticationState.Anonymous;
          let subscriberOne = (authState : AuthenticationState) => subOneState = authState;
          let subscriberTwo = (authState : AuthenticationState) => subTwoState = authState;
          expect((<any>serviceUnderTest)._getSubscribersCount()).toBe(0);
          let subscriptionOne = serviceUnderTest.subscribe(subscriberOne);
          expect((<any>serviceUnderTest)._getSubscribersCount()).toBe(1);
          let subscriptionTwo = serviceUnderTest.subscribe(subscriberTwo);
          expect((<any>serviceUnderTest)._getSubscribersCount()).toBe(2);

          // notify for token refresh
          serviceUnderTest['_currentUserAuthState'] = AuthenticationState.Anonymous;
          serviceUnderTest['_updateStateAndNotifySubscribers'](AuthenticationState.Authenticated);
          expect(serviceUnderTest.currentUserAuthenticationState).toBe(AuthenticationState.Authenticated);
          expect(subOneState).toBe(AuthenticationState.Authenticated);
          expect(subTwoState).toBe(AuthenticationState.Authenticated);

          serviceUnderTest['_currentUserAuthState'] = AuthenticationState.Authenticated;
          serviceUnderTest['_updateStateAndNotifySubscribers'](AuthenticationState.Anonymous);
          expect(serviceUnderTest.currentUserAuthenticationState).toBe(AuthenticationState.Anonymous);
          expect(subOneState).toBe(AuthenticationState.Anonymous);
          expect(subTwoState).toBe(AuthenticationState.Anonymous);

          // unsubscribe
          subscriptionOne.unsubscribe();
          expect((<any>serviceUnderTest)._getSubscribersCount()).toBe(1);
          subscriptionTwo.unsubscribe();
          expect((<any>serviceUnderTest)._getSubscribersCount()).toBe(0);
      });

  });
}
