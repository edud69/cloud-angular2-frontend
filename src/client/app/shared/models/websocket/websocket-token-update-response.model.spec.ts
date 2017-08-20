import { BaseModelTestUtils } from '../../../../testing/index';

import { WebsocketTokenUpdateResponseMsg } from './websocket-token-update-response.model';

export function main() {

  describe('WebsocketTokenUpdateResponseMsg Model', () => {

    beforeEach(() => BaseModelTestUtils.injectMatchers());

    it('should match the tokenUpdateTime', () => {
        let expectedValue = new Date();
        let modelUnderTest = new WebsocketTokenUpdateResponseMsg(expectedValue);
        expect(modelUnderTest.tokenUpdateTime).toBe(expectedValue);
    });

    it('should be registered in the BaseModel registry', () => {
        BaseModelTestUtils.wrapExpect({bindingClassName: 'TokenUpdateResponseMsg',
                targetClass: WebsocketTokenUpdateResponseMsg}).toBeRegistered();
    });
  });
}
