import { Response, ResponseOptions } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { JwtHelper } from 'angular2-jwt';
import { ServiceMockingUtils } from '../../../../testing/index';
import { AuthTokenService, JwtConstants, OAuth2Token } from '../../index';

export function main() {

    describe('AuthToken Service', () => {

        let mockedLoggerService: any;
        let mockedHttp: any;
        let serviceUnderTest: AuthTokenService;

        beforeEach(() => {
            spyOn(JwtHelper.prototype, 'decodeToken').and.returnValue('');
            mockedLoggerService = ServiceMockingUtils.createMockedLoggerService();
            mockedHttp = {
                post: (url: any, body: any, options: any) => {
                    return Observable.create((observer: any) => {
                        observer.next(new Response(new ResponseOptions(
                            { body: '{"access_token":"anAccessToken", "refresh_token": "aRefreshToken"}' })));
                        observer.complete();
                    });
                }
            };
            serviceUnderTest = new AuthTokenService(mockedHttp, mockedLoggerService);
        });


        it('should refresh the tokens', () => {
            serviceUnderTest.clearTokens();
            let oldRefreshToken = 'oldRefreshToken';
            (<any>serviceUnderTest)['_http'] = mockedHttp;
            initializeForPropertyGetTest(serviceUnderTest, oldRefreshToken, 'aTenant', JwtConstants.JWT_TOKEN_PROPERTY_TID, true);
            localStorage.setItem(JwtConstants.JWT_STORE_REFRESHTOKEN_KEY, oldRefreshToken);
            serviceUnderTest.refreshAccessToken();
            expect(sessionStorage.getItem(JwtConstants.JWT_STORE_ACCESSTOKEN_KEY)).toBe('anAccessToken');
        });

        it('should not refresh the tokens when no refresh token', () => {
            // case where no refresh token
            let refreshToken: any = null;
            localStorage.setItem(JwtConstants.JWT_STORE_REFRESHTOKEN_KEY, refreshToken);
            spyOn(mockedLoggerService, 'debug');
            serviceUnderTest.refreshAccessToken();
            expect(mockedLoggerService.debug).toHaveBeenCalledWith('No refresh token found.');
        });

        it('should not cause collison between subscribers and should unsubscribe all (Token clear)', () => {
            let subs: any[] = [];
            for (let i = 0; i < 100; i++) {
                let subFct = () => {/*nothing*/ };
                subs.push(serviceUnderTest.subscribeToTokenClearEvent(subFct));
            }

            expect(subs.length).toBe(Object.getOwnPropertyNames(serviceUnderTest['_tokenClearedSubscribers']).length);
            subs.forEach(sub => sub.unsubscribe());
            expect(Object.getOwnPropertyNames(serviceUnderTest['_tokenClearedSubscribers']).length).toBe(0);
        });

        it('should not cause collison between subscribers and should unsubscribe all (Token Refresh)', () => {
            let subs: any[] = [];
            for (let i = 0; i < 100; i++) {
                let subFct = (token: any) => {/*nothing*/ };
                subs.push(serviceUnderTest.subscribeToTokenRefreshEvent(subFct));
            }

            expect(subs.length).toBe(Object.getOwnPropertyNames(serviceUnderTest['_tokenRefreshEventSubscribers']).length);
            subs.forEach(sub => sub.unsubscribe());
            expect(Object.getOwnPropertyNames(serviceUnderTest['_tokenRefreshEventSubscribers']).length).toBe(0);
        });

        it('should notify token clear subscribers on clear', () => {
            let notified = false;
            let subFct = () => notified = true;
            spyOn(sessionStorage, 'removeItem');
            spyOn(localStorage, 'removeItem');
            serviceUnderTest.subscribeToTokenClearEvent(subFct);
            serviceUnderTest.clearTokens();
            expect(notified).toBeTruthy();
            expect(sessionStorage.removeItem).toHaveBeenCalledWith(JwtConstants.JWT_STORE_ACCESSTOKEN_KEY);
            expect(localStorage.removeItem).toHaveBeenCalledWith(JwtConstants.JWT_STORE_REFRESHTOKEN_KEY);
        });


        it('should notify token update subscribers on update', () => {
            let anAccessToken = 'accessToken';
            let aRefreshToken = 'aRefreshToken';
            let oauth2Token = new OAuth2Token(anAccessToken, aRefreshToken);
            let notified = false;
            let subFct = (token: string) => notified = true;
            spyOn(sessionStorage, 'setItem');
            spyOn(localStorage, 'setItem');
            serviceUnderTest.subscribeToTokenRefreshEvent(subFct);
            serviceUnderTest.updateToken(oauth2Token);
            expect(notified).toBeTruthy();
            expect(sessionStorage.setItem).toHaveBeenCalledWith(JwtConstants.JWT_STORE_ACCESSTOKEN_KEY, oauth2Token.accessToken);
            expect(localStorage.setItem).toHaveBeenCalledWith(JwtConstants.JWT_STORE_REFRESHTOKEN_KEY, oauth2Token.refreshToken);
        });

        it('should get the access token expiration time', () => {
            let anAccessToken = 'access-token';
            let anExpirationTime = new Date();
            let propKey = JwtConstants.JWT_TOKEN_PROPERTY_EXP;
            let propValue = anExpirationTime.getTime() / 1000;
            initializeForPropertyGetTest(serviceUnderTest, anAccessToken, propValue, propKey, false);
            let result = serviceUnderTest.getAccessTokenExpirationTime();
            expect(result.getTime()).toBe(anExpirationTime.getTime());
        });


        it('should get the access token authorities', () => {
            let anAccessToken = 'access-token';
            let authorities = ['ROLE_ONE', 'PERM_1', 'PERM_2'];
            let propKey = JwtConstants.JWT_TOKEN_PROPERTY_AUT;
            let propValue = authorities;
            initializeForPropertyGetTest(serviceUnderTest, anAccessToken, propValue, propKey, false);
            expect(serviceUnderTest.getAuthorities()).toBe(authorities);
        });

        it('should get the access token tenant', () => {
            let anAccessToken = 'access-token';
            let aTenant = 'aTenant';
            let propKey = JwtConstants.JWT_TOKEN_PROPERTY_TID;
            let propValue = aTenant;
            initializeForPropertyGetTest(serviceUnderTest, anAccessToken, propValue, propKey, false);
            expect(serviceUnderTest.currentTenant()).toBe(aTenant);
        });

        it('should get the access token username', () => {
            let anAccessToken = 'access-token';
            let aUsername = 'ausername';
            let propKey = JwtConstants.JWT_TOKEN_PROPERTY_USERNAME;
            let propValue = aUsername;
            initializeForPropertyGetTest(serviceUnderTest, anAccessToken, propValue, propKey, false);
            expect(serviceUnderTest.currentUsername()).toBe(aUsername);
        });


        it('should get the access token user id', () => {
            let anAccessToken = 'access-token';
            let aUserId = 1234;
            let propKey = JwtConstants.JWT_TOKEN_PROPERTY_UID;
            let propValue = aUserId;
            initializeForPropertyGetTest(serviceUnderTest, anAccessToken, propValue, propKey, false);
            expect(serviceUnderTest.currentUserId()).toBe(aUserId);
        });

        function initializeForPropertyGetTest(serviceUnderTest: any, tokenValue: string, propValue: any,
            propKey: any, isRefreshToken: boolean) {
            (<any>serviceUnderTest)._jwtHelper.decodeToken = (token: string) => {
                if (token === tokenValue) {
                    let obj: any = {};
                    obj[propKey] = propValue;
                    return obj;
                }

                fail('should not come here. Token: ' + token);
                return null;
            };

            if (isRefreshToken) {
                localStorage.setItem(JwtConstants.JWT_STORE_REFRESHTOKEN_KEY, tokenValue);
            } else {
                sessionStorage.setItem(JwtConstants.JWT_STORE_ACCESSTOKEN_KEY, tokenValue);
            }
        }

        it('should get access token from sessionStore', () => {
            let expectedToken = 'access-token-value';
            sessionStorage.setItem(JwtConstants.JWT_STORE_ACCESSTOKEN_KEY, expectedToken);
            let actualToken = serviceUnderTest.getAccessToken();
            expect(actualToken).toBe(expectedToken);
        });

        it('should get refresh token from localStore', () => {
            let expectedToken = 'refresh-token-value';
            localStorage.setItem(JwtConstants.JWT_STORE_REFRESHTOKEN_KEY, expectedToken);
            let actualToken = serviceUnderTest.getRefreshToken();
            expect(actualToken).toBe(expectedToken);
        });

        it('should return the access token expiration', () => {
            let aNotExpiredToken = 'not-expired-token';
            let anExpiredToken = 'an-expired-token';
            let anEmptyToken: string = null;

            (<any>serviceUnderTest)._jwtHelper.isTokenExpired = (token: string) => {
                if (token === aNotExpiredToken) {
                    return false;
                } else if (token === anExpiredToken) {
                    return true;
                } else {
                    fail('should never come here');
                    return true;
                }
            };

            sessionStorage.setItem(JwtConstants.JWT_STORE_ACCESSTOKEN_KEY, aNotExpiredToken);
            expect(serviceUnderTest.isAccessTokenExpired()).toBeFalsy();
            sessionStorage.setItem(JwtConstants.JWT_STORE_ACCESSTOKEN_KEY, anExpiredToken);
            expect(serviceUnderTest.isAccessTokenExpired()).toBeTruthy();
            sessionStorage.setItem(JwtConstants.JWT_STORE_ACCESSTOKEN_KEY, anEmptyToken);
            expect(serviceUnderTest.isAccessTokenExpired()).toBeTruthy();
        });

        it('should return the refresh token expiration', () => {
            let aNotExpiredToken = 'not-expired-token';
            let anExpiredToken = 'an-expired-token';
            let anEmptyToken: string = null;

            (<any>serviceUnderTest)._jwtHelper.isTokenExpired = (token: string) => {
                if (token === aNotExpiredToken) {
                    return false;
                } else if (token === anExpiredToken) {
                    return true;
                } else {
                    fail('should never come here, token: ' + token);
                    return true;
                }
            };

            localStorage.setItem(JwtConstants.JWT_STORE_REFRESHTOKEN_KEY, aNotExpiredToken);
            expect(serviceUnderTest.isRefreshTokenExpired()).toBeFalsy();
            localStorage.setItem(JwtConstants.JWT_STORE_REFRESHTOKEN_KEY, anExpiredToken);
            expect(serviceUnderTest.isRefreshTokenExpired()).toBeTruthy();
            localStorage.setItem(JwtConstants.JWT_STORE_REFRESHTOKEN_KEY, anEmptyToken);
            expect(serviceUnderTest.isRefreshTokenExpired()).toBeTruthy();
        });
    });
}
