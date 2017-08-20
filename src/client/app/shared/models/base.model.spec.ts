import { BaseModel } from './base.model';

import { JsonModelConverter, IBaseModel } from '../index';

export function main() {

  describe('BaseModel Model', () => {

    class BaseModelNestedTest extends BaseModel {
        constructor(public aNestedSerializableField : any) {
            super();
        }
    }

    class BaseModelTest extends BaseModel {
        public anotherFieldThatShouldSerialize : BaseModel = new BaseModelNestedTest({aField: 'aValue'});

        private $_hiddenFieldThatShouldNotSerialize : string = 'aValue';

        private _fieldThatShouldSerialize : string = 'anotherValue';

        get hiddenFieldThatShouldNotSerialize() {
            return this.$_hiddenFieldThatShouldNotSerialize;
        }

        get fieldThatShouldSerialize() {
            return this._fieldThatShouldSerialize;
        }

        public methodThatShouldNotBeSerialized() {
            this._methodTwoThatShouldNotBeSerialized();
        }

        private _methodTwoThatShouldNotBeSerialized() {
            // do nothing
        }
    }

    it('should not be marked as JSON creation', () => {
        let modelUnderTest = new BaseModelTest();
        expect(modelUnderTest.createdFromJson).toBeFalsy();
    });


    it('should be serialize correclty as JSON', () => {
        let expected = '{"anotherFieldThatShouldSerialize":{"aNestedSerializableField":{"aField":"aValue"}},' +
                       '"fieldThatShouldSerialize":"anotherValue"}';
        let modelUnderTest = new BaseModelTest();
        expect(modelUnderTest.toJsonString()).toEqual(expected);
    });


    it('should register type', () => {
        spyOn(JsonModelConverter, 'registerType');
        let iBaseModel : IBaseModel = {bindingClassName: 'aRandomClassNameToRegister', targetClass: {field: 'canBeAnything'}};
        BaseModel.registerType(iBaseModel);
        expect(JsonModelConverter.registerType).toHaveBeenCalledWith(iBaseModel);
    });
  });
}
