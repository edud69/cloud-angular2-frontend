import {SigninService} from './signin.service';

export function main() {
  describe('Signin Service', () => {
    let signinService: SigninService;

    beforeEach(() => {
      signinService = new SigninService;
    });

    it('should test something', () => {
      expect(signinService).not.toBeNull();
      expect(jasmine.any(Array)).toEqual(jasmine.any(Array));
    });
  });
}
