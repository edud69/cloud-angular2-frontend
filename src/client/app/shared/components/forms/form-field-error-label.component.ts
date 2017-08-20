import { Component, Injectable, Input, OnDestroy } from '@angular/core';

import { BaseForm, FormValidationError } from '../../index';


@Component({
  moduleId: module.id,
  selector: 'sd-error-field-label',
  template: '<div style="color:red; margin-bottom:5px;">' +
            '<font size="1"><span *ngFor="let errMsg of errorMessages">{{errMsg}}</span></font>' +
            '</div>'
})
@Injectable()
export class FormFieldErrorLabelComponent implements OnDestroy {

  errorMessages : string[];

  baseForm : BaseForm;

  watchedFieldname : string;

  private _sub : any;

  constructor() {}

    @Input()
    set form(baseForm: BaseForm) {
        this.baseForm = baseForm;
        if(!this._sub && this.watchedFieldname) {
            this._sub = this._sub = this.baseForm.formGroup.valueChanges.subscribe(data => this._formChanged(data));
            // forces an update
            this._formChanged(null);
        }
    }

    @Input()
    set fieldname(fieldname : string) {
        this.watchedFieldname = fieldname;
        if(!this._sub && this.baseForm) {
            this._sub = this._sub = this.baseForm.formGroup.valueChanges.subscribe(data => this._formChanged(data));
            // forces an update
            this._formChanged(null);
        }
    }

    public ngOnDestroy() {
        if(this._sub) {
            this._sub.unsubscribe();
        }
    }

    private _formChanged(data : any) {
        this.errorMessages = [];
        let errors : FormValidationError[] = this.baseForm.getFieldErrorCodes(this.watchedFieldname);
        if(errors && errors.length > 0) {
                            errors.forEach(err => {
                                let errorCode = err.errorCode;
                                let errorParams = err.errorParams;
                                // TODO translate all errors.
                                this.errorMessages.push('TODO: This should be translated ' + errorCode + errorParams);
                            });
        }
    }

}
