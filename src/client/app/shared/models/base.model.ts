import {JsonModelConverter} from './json-model-converter';

export interface IBaseModel {
    targetClass : any;
    bindingClassName : string;
}

export abstract class BaseModel {

    private $_createdFromJson : boolean = false;

    static registerType(model : IBaseModel) {
        JsonModelConverter.registerType(model);
    }

    get createdFromJson() {
        return this.$_createdFromJson;
    }

    /**
     * Creates a json string compatible for rest from this model.
     */
    toJsonString() : string {
        return JSON.stringify(JsonModelConverter.toJson(this));
    }
}
