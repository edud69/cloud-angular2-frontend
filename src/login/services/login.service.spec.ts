import {LoginService} from './login.service';

export function main() {
  describe('Login Service', () => {
    let loginService: LoginService;

    beforeEach(() => {
      loginService = new LoginService;
    });

    it('should test something', () => {
      expect(loginService).not.toBeNull();
      expect(jasmine.any(Array)).toEqual(jasmine.any(Array));
    });
  });
}
