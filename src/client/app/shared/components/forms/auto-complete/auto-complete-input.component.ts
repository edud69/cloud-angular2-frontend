import { Component, Injectable, Input } from '@angular/core';
import {CompleterItem } from 'ng2-completer';

import { AutoCompleteDataProviderService } from '../../../services/forms/auto-complete/auto-complete-data-provider.service';

import { BaseModel, ApiError, LoggerService } from '../../../index';

@Component({
  moduleId: module.id,
  selector: 'sd-input-auto-complete',
  templateUrl: 'auto-complete-input.component.html',
  styleUrls: ['auto-complete-input.component.css'],
  providers: [AutoCompleteDataProviderService]
})
@Injectable()
export class AutoCompleteInputComponent {
  public inputSearchStr: string;

  private _config = {
      delayBetweenSearchInMillis : 250,
      autoMatchItem: false,
      fieldTabIndex: 0,
      minSearchLength: 2,
      clearInputWhenElementSelected: false,
      placeholder: ''
  };

  private _onSelectedItemCallback : ((selected : BaseModel) => void);

  constructor(public completerService: AutoCompleteDataProviderService, private _loggerService : LoggerService) {}

  @Input()
  public set queryUrl(url : string) {
      this.completerService.queryUrl = url;
  }

  @Input()
  public set placeholder(placeholder : string) {
      this._config.placeholder = placeholder;
  }

  @Input()
  public set delayBetweenSearchInMillis(delay : number) {
      this._config.delayBetweenSearchInMillis = delay;
  }

  @Input()
  public set autoMatchItem(autoMatchItem : boolean) {
      this._config.autoMatchItem = autoMatchItem;
  }

  @Input()
  public set tabIndex(tabIndex : number) {
      this._config.fieldTabIndex = tabIndex;
  }

  @Input()
  public set minSearchLength(length : number) {
      this._config.minSearchLength = length;
  }

  @Input()
  public set clearInputWhenElementSelected(clearInput : boolean) {
      this._config.clearInputWhenElementSelected = clearInput;
  }

  @Input()
  public set selectedItemCallback(fct : ((selected : BaseModel) => void)) {
      this._onSelectedItemCallback = fct;
  }

  @Input()
  public set imgBaseModelProperty(imgBaseModelProperty : string) {
    this.completerService.imgBaseModelProperty = imgBaseModelProperty;
  }

  @Input()
  public set descriptionBaseModelProperty(descriptionBaseModelProperty : string) {
    this.completerService.descriptionBaseModelProperty = descriptionBaseModelProperty;
  }

  @Input()
  public set titleBaseModelProperty(titleBaseModelProperty : string) {
    this.completerService.titleBaseModelProperty = titleBaseModelProperty;
  }

  public get config() {
      return this._config;
  }

  public onElementSelected(completerItem : CompleterItem) {
      let baseModelObj = completerItem.originalObject;
      if(baseModelObj instanceof ApiError) {
          // erase the user input, it should not be an error
          // do not propagated the error, it is displayed in the auto-completed drop-down
          this.inputSearchStr = '';
          this._loggerService.error('User selection ignored. Selected items is an error.');
      } else {
        let callback = this._onSelectedItemCallback;
        if(callback) {
            callback(baseModelObj);
        }
      }
  }
}
