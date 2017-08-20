import { SignupRequest } from '../../index';

export function main() {

  describe('SignupRequest Model', () => {

    it('should match the email', () => {
        let expected = 'anEmail';
        let modelUnderTest = new SignupRequest(expected, null, null);
        expect(modelUnderTest.email).toEqual(expected);
    });

    it('should match the tenantId', () => {
        let expected = 'aTenantId';
        let modelUnderTest = new SignupRequest(null, null, expected);
        expect(modelUnderTest.tenantId).toEqual(expected);
    });

    it('should match the password', () => {
        let expected = 'password';
        let modelUnderTest = new SignupRequest(null, expected, null);
        expect(modelUnderTest.password).toEqual(expected);
    });

  });
}
