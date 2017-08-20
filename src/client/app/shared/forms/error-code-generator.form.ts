import { FormGroup } from '@angular/forms';
import * as _ from 'lodash';

import { FormValidationError, BaseForm } from '../index';

export class FormErrorCodeGenerator {

    public static getFieldErrorCodes(fieldname : string, form : FormGroup) : FormValidationError[] {
        let fieldnameEcs : FormValidationError[] = [];
        let hasError = false;
        let control =  form.get(fieldname);
        if(!control) {
            return null;
        }

        if(control.value instanceof BaseForm) {
            // recursively get errors
            let asBaseForm = <BaseForm>control.value;
            let nestedErrors = asBaseForm.errorCodes;
            if(nestedErrors) {
                let errorCodesToAdd : FormValidationError[] = [];
                _.forEach(nestedErrors, errorCode => errorCodesToAdd = errorCodesToAdd.concat(errorCode));
                if(errorCodesToAdd.length > 0) {
                    fieldnameEcs = errorCodesToAdd;
                    hasError = true;
                }
            }
        } else {
            let errorCodesToAdd : FormValidationError[] = [];
            let nestedErrors = control.errors;
            if(nestedErrors) {
                let asAdditionalValidationErrors = nestedErrors['customErrors'];
                if(asAdditionalValidationErrors) {
                    // case where error was created from the additional validation checkups
                    let nestedEcs = asAdditionalValidationErrors['errorCodes'];
                    if(nestedEcs) {
                        _.forEach(nestedEcs, errorCode => errorCodesToAdd = errorCodesToAdd.concat(errorCode));
                    }
                }

                // case where the error was created directly from HTML DOM (ex: required, max-lenght, pattern)
                let convertedErrors = this._convertNativeErrorsToCustoms(nestedErrors);
                if(convertedErrors) {
                    _.forEach(convertedErrors, errorCode => errorCodesToAdd = errorCodesToAdd.concat(errorCode));
                }
            }

            if(errorCodesToAdd.length > 0) {
                fieldnameEcs = errorCodesToAdd;
                hasError = true;
            }
        }

        return hasError ? fieldnameEcs : null;
    }

    private static _convertNativeErrorsToCustoms(nativeErrors : {[key:string] : any}) : FormValidationError[] {
        let asCustomErrors : FormValidationError[] = [];
        for(let key in nativeErrors) {
            if(key === 'required') {
                if(nativeErrors[key]) {
                    asCustomErrors.push(new FormValidationError('1x0001', 'Field is required.'));
                }
            } else if(key === 'customErrors') {
                // nothing, it is already processed
            } else if(key === 'minlength') {
                let required = nativeErrors[key].requiredLength;
                let actualLength = nativeErrors[key].actualLength;
                let params : {[key:string] : any} = {};
                params['requiredLength'] = required;
                params['actualLength'] = actualLength;
                asCustomErrors.push(new FormValidationError('1x0002', `Field is required a minimum of ${required} characters.`, params));
            } else if(key === 'maxlength') {
                let required = nativeErrors[key].requiredLength;
                let actualLength = nativeErrors[key].actualLength;
                let params : {[key:string] : any} = {};
                params['requiredLength'] = required;
                params['actualLength'] = actualLength;
                asCustomErrors.push(new FormValidationError('1x0003', `Field is required a maximum of ${required} characters.`, params));
            } else if(key === 'pattern') {
                let requiredPattern = nativeErrors[key].requiredPattern;
                let actualValue = nativeErrors[key].actualValue;
                let params : {[key:string] : any} = {};
                params['requiredPattern'] = requiredPattern;
                params['actualValue'] = actualValue;
                asCustomErrors.push(new FormValidationError('1x0004',
                            `Expected pattern (${requiredPattern}) do not match input (${actualValue}).`,
                            params));
            } else {
                throw new Error(`Native validation not matched to ${key}.`);
            }
        }

        return asCustomErrors;
    }

}
