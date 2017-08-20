import { BaseModelTestUtils } from '../../../../../testing/index';

import { RandomUtils } from '../../../index';
import { ParticipantLeaveEvent } from './participant-leave-event.model';

export function main() {

  describe('ParticipantLeaveEvent Model', () => {

    beforeEach(() => BaseModelTestUtils.injectMatchers());

    it('should match the participantName', () => {
        let expectedValue = RandomUtils.randomString(10);
        let modelUnderTest = new ParticipantLeaveEvent(expectedValue, null, null);
        expect(modelUnderTest.participantName).toEqual(expectedValue);
    });

    it('should match the channelName', () => {
        let expectedValue = RandomUtils.randomString(10);
        let modelUnderTest = new ParticipantLeaveEvent(null, expectedValue, null);
        expect(modelUnderTest.channelName).toEqual(expectedValue);
    });

    it('should match the leaveTime', () => {
        let expectedValue = new Date();
        let modelUnderTest = new ParticipantLeaveEvent(null, null, expectedValue);
        expect(modelUnderTest.leaveTime).toEqual(expectedValue);
    });

    it('should be registered in the BaseModel registry', () => {
        BaseModelTestUtils.wrapExpect({bindingClassName: 'ParticipantLeaveEventMsg', targetClass: ParticipantLeaveEvent}).toBeRegistered();
    });
  });
}
