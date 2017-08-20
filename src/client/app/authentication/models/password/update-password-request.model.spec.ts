import { UpdatePasswordRequest } from '../../index';

export function main() {

  describe('UpdatePasswordRequest Model', () => {

    class TestableUpdatePasswordRequest extends UpdatePasswordRequest {}

    it('should match the username', () => {
        let expected = 'username';
        let modelUnderTest = new TestableUpdatePasswordRequest(expected, null, null);
        expect(modelUnderTest.username).toEqual(expected);
    });

    it('should match the newPassword', () => {
        let expected = 'aNewPassword';
        let modelUnderTest = new TestableUpdatePasswordRequest(null, expected, null);
        expect(modelUnderTest.newPassword).toEqual(expected);
    });

  });
}
