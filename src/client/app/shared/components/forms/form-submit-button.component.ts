import {Component, Injectable, Input} from '@angular/core';

import {ManagedComponent} from '../../index';


@Component({
  moduleId: module.id,
  selector: 'sd-form-submit-button',
  template: '<span [ngSwitch]="parentHost.isProcessing">'+

            '<button *ngSwitchCase="true" type="submit"' +
            'color="primary" md-raised-button disabled><md-icon>hourglass_empty</md-icon></button>' +

            '<button *ngSwitchCase="false" type="submit" [disabled]="!parentHost.form.isDirty || !parentHost.form.isValid"' +
            'color="primary" md-raised-button>TODO translate:Forms.submitButton</button>' +
            '</span>'
})

@Injectable()
export class FormSubmitButtonComponent {

    parentHost : ManagedComponent<any>;

    @Input()
    set host(host: ManagedComponent<any>) {
        this.parentHost = host;
    }

}
