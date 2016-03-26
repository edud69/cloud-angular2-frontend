import {LoginService} from './login.service';

export function main() {
  describe('Login Service', () => {
    let loginService: LoginService;

    beforeEach(() => {
      loginService = new LoginService;
    });

    it('should return the list of names', () => {
      let names = loginService.get();
      expect(names).toEqual(jasmine.any(Array));
    });
  });
}
