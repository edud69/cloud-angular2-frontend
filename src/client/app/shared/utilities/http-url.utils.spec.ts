import { HttpUrlUtils } from './http-url.utils';

export function main() {

  describe('HttpUrlUtils', () => {

    it('should retrieve the url parameter with 1 param', () => {
        let expectedValue = 'a-given-value-28129a=a8392';
        let paramName = 'paramToFind';
        let url = `http://www.domain.com/?${paramName}=${expectedValue}`;
        HttpUrlUtils['_getCurrentBrowserUrl'] = () => url;
        expect(HttpUrlUtils.getUrlParameterByName(paramName)).toBe(expectedValue);
    });


    it('should retrieve the url parameter with 1 param and special characters', () => {
        let expectedValue = 'a(jsBVa@&#4&2309342&asasd*0m';
        let encodedParamValue = 'a%28jsBVa%40%26%234%262309342%26asasd*0m';
        let paramName = 'paramToFind';
        let url = `http://www.domain.com/?${paramName}=${encodedParamValue}`;
        HttpUrlUtils['_getCurrentBrowserUrl'] = () => url;
        expect(HttpUrlUtils.getUrlParameterByName(paramName)).toBe(expectedValue);
    });

    it('should retrieve the url parameter with multiple parameters', () => {
        let expectedValue = 'a-given-value-28129a=a8392';
        let paramName = 'paramToFind';
        let url = `http://www.domain.com/?param1=89312dsn&${paramName}=${expectedValue}&param3=masdf983182`;
        HttpUrlUtils['_getCurrentBrowserUrl'] = () => url;
        expect(HttpUrlUtils.getUrlParameterByName(paramName)).toBe(expectedValue);
    });

    it('should not retrieve the url parameter', () => {
        let expectedValue = 'a-given-value-28129a=a8392';
        let aUrlParam = 'paramInUrl';
        let paramName = 'paramToFind';
        let url = `http://www.domain.com/?${aUrlParam}=${expectedValue}`;
        HttpUrlUtils['_getCurrentBrowserUrl'] = () => url;
        expect(HttpUrlUtils.getUrlParameterByName(paramName)).toBeNull();
    });

  });
}
