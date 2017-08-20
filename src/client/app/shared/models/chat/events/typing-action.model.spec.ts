import { BaseModelTestUtils } from '../../../../../testing/index';

import { RandomUtils } from '../../../index';
import { TypingAction } from './typing-action.model';

export function main() {

  describe('ParticipantLeaveEvent Model', () => {

    beforeEach(() => BaseModelTestUtils.injectMatchers());

    it('should match the author', () => {
        let expectedValue = RandomUtils.randomString(10);
        let modelUnderTest = new TypingAction(expectedValue, null, null);
        expect(modelUnderTest.author).toEqual(expectedValue);
    });

    it('should match the channelName', () => {
        let expectedValue = RandomUtils.randomString(10);
        let modelUnderTest = new TypingAction(null, expectedValue, null);
        expect(modelUnderTest.channelName).toEqual(expectedValue);
    });

    it('should match the targetUsername', () => {
        let expectedValue = RandomUtils.randomString(10);
        let modelUnderTest = new TypingAction(null, null, expectedValue);
        expect(modelUnderTest.targetUsername).toEqual(expectedValue);
    });

    it('should generate an actionTime date', () => {
        let expectedValue = new Date();
        let modelUnderTest = new TypingAction(null, null, null);
        expect(modelUnderTest.actionTime.getTime() >= expectedValue.getTime() &&
               modelUnderTest.actionTime.getTime() <= new Date().getTime()).toBeTruthy();
    });

    it('should be registered in the BaseModel registry', () => {
        BaseModelTestUtils.wrapExpect({bindingClassName: 'TypingActionMsg', targetClass: TypingAction}).toBeRegistered();
    });
  });
}
