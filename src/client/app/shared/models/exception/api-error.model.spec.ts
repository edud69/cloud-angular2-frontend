import { BaseModelTestUtils } from '../../../../testing/index';

import { RandomUtils } from '../../index';
import { ApiError } from './api-error.model';

export function main() {

  describe('ApiError Model', () => {

    beforeEach(() => BaseModelTestUtils.injectMatchers());

    it('should match the code', () => {
        let expectedValue = RandomUtils.randomString(10);
        let modelUnderTest = new ApiError(expectedValue, null, null);
        expect(modelUnderTest.code).toBe(expectedValue);
    });

    it('should match the message', () => {
        let expectedValue = RandomUtils.randomString(10);
        let modelUnderTest = new ApiError(null, expectedValue, null);
        expect(modelUnderTest.message).toBe(expectedValue);
    });

    it('should match the params', () => {
        let expectedValue = { aParamKey: RandomUtils.randomString(10) };
        let modelUnderTest = new ApiError(null, null, expectedValue);
        expect(modelUnderTest.errorParams).toBe(expectedValue);
    });

    it('should be registered in the BaseModel registry', () => {
        BaseModelTestUtils.wrapExpect({bindingClassName: 'ApiError', targetClass: ApiError}).toBeRegistered();
    });
  });
}
