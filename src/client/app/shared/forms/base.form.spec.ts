import { BaseForm } from './base.form';
import { FormValidationError } from './validation-error.form';

export function main() {

  describe('Base Form', () => {

    class TestableBaseForm extends BaseForm {

        protected _doAdditionalValidationOnField(fieldName : string, value : any) : FormValidationError[] {
            if(fieldName === 'aProperty' && 'forceError') {
                let errors : FormValidationError[] = [];
                errors.push(new FormValidationError('0x00120A', 'An error...'));
                return errors;
            }

            return null;
        }

        get aProperty() {
            return this._doGetFormValue('aProperty');
        }

        set aProperty(value : string) {
            this._doSetFormValue('aProperty', value);
        }
    }

    let classUnderTest : TestableBaseForm;

    beforeEach(() => {
        classUnderTest = new TestableBaseForm();
    });

    it('should match isPreventChangesLossEnabled', () => {
        expect(classUnderTest.isPreventChangesLossEnabled).toBeFalsy();
        let testClass = new TestableBaseForm(true);
        expect(testClass.isPreventChangesLossEnabled).toBeTruthy();
    });

    it('should match the underlying formGroup', () => {
        let testClass = new TestableBaseForm(true, {aProperty: 'aValue'});
        expect(testClass.formGroup).toBeDefined();
        expect(testClass.formGroup.controls['aProperty']).toBeDefined();
    });

    it('should be dirty when changed', () => {
        expect(classUnderTest.isDirty).toBeFalsy();
        classUnderTest.aProperty = 'aNewValue';
        expect(classUnderTest.aProperty).toBe('aNewValue');
        expect(classUnderTest.isDirty).toBeTruthy();
    });

    it('should not be dirty when matching default value', () => {
        expect(classUnderTest.isDirty).toBeFalsy();
        classUnderTest.resetForm({aProperty: 'aNewValue'});
        expect(classUnderTest.aProperty).toBe('aNewValue');
        expect(classUnderTest.isDirty).toBeFalsy();
    });

    it('should be dirty when different than default value', () => {
        expect(classUnderTest.isDirty).toBeFalsy();
        classUnderTest.resetForm({aProperty: 'aNewValue'});
        classUnderTest.aProperty = 'anotherNewValue';
        expect(classUnderTest.isDirty).toBeTruthy();
    });

    it('should not be valid when there validators has errors', () => {
        expect(classUnderTest.isValid).toBeTruthy();
        classUnderTest.aProperty = 'forceError'; // value that will cause the validator error
        expect(classUnderTest.isValid).toBeFalsy();
    });

    it('should get error codes when it is invalid', () => {
        classUnderTest.aProperty = 'forceError'; // value that will cause the validator error
        let errorCodes = classUnderTest.errorCodes;
        expect(errorCodes).toBeDefined();
        let err = errorCodes['aProperty'];
        expect(err).toBeDefined();
        expect(err.length).toBe(1);
        expect(err[0].errorCode).toBe('0x00120A');
    });

    it('should get specific field error codes when it is invalid', () => {
        classUnderTest.aProperty = 'forceError'; // value that will cause the validator error
        let errorCodes = classUnderTest.getFieldErrorCodes('aProperty');
        expect(errorCodes).toBeDefined();
        expect(errorCodes.length).toBe(1);
        expect(errorCodes[0].errorCode).toBe('0x00120A');
    });
  });
}
