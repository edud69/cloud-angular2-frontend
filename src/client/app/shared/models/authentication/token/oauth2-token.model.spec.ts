import { BaseModelTestUtils } from '../../../../../testing/index';
import { OAuth2Token } from './oauth2-token.model';

export function main() {

  describe('OAuth2Token Model', () => {

    beforeEach(() => BaseModelTestUtils.injectMatchers());

    it('should match the access_token', () => {
        let expectedAccessToken = 'an-access-token-value';
        let oauth2Token = new OAuth2Token(expectedAccessToken, null);
        expect(oauth2Token.accessToken).toEqual(expectedAccessToken);
    });

    it('should match the refresh_token', () => {
        let expectedRefreshToken = 'a-refresh-token-value';
        let oauth2Token = new OAuth2Token(null, expectedRefreshToken);
        expect(oauth2Token.refreshToken).toEqual(expectedRefreshToken);
    });

    it('should be registered in the BaseModel registry', () => {
        BaseModelTestUtils.wrapExpect({bindingClassName: 'OAuth2TokenMessage', targetClass: OAuth2Token}).toBeRegistered();
    });
  });
}
