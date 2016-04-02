import {SignupConfirmationService} from './signup-confirmation.service';

export function main() {
  describe('Signup Confirmation Service', () => {
    let signupConfirmationService: SignupConfirmationService;

    beforeEach(() => {
      signupConfirmationService = new SignupConfirmationService(null);
    });

    it('should test something', () => {
      expect(signupConfirmationService).not.toBeNull();
      expect(jasmine.any(Array)).toEqual(jasmine.any(Array));
    });
  });
}
