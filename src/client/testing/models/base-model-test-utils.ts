import { JsonModelConverter } from '../../app/shared/models/json-model-converter';

export namespace BaseModelTestUtils {

    export let wrapExpect : (obj : any) => BaseModelMatchers = (object : any) => {
                        return <BaseModelMatchers>expect(object);
                    };

    export interface BaseModelMatchers extends jasmine.Matchers<any> {
        toBeRegistered() : void;
    }

    let baseModelMatchers : jasmine.CustomMatcherFactories = {

        toBeRegistered: () => ({
            compare: (input : any) => {
                let result : any = {};
                let entry = JsonModelConverter['_ModelTypesMap'][input.bindingClassName];
                if(entry) {
                    let areSame = input.bindingClassName === entry.bindingClassName &&
                                  input.targetClass === entry.targetClass;
                    result.pass = areSame;
                } else {
                    result.pass = false;
                }

                if (result.pass) {
                    result.message = `Expected ${input.bindingClassName} to be ` +
                                     `registered as ${input.targetClass}`;
                } else {
                    result.message = `Expected ${input.bindingClassName} to be ` +
                                     `registered as ${input.targetClass}, but it was not`;
                }

                return result;
            }
        })
    };

    export function injectMatchers() {
        jasmine.addMatchers(baseModelMatchers);
    }
}
