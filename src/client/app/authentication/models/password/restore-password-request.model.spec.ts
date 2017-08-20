import { RestorePasswordRequest } from '../../index';

export function main() {

  describe('RestorePasswordRequest Model', () => {

    it('should match the lostPasswordToken', () => {
        let expected = 'lostPasswordToken';
        let modelUnderTest = new RestorePasswordRequest(null, expected, null);
        expect(modelUnderTest.lostPasswordToken).toEqual(expected);
    });
  });
}
