import { FormValidationError } from './validation-error.form';

export function main() {

  describe('ValidationError Form', () => {

    let classUnderTest : FormValidationError;
    let expectedErrorCode : string;
    let expectedMessage : string;
    let expectedParams : { [key:string] : any };

    beforeEach(() => {
        expectedErrorCode = 'anErrorCode';
        expectedMessage = 'a message';
        expectedParams = {};
        expectedParams['param1'] = 123456789;
        classUnderTest = new FormValidationError(expectedErrorCode, expectedMessage, expectedParams);
    });

    it('should match the errorCode', () => {
        expect(classUnderTest.errorCode).toBe(expectedErrorCode);
    });

    it('should match the message', () => {
        expect(classUnderTest.message).toBe(expectedMessage);
    });

    it('should match the error params', () => {
        expect(classUnderTest.errorParams).toBe(expectedParams);
    });
  });
}
