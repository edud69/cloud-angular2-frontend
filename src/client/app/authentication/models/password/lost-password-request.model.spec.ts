import { LostPasswordRequest } from '../../index';

export function main() {

  describe('LostPasswordRequest Model', () => {

    it('should match the username', () => {
        let expected = 'username';
        let modelUnderTest = new LostPasswordRequest(expected);
        expect(modelUnderTest.username).toEqual(expected);
    });
  });
}
