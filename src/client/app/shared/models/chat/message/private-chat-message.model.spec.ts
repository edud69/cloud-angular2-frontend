import { BaseModelTestUtils } from '../../../../../testing/index';

import { PrivateChatMessage } from './private-chat-message.model';

export function main() {
  describe('PrivateChatMessage Model', () => {

    beforeEach(() => BaseModelTestUtils.injectMatchers());

    it('should match the targetUsername', () => {
        let targetUsername = 'a-target-username';
        let privateChatMessage = new PrivateChatMessage(null, null, targetUsername);
        expect(privateChatMessage.targetUsername).toEqual(targetUsername);
    });

    it('should be registered in the BaseModel registry', () => {
        BaseModelTestUtils.wrapExpect({bindingClassName: 'ChatPrivateMsg', targetClass: PrivateChatMessage}).toBeRegistered();
    });
  });
}
