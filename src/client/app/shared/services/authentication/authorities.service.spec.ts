import { AuthoritiesService, PermissionConstants } from '../../index';

export function main() {

  describe('Authorities Service', () => {

        class MockedAuthTokenService {}

        let mockedAuthService : any = new MockedAuthTokenService();
        let heldPermOne = PermissionConstants.ACCOUNT_READ;
        let heldPermTwo = PermissionConstants.INDEX_ALL;
        let notHeldPermOne = PermissionConstants.CHAT_SEND;
        let serviceUnderTest : AuthoritiesService;

        beforeEach(() => {
            serviceUnderTest = new AuthoritiesService(mockedAuthService);

            mockedAuthService['getAuthorities'] = () => {
                let heldAuthorities : string[] = [];
                heldAuthorities.push(heldPermOne.name);
                heldAuthorities.push(heldPermTwo.name);
                return heldAuthorities;
            };

            mockedAuthService['isAccessTokenExpired'] = () => false;
        });

      it('should tell if you have the given permission', () => {
          expect(serviceUnderTest.hasPermission(heldPermOne)).toBeTruthy();
          expect(serviceUnderTest.hasPermission(heldPermTwo)).toBeTruthy();
          expect(serviceUnderTest.hasPermission(notHeldPermOne)).toBeFalsy();
      });

      it('should tell if you have at least one of the given permissions', () => {
          expect(serviceUnderTest.hasAnyPermission([heldPermOne, heldPermTwo])).toBeTruthy();
          expect(serviceUnderTest.hasAnyPermission([heldPermOne, heldPermTwo, notHeldPermOne])).toBeTruthy();
          expect(serviceUnderTest.hasAnyPermission([notHeldPermOne])).toBeFalsy();
      });

      it('should tell if you have all of the given permissions', () => {
          expect(serviceUnderTest.hasAllPermissions([heldPermOne, heldPermTwo])).toBeTruthy();
          expect(serviceUnderTest.hasAllPermissions([heldPermOne, heldPermTwo, notHeldPermOne])).toBeFalsy();
          expect(serviceUnderTest.hasAllPermissions([heldPermOne, notHeldPermOne])).toBeFalsy();
      });

      it('should return no access to permissions when token is expired', () => {
          mockedAuthService['isAccessTokenExpired'] = () => true;
          expect(serviceUnderTest.hasPermission(heldPermOne)).toBeFalsy();
          expect(serviceUnderTest.hasPermission(heldPermTwo)).toBeFalsy();
          expect(serviceUnderTest.hasAnyPermission([heldPermOne, heldPermTwo])).toBeFalsy();
          expect(serviceUnderTest.hasAllPermissions([heldPermOne, heldPermTwo])).toBeFalsy();
      });

  });
}
