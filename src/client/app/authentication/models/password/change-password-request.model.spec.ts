import { ChangePasswordRequest } from '../../index';

export function main() {

  describe('ChangePasswordRequest Model', () => {

    it('should match the oldPassword', () => {
        let expected = 'oldPassword';
        let modelUnderTest = new ChangePasswordRequest(null, expected, null);
        expect(modelUnderTest.oldPassword).toEqual(expected);
    });
  });
}
