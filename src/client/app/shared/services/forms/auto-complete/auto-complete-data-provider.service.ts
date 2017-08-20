import { Subject } from 'rxjs/Subject';
import { Injectable } from '@angular/core';
import { Headers } from '@angular/http';
import { CompleterData, CompleterItem } from 'ng2-completer';

import { BaseModel, ApiError, LoggerService, HttpRestService, HttpConstants, SearchResults } from '../../../index';

@Injectable()
export class AutoCompleteDataProviderService extends Subject<CompleterItem[]> implements CompleterData {

    private _apiUrl : string;
    private _imgBaseModelProperty : string;
    private _titleBaseModelProperty : string;
    private _descriptionBaseModelProperty : string;

    constructor(private _loggerService : LoggerService,
                private _httpRestService : HttpRestService) {
      super();
    }

    public set imgBaseModelProperty(imgBaseModelProperty : string) {
        this._imgBaseModelProperty = imgBaseModelProperty;
    }

    public set descriptionBaseModelProperty(descriptionBaseModelProperty : string) {
        this._descriptionBaseModelProperty = descriptionBaseModelProperty;
    }

    public set titleBaseModelProperty(titleBaseModelProperty : string) {
        this._titleBaseModelProperty = titleBaseModelProperty;
    }

    public set queryUrl(url : string) {
        this._apiUrl = url;
    }

    public search(term: string): void {
        let url = this._apiUrl;
        if(!url) {
            this._loggerService.error('No query url has been set. Search is impossible.');
        }

        let headers = new Headers();
        headers.append(HttpConstants.HTTP_HEADER_CONTENT_TYPE, null);

        let sub = this._httpRestService.httpGet(url + '?term=' + term, headers)
            .subscribe(
                response => this.next(this._convertResponseToCompleterItems(response)),
                error => this.next(this._convertResponseToCompleterItems(error)), // error needs to be displayed
                () => {
                    if(sub) {
                        sub.unsubscribe();
                    }
                }
            );
    }

    public cancel() {
     // called when user clicks outside the input while searching occurs
     this._loggerService.log('Auto-complete search window dismissed.');
    }

    private _convertResponseToCompleterItems(response : BaseModel) {
        let matches: CompleterItem[] = [];
        if(response instanceof ApiError) {
            let asError = <ApiError>response;
            let errorCode = 'ErrorCodes.' + asError.code;
            let errorParams = asError.errorParams;
            // TODO translate this
            let translated = 'TODO translate : ' + errorCode + errorParams;

            matches.push({
                title: translated,
                originalObject: response
            });
        } else {
            let asSearchResult = <SearchResults>response;
            asSearchResult.results.forEach((searchResult : any) => {
                matches.push({
                    title: this._titleBaseModelProperty ? searchResult[this._titleBaseModelProperty] : null,
                    description: this._descriptionBaseModelProperty ? searchResult[this._descriptionBaseModelProperty] : null,
                    image: this._imgBaseModelProperty ? searchResult[this._imgBaseModelProperty] : null,
                    originalObject: searchResult
                });
            });
        }

        return matches;
    }
}
