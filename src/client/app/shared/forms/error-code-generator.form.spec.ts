import { Validators } from '@angular/forms';

import { FormErrorCodeGenerator } from './error-code-generator.form';
import { BaseForm, FormValidationError } from '../index';

export function main() {

  describe('ErrorCodeGenerator Form', () => {

    class NestedForm extends BaseForm {
         protected _doAdditionalValidationOnField(fieldName : string, value : any) : FormValidationError[] {
            let errors : any = null;
            if(fieldName === 'anErrorFieldAsNativeType') {
                errors = [];
                errors.push(new FormValidationError('0x1234AAD', 'an error...'));
                errors.push(new FormValidationError('0x1234AAE', 'an error...'));
            }

            return errors;
        }

        get anErrorFieldAsNativeType() {
            return this._doGetFormValue('anErrorFieldAsNativeType');
        }

        set anErrorFieldAsNativeType(value : string) {
            this._doSetFormValue('anErrorFieldAsNativeType', value);
        }
    }

    class SomeForm extends BaseForm {
        protected _doAdditionalValidationOnField(fieldName : string, value : any) : FormValidationError[] {
            let errors : any = null;
            if(fieldName === 'anErrorFieldAsNativeType') {
                errors = [];
                errors.push(new FormValidationError('0x1234AAA', 'an error...'));
                errors.push(new FormValidationError('0x1234AAB', 'an error...'));
            }

            return errors;
        }

        get aNonErrorField() {
            return this._doGetFormValue('aNonErrorField');
        }

        set aNonErrorField(value : string) {
            this._doSetFormValue('aNonErrorField', value);
        }

        get anErrorFieldAsNativeType() {
            return this._doGetFormValue('anErrorFieldAsNativeType');
        }

        set anErrorFieldAsNativeType(value : string) {
            this._doSetFormValue('anErrorFieldAsNativeType', value);
        }

        get anErrorFieldAsNestedForm() {
            return this._doGetFormValue('anErrorFieldAsNestedForm');
        }

        set anErrorFieldAsNestedForm(value : BaseForm) {
            this._doSetFormValue('anErrorFieldAsNestedForm', value);
        }
    }

    let aForm : SomeForm;

    beforeEach(() => {
        aForm = new SomeForm();
    });

    it('should have no errors on a non-error field', () => {
        aForm.aNonErrorField = 'aNewValue'; // trigger validatators
        let errors = FormErrorCodeGenerator.getFieldErrorCodes('aNonErrorField', aForm.formGroup);
        expect(errors).toBeNull();
    });

    it('should have errors on a error field', () => {
        aForm.anErrorFieldAsNativeType = 'aNewValue'; // trigger validatators
        let errors = FormErrorCodeGenerator.getFieldErrorCodes('anErrorFieldAsNativeType', aForm.formGroup);
        expect(errors.length).toBe(2);
        expect(errors[0].errorCode).toBe('0x1234AAA');
        expect(errors[1].errorCode).toBe('0x1234AAB');
    });

    it('should have errors of nested forms', () => {
        let aNestedForm = new NestedForm();
        aNestedForm.anErrorFieldAsNativeType = 'aNewValue'; // trigger validators on nested form
        aForm.anErrorFieldAsNestedForm = aNestedForm; // trigger validatators on main form
        let errors = FormErrorCodeGenerator.getFieldErrorCodes('anErrorFieldAsNestedForm', aForm.formGroup);
        expect(errors.length).toBe(2);
        expect(errors[0].errorCode).toBe('0x1234AAD');
        expect(errors[1].errorCode).toBe('0x1234AAE');
    });

    it('should have convert native angular form errors to FormValidationError (required)', () => {
        aForm.formGroup.controls['aNonErrorField'].validator = Validators.required;
        aForm.aNonErrorField = 'aNewValue'; // trigger validatators
        aForm.aNonErrorField = ''; // trigger validatators
        let errors = FormErrorCodeGenerator.getFieldErrorCodes('aNonErrorField', aForm.formGroup);
        expect(errors.length).toBe(1);
        expect(errors[0].errorCode).toBe('1x0001');
    });

    it('should have convert native angular form errors to FormValidationError (minlength)', () => {
        aForm.formGroup.controls['aNonErrorField'].validator = Validators.minLength(2);
        aForm.aNonErrorField = 'a'; // trigger validatators
        let errors = FormErrorCodeGenerator.getFieldErrorCodes('aNonErrorField', aForm.formGroup);
        expect(errors.length).toBe(1);
        expect(errors[0].errorCode).toBe('1x0002');
    });

    it('should have convert native angular form errors to FormValidationError (maxlength)', () => {
        aForm.formGroup.controls['aNonErrorField'].validator = Validators.maxLength(2);
        aForm.aNonErrorField = 'abc'; // trigger validatators
        let errors = FormErrorCodeGenerator.getFieldErrorCodes('aNonErrorField', aForm.formGroup);
        expect(errors.length).toBe(1);
        expect(errors[0].errorCode).toBe('1x0003');
    });

    it('should have convert native angular form errors to FormValidationError (pattern)', () => {
        aForm.formGroup.controls['aNonErrorField'].validator = Validators.pattern('[0-9]+');
        aForm.aNonErrorField = 'abc'; // trigger validatators
        let errors = FormErrorCodeGenerator.getFieldErrorCodes('aNonErrorField', aForm.formGroup);
        expect(errors.length).toBe(1);
        expect(errors[0].errorCode).toBe('1x0004');
    });
  });
}
