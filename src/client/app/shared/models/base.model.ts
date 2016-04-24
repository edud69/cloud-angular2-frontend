export abstract class BaseModel {

    /**
     * Creates a json string compatible for rest from this model.
     */
    toRest() : string {
        return JSON.stringify(this._toJsonObject());
    }

    /**
     * Creates a json object compatible for rest from this model.
     */
    private _toJsonObject() : any {
        let cpy : any = {};
        let obj : any = this;

        for(let key in this) {
            if(obj.hasOwnProperty(key)) {
                let cpyKeyToUse : string = key;
                if(cpyKeyToUse.indexOf('_') === 0) {
                    cpyKeyToUse = cpyKeyToUse.substr(1);
                }

                if(obj[key] instanceof Date && obj[key] !== null) {
                    cpy[cpyKeyToUse] = (<Date>obj[key]).toISOString();
                    let asStr : string = (<string>cpy[cpyKeyToUse]);
                    if(asStr.lastIndexOf('Z') === asStr.length - 1) {
                        cpy[cpyKeyToUse] = asStr.substr(0, asStr.length - 1);
                    }
                } else {
                    cpy[cpyKeyToUse] = obj[key];
                }
            }
        }

        return cpy;
    }
}
