import { Component, Injectable, Input } from '@angular/core';
import { ApiError } from '../../index';


@Component({
  moduleId: module.id,
  selector: 'sd-error-box',
  templateUrl: 'error-box.component.html',
  styleUrls: ['error-box.component.css']
})
/**
 * The error box component class.
 */
@Injectable()
export class ErrorBoxComponent {

  errorMessage : string;

    @Input()
    set error(apiError: ApiError) {
        if (apiError) {
            let errorCode = 'ErrorCodes.' + apiError.code;
            let errorParam = apiError.errorParams;

            //TODO translate (params are placeholders that should go in the translation)
            this.errorMessage = 'TODO translate: ' + errorCode + errorParam;
        } else {
            this.errorMessage = null;
        }
    }

}
