import { BaseModelTestUtils } from '../../../../../testing/index';

import { GroupChatMessage } from './group-chat-message.model';

export function main() {
  describe('GroupChatMessage Model', () => {

    beforeEach(() => BaseModelTestUtils.injectMatchers());

    it('should match the channelName', () => {
        let channelName = 'a-channel-name';
        let groupChatMessage = new GroupChatMessage(null, null, channelName);
        expect(groupChatMessage.channelName).toEqual(channelName);
    });

    it('should be registered in the BaseModel registry', () => {
        BaseModelTestUtils.wrapExpect({bindingClassName: 'ChatGroupMsg', targetClass: GroupChatMessage}).toBeRegistered();
    });
  });
}
