import { BaseModelTestUtils } from '../../../../../testing/index';

import { RandomUtils } from '../../../index';
import { ParticipantJoinEvent } from './participant-join-event.model';

export function main() {

  describe('ParticipantJoinEvent Model', () => {

    beforeEach(() => BaseModelTestUtils.injectMatchers());

    it('should match the participantName', () => {
        let expectedValue = RandomUtils.randomString(10);
        let modelUnderTest = new ParticipantJoinEvent(expectedValue, null, null);
        expect(modelUnderTest.participantName).toEqual(expectedValue);
    });

    it('should match the channelName', () => {
        let expectedValue = RandomUtils.randomString(10);
        let modelUnderTest = new ParticipantJoinEvent(null, expectedValue, null);
        expect(modelUnderTest.channelName).toEqual(expectedValue);
    });

    it('should match the joinTime', () => {
        let expectedValue = new Date();
        let modelUnderTest = new ParticipantJoinEvent(null, null, expectedValue);
        expect(modelUnderTest.joinTime).toEqual(expectedValue);
    });

    it('should be registered in the BaseModel registry', () => {
        BaseModelTestUtils.wrapExpect({bindingClassName: 'ParticipantJoinEventMsg', targetClass: ParticipantJoinEvent}).toBeRegistered();
    });
  });
}
