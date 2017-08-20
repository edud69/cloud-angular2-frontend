import { UnmappedServerResponse } from './unmapped-server-response.model';

export function main() {

  describe('UnmappedServerResponse Model', () => {

    it('should match the internalResponse', () => {
        let expectedValue = {anything: {anythingElse: 'aValue', anythingElseFieldTwo: ['aValue2']}};
        let modelUnderTest = new UnmappedServerResponse(expectedValue);
        expect(modelUnderTest.internalResponse).toBe(expectedValue);
    });

  });
}
