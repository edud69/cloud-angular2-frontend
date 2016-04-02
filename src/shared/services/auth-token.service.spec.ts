import {AuthTokenService} from './auth-token.service';

export function main() {
  describe('AuthTokenService Service', () => {
    let authTokenService: AuthTokenService;

    beforeEach(() => {
      authTokenService = new AuthTokenService;
    });

    it('should test something', () => {
      expect(authTokenService).not.toBeNull();
    });
  });
}
