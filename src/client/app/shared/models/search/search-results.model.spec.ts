import { BaseModelTestUtils } from '../../../../testing/index';

import { BaseModel } from '../../index';
import { SearchResults } from './search-results.model';

export function main() {

  describe('SearchResults Model', () => {

    let searchResults : BaseModel[];

    class SearchResultTest extends BaseModel {}

    beforeEach(() => {
        BaseModelTestUtils.injectMatchers();
        searchResults = [];
        searchResults.push(new SearchResultTest());
        searchResults.push(new SearchResultTest());
    });

    it('should match the results', () => {
        let expectedValue = searchResults;
        let modelUnderTest = new SearchResults(expectedValue, null, null);
        expect(modelUnderTest.results).toBe(expectedValue);
    });

    it('should match the resultsCount', () => {
        let expectedValue = searchResults;
        let modelUnderTest = new SearchResults(expectedValue, null, null);
        expect(modelUnderTest.resultsCount).toBe(2);

        modelUnderTest = new SearchResults(null, null, null);
        expect(modelUnderTest.resultsCount).toBe(0);
    });

    it('should match the totalResultsCount', () => {
        let expectedValue = 123456;
        let modelUnderTest = new SearchResults(null, expectedValue, null);
        expect(modelUnderTest.totalResultsCount).toBe(expectedValue);
    });

    it('should match the queryExecutionTimeInMillis', () => {
        let expectedValue = new Date().getTime();
        let modelUnderTest = new SearchResults(null, null, expectedValue);
        expect(modelUnderTest.queryExecutionTimeInMillis).toBe(expectedValue);
    });

    it('should be registered in the BaseModel registry', () => {
        BaseModelTestUtils.wrapExpect({bindingClassName: 'SearchResultsMessage', targetClass: SearchResults}).toBeRegistered();
    });
  });
}
