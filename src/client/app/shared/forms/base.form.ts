import { FormBuilder, FormGroup, FormControl } from '@angular/forms';
import * as _ from 'lodash';

import { FormValidationError } from '../index';
import { FormErrorCodeGenerator } from './error-code-generator.form';

/**
 * Base class for interaction with user input.
 */
export abstract class BaseForm {

    private _internalForm : FormGroup;

    private _initialValues : {[key : string] : any} = {};

    private _passwordComparators : {p1 :string, p2 : string} = {p1 : null, p2 : null};

    constructor(private _preventUnsaveChangesLoss : boolean = false, defaultValues? : {[fieldName : string] : any}) {
        this._internalForm = new FormBuilder().group(this._loadInitialProperties(defaultValues));
    }

    get isPreventChangesLossEnabled() {
        return this._preventUnsaveChangesLoss;
    }

    get formGroup() {
        return this._internalForm;
    }

    get isDirty() {
        return this._internalForm ? this._internalForm.dirty : false;
    }

    get isValid() {
        return this._internalForm ? this._internalForm.valid : true;
    }

    get errorCodes() : ({[fieldName : string] : FormValidationError[]}) {
        if(!this._internalForm) {
            return null;
        }

        let errors : ({[fieldName : string] : FormValidationError[]}) = {};
        let hasError = false;

        for(let modifiedFieldKey in this._initialValues) {
            let fieldnameEcs = this.getFieldErrorCodes(modifiedFieldKey);
            if(fieldnameEcs && fieldnameEcs.length > 0) {
                errors[modifiedFieldKey] = fieldnameEcs;
                hasError = true;
            }
        }

        return hasError ? errors : null;
    }

    public getFieldErrorCodes(fieldname : string) : FormValidationError[] {
        return FormErrorCodeGenerator.getFieldErrorCodes(fieldname, this._internalForm);
    }

    public resetForm(defaultValues? : {[fieldName : string] : any}) {
        if(defaultValues) {
            this._loadInitialProperties(defaultValues);
            this.resetForm();
        } else {
            this._internalForm.reset();
            for(let key in this._initialValues) {
                let val = this._initialValues[key];
                if(val) {
                    this._internalForm.controls[key].setValue(val);
                }
            }
        }
    }

    protected _doGetFormValue(key : string) {
        return this._internalForm.controls[key].value;
    }

    protected _doSetFormValue(key : string, value : any) {
        let previousValue = this._doGetFormValue(key);
        this._internalForm.controls[key].setValue(value);
        if(previousValue !== value) {
            this._internalForm.markAsDirty();
        }
    }

    protected abstract _doAdditionalValidationOnField(fieldName : string, value : any) : FormValidationError[];

    protected _doPasswordMatchValidation(fieldToValidate : string, fieldValue : string, fieldToCompare : string) : boolean {
       let comparativeFieldValue : string = this._internalForm.controls[fieldToCompare].value;
       let areSame = (!fieldValue && !comparativeFieldValue) || (fieldValue === comparativeFieldValue);

        if (areSame && (this._passwordComparators.p1 === fieldToCompare || this._passwordComparators.p2 === fieldToCompare)) {
            // remove the current validated password from the cache, it was validated OK
            if(this._passwordComparators.p1 === fieldToValidate) {
                this._passwordComparators.p1 = null;
            } else if(this._passwordComparators.p2 === fieldToValidate) {
                this._passwordComparators.p2 = null;
            }

            // if password matches then notify the other field to update validators in case he had an error
            this._internalForm.controls[fieldToCompare].updateValueAndValidity();
        }

        if(!areSame)  {
            if(!this._passwordComparators.p1 && this._passwordComparators.p1 !== fieldToValidate) {
                this._passwordComparators.p1 = fieldToValidate;
            } else if(!this._passwordComparators.p2 && this._passwordComparators.p2 !== fieldToValidate) {
                this._passwordComparators.p2 = fieldToValidate;
            }
        }

        return areSame;
    }

    private _loadInitialProperties(defaultValues : {[key : string] : any}) : any {
        let formControlConfig : { [key: string]: any; }= {};
        let fieldsInThisBaseClass : string[] = [];
        for(let key in BaseForm.prototype) {
            fieldsInThisBaseClass.push(key);
        }

        for(let key in this) {
            let hasAGetter =  Object.getPrototypeOf(this).__lookupGetter__(key);
            let isNotListedInBaseType = !_.some(fieldsInThisBaseClass, (input : string) =>  input === key);

            if(hasAGetter && isNotListedInBaseType) {
                if(defaultValues && defaultValues[key]) {
                    formControlConfig[key] = new FormControl(defaultValues[key], this._createValidator(key));
                    this._initialValues[key] = _.cloneDeep(defaultValues[key]);
                } else {
                    formControlConfig[key] = new FormControl(null, this._createValidator(key));
                    this._initialValues[key] = null;
                }
            }
        }

        return formControlConfig;
    }

    private _checkForChanges(fieldName : string, control : FormControl) {
        if(control.dirty) {
            let initialValue = this._initialValues[fieldName];
            if(!initialValue && !control.value) {
                // null, string empty, undefined are considered the same, so when this happens,
                // input in the form is not considered dirty
                control.markAsPristine();
            }
        }
    }

    private _createValidator(fieldName : string) : (c : FormControl) => { [key: string]: FormValidationError[] } {
        return (control : FormControl) => {
            if(!this._internalForm) {
                // when calling the constructor with default initialization fields,
                // the validation must not be done, form is in the building process
                return null;
            }

            this._checkForChanges(fieldName, control);

            let value = control.value;
            let errorCodes = this._doAdditionalValidationOnField(fieldName, value);

            if(!errorCodes || errorCodes.length === 0) {
                return null;
            }

            let error : { [key: string]: any; } = {};
            error['customErrors'] = { valid: false, errorCodes : errorCodes };

            return error;
        };
    }
}
