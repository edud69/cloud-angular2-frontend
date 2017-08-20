import { RandomUtils } from './random.utils';

export function main() {

  describe('RandomUtils', () => {

    it('should generate random strings of a given length', () => {
        for(let i = 1; i <= 20; i++) {
            let generated = RandomUtils.randomString(i);
            expect(generated.length).toBe(i);
        }
    });


    it('should generate random unique strings', () => {
        let numberOfComparisons = 1000;
        let stringSize = 8;
        let stringCache : {[key : string] : any} = {};

        for(let i = 1; i <= numberOfComparisons; i++) {
            let generated = RandomUtils.randomString(stringSize);
            expect(stringCache[generated]).toBeUndefined();
            stringCache[generated] = {};
        }
    });

  });
}
