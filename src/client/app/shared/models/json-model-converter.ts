import {IBaseModel, BaseModel} from './base.model';

interface IModelTypeMap {
  [modelTypeBindingClassName: string]  : IBaseModel;
}

/**
 * The JsonModelConverter class.
 */
export class JsonModelConverter {

    private static _ModelTypesMap : IModelTypeMap = {};

    /**
     * Registers a type to the json converter.
     */
    static registerType(clazz : IBaseModel) {
        JsonModelConverter._ModelTypesMap[clazz.bindingClassName] = clazz;
    }

    /**
     * Generates a strongly type instance from a json.
     */
    static fromJson(json : any) : BaseModel {
        if(json) {
            if(!json.bindingClassName) {
                throw new TypeError('Could not determine type of json, bindingClassName field must be present on json');
            }

            let modelType = JsonModelConverter._ModelTypesMap[json.bindingClassName];
            if(!modelType) {
                throw new TypeError('Type bindingClassName=' + json.bindingClassName + ' was not found.'
                    + 'Have you registered your type?');
            }

            let model = new modelType.targetClass();
            for(let key in json) {
              if(json.hasOwnProperty(key)) {
                  if(model.hasOwnProperty(key)) {
                      JsonModelConverter._cpyFromJson(json[key], model, key);
                  } else {
                      // try the private field instead
                      let privateFieldKey : string = '_' + key;
                      if(model.hasOwnProperty(privateFieldKey)) {
                          JsonModelConverter._cpyFromJson(json[key], model, privateFieldKey);
                      } else {
                          let ignored : string[] = model['$_ignoredFieldFromJson'];
                          if(!ignored) {
                              ignored = [];
                          }

                          ignored.push(key);
                          model['$_ignoredFieldFromJson'] = ignored;
                      }
                  }
              }
            }

            model['$_createdFromJson'] = true;

            return model;
        }
        return null;
    }

    /**
     * Converts an object to a json object.
     */
    static toJson(obj : BaseModel) : any {
        let cpy : any = {};
        let asAny : any = obj;

        for(let key in asAny) {
            if(obj.hasOwnProperty(key)) {
                if(key.indexOf('$') === 0) {
                    continue; //Do not serialize this field
                }

                let cpyKeyToUse : string = JsonModelConverter._generateJsonKeyField(key);
                if(asAny[key] instanceof Date) {
                    cpy[cpyKeyToUse] = JsonModelConverter._writesDateToString(<Date>asAny[key]);
                } else if(asAny[key] instanceof BaseModel) {
                    if(asAny[key]) {
                        cpy[cpyKeyToUse] = JsonModelConverter.toJson(asAny[key]);
                    } else {
                        cpy[cpyKeyToUse] = asAny[key];
                    }
                } else {
                    cpy[cpyKeyToUse] = asAny[key];
                }
            }
        }

        return cpy;
    }

    /**
     * Copies a value from json to a model.
     */
    private static _cpyFromJson(value : any, model : any, modelFieldName : string) {
        if(value && value.bindingClassName) {
            model[modelFieldName] = JsonModelConverter.fromJson(value);
        } else {
            model[modelFieldName] = value;
        }
    }

    /**
     * Generates the json key to use.
     */
    private static _generateJsonKeyField(modelKey : string) {
        let cpyKeyToUse : string = modelKey;
        if(cpyKeyToUse.indexOf('_') === 0) {
            // Rename private fields (starts with '_')
            cpyKeyToUse = cpyKeyToUse.substr(1);
        }
        return cpyKeyToUse;
    }

    /**
     * Rewrites a date to a string.
     */
    private static _writesDateToString(date : Date) : string {
        let dateStr : string = null;
        if(date === null) {
            return dateStr;
        }

        dateStr = date.toISOString();
        if(dateStr.lastIndexOf('Z') === dateStr.length - 1) {
            dateStr = dateStr.substr(0, dateStr.length - 1);
        }

        return dateStr;
    }
}
