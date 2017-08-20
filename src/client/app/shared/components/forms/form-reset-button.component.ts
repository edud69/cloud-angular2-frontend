import { Component, Injectable, Input } from '@angular/core';

import { ManagedComponent } from '../../index';


@Component({
  moduleId: module.id,
  selector: 'sd-form-reset-button',
  template: '<button (click)="parentHost.resetForm()" [disabled]="!parentHost.form.isDirty || parentHost.isProcessing"' +
            'color="primary" md-raised-button>TODO translate:Forms.resetButton</button>'
})

@Injectable()
export class FormResetButtonComponent {

    parentHost : ManagedComponent<any>;

    @Input()
    set host(host: ManagedComponent<any>) {
        this.parentHost = host;
    }

}
