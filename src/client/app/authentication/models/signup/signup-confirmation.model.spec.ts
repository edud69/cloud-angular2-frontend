import { SignupConfirmation } from '../../index';

export function main() {

  describe('SignupConfirmation Model', () => {

    it('should match the email', () => {
        let expectedEmail = 'anEmail';
        let modelUnderTest = new SignupConfirmation(expectedEmail, null, null);
        expect(modelUnderTest.email).toEqual(expectedEmail);
    });

    it('should match the tenantId', () => {
        let expected = 'aTenantId';
        let modelUnderTest = new SignupConfirmation(null, null, expected);
        expect(modelUnderTest.tenantId).toEqual(expected);
    });

    it('should match the confirmationToken', () => {
        let expected = 'aToken';
        let modelUnderTest = new SignupConfirmation(null, expected, null);
        expect(modelUnderTest.confirmationToken).toEqual(expected);
    });

  });
}
