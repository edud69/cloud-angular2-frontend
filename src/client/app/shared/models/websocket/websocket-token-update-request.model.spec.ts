import { BaseModelTestUtils } from '../../../../testing/index';

import { WebsocketTokenUpdateRequestMsg } from './websocket-token-update-request.model';

export function main() {

  describe('WebsocketTokenUpdateRequestMsg Model', () => {

    beforeEach(() => BaseModelTestUtils.injectMatchers());

    it('should match the newTokenValue', () => {
        let expectedValue = 'a-token-value';
        let modelUnderTest = new WebsocketTokenUpdateRequestMsg(expectedValue);
        expect(modelUnderTest.newTokenValue).toBe(expectedValue);
    });

    it('should be registered in the BaseModel registry', () => {
        BaseModelTestUtils.wrapExpect({bindingClassName: 'TokenUpdateRequestMsg',
                targetClass: WebsocketTokenUpdateRequestMsg}).toBeRegistered();
    });
  });
}
