import { BaseModel } from '../base.model';

export class SearchResults extends BaseModel {

    constructor(private _results : BaseModel[], private _totalResultsCount : number,
        private _queryExecutionTimeInMillis : number) {
        super();
    }

    get resultsCount() {
        return this._results ? this._results.length : 0;
    }

    get totalResultsCount() {
        return this._totalResultsCount;
    }

    get results() {
        return this._results ? this._results : [];
    }

    get queryExecutionTimeInMillis() {
        return this._queryExecutionTimeInMillis;
    }
}

BaseModel.registerType({bindingClassName: 'SearchResultsMessage', targetClass: SearchResults});
