import { BaseModelTestUtils } from '../../../../testing/index';

import { RandomUtils } from '../../index';
import { FileUploadResult } from './file-upload-result.model';

export function main() {

  describe('FileUploadResult Model', () => {

    beforeEach(() => BaseModelTestUtils.injectMatchers());

    it('should match the uploadedDestination', () => {
        let expectedValue = RandomUtils.randomString(10);
        let modelUnderTest = new FileUploadResult(expectedValue);
        expect(modelUnderTest.uploadedDestination).toEqual(expectedValue);
    });

    it('should be registered in the BaseModel registry', () => {
        BaseModelTestUtils.wrapExpect({bindingClassName: 'FileUploadResultMessage', targetClass: FileUploadResult}).toBeRegistered();
    });
  });
}
