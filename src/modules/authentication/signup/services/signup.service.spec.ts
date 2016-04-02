import {SignupService} from './signup.service';

export function main() {
  describe('Signup Service', () => {
    let signupService: SignupService;

    beforeEach(() => {
      signupService = new SignupService;
    });

    it('should test something', () => {
      expect(signupService).not.toBeNull();
      expect(jasmine.any(Array)).toEqual(jasmine.any(Array));
    });
  });
}
