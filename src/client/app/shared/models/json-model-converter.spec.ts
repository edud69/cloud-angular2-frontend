import { BaseModel, JsonModelConverter, IBaseModel, RandomUtils } from '../index';

export function main() {

  describe('JsonModelConverter', () => {

    class ConcreteModel extends BaseModel {

        constructor(public somePublicField : number,
                    protected _aProtectedField : string,
                    public bindingClassnameField : string) {
                        super();
                    }

        public somePublicMethod() {
            this._somePrivateMethod();
        }

        private _somePrivateMethod() {
            //nothing
        }
    }
    class EvenMoreConcreteModel extends ConcreteModel {

        private $_shouldNotSerialize : string = 'aValue';

        constructor(public someOtherPublicField : string,
                    public someNestedObject : ConcreteModel,
                    public aDate : Date,
                    public anArrayOfModels : ConcreteModel[],
                    private _someOtherPrivateField: number,
                    public bindingClassnameField : string) {
                        super(null, null, null);
                    }

        get someOtherPrivateField() {
            return this._someOtherPrivateField;
        }

        get shouldNotSerialize() {
            return this.$_shouldNotSerialize;
        }

        public someOtherPublicMethod() {
            this._someOtherPrivateMethod();
        }

        private _someOtherPrivateMethod() {
            // nothing
        }
    }

    let anEvenMoreConcreteModelWithData : EvenMoreConcreteModel;

    beforeEach(() => {
        anEvenMoreConcreteModelWithData =
            new EvenMoreConcreteModel('someOtherPublicFieldValue',
                new ConcreteModel(3, 'protectedFieldValue', null), new Date(), [], 2, null);
        anEvenMoreConcreteModelWithData.anArrayOfModels.push(anEvenMoreConcreteModelWithData.someNestedObject);
    });

    it('should register a provided type', () => {
        let randomStr = RandomUtils.randomString(12);
        let expected : IBaseModel = {bindingClassName: randomStr, targetClass: {}};
        JsonModelConverter.registerType(expected);
        expect(JsonModelConverter['_ModelTypesMap'][randomStr]).toBe(expected);
    });


    it('should throw when registering with the same key', () => {
        let randomStr = RandomUtils.randomString(12);
        let expected : IBaseModel = {bindingClassName: randomStr, targetClass: {}};
        JsonModelConverter.registerType(expected);
        expect(JsonModelConverter['_ModelTypesMap'][randomStr]).toBe(expected);
        expect(() => JsonModelConverter.registerType(expected)).toThrow(
            new Error(`Registering multiple instances with the same bindingClassName is forbidden. ` +
                      `Provided bindingClassName=${randomStr}.`));
    });

    it('shoud be null when provided >> string empty, null or undefined', () => {
        let rez = JsonModelConverter.fromJson('');
        expect(rez).toBeNull();

        rez = JsonModelConverter.fromJson(undefined);
        expect(rez).toBeNull();

        rez = JsonModelConverter.fromJson(null);
        expect(rez).toBeNull();
    });

    it('shoud throw when provided >> non-object argument', () => {
        expect(() => JsonModelConverter.fromJson(1)).toThrow(
            new TypeError('Could not map incoming JSON message, $bindingClassName field must be present on the payload.'));

        expect(() => JsonModelConverter.fromJson('a string')).toThrow(
            new TypeError('Could not map incoming JSON message, $bindingClassName field must be present on the payload.'));
    });

    it('shoud throw when the bindingClassName is not found', () => {
        expect(() => JsonModelConverter.fromJson({$bindingClassName: 'someClassThatIsNotRegistered'})).toThrow(
            new TypeError('Type bindingClassName=someClassThatIsNotRegistered was not found.' +
                            'Have you registered your type?')
        );
    });

    it('should throw if json has an unknown field', () => {
        let randomKey = RandomUtils.randomString(12);
        JsonModelConverter.registerType(
                {bindingClassName: randomKey, targetClass: EvenMoreConcreteModel});

        expect(() => JsonModelConverter.fromJson({$bindingClassName: randomKey, anUnexsitingFieldThatShouldMakeThrow: true })).toThrow(
            new TypeError(`Could not match a property named: anUnexsitingFieldThatShouldMakeThrow in model: EvenMoreConcreteModel.`)
        );
    });

    it('should serialize than deserialize correclty', () => {
        let bindingClassName = RandomUtils.randomString(12);
        let bindingClassNameTwo = RandomUtils.randomString(12);

        // emulates the fact that the message will come from the backend
        (<any>anEvenMoreConcreteModelWithData)['$bindingClassName'] = bindingClassName;
        (<any>anEvenMoreConcreteModelWithData.someNestedObject)['$bindingClassName'] = bindingClassNameTwo;

        // register the type
        JsonModelConverter.registerType(
                {bindingClassName: bindingClassName, targetClass: EvenMoreConcreteModel});
        JsonModelConverter.registerType(
                {bindingClassName: bindingClassNameTwo, targetClass: ConcreteModel});

        (<any>anEvenMoreConcreteModelWithData)['bindingClassnameField'] = bindingClassName;
        (<any>anEvenMoreConcreteModelWithData.someNestedObject)['bindingClassnameField'] = bindingClassNameTwo;

        let json = anEvenMoreConcreteModelWithData.toJsonString();
        json = json.replace('bindingClassnameField', '$bindingClassName').replace('bindingClassnameField', '$bindingClassName');

        let deserializedModel = JsonModelConverter.fromJson(JSON.parse(json));
        expect(typeof(deserializedModel)).toBe(typeof(anEvenMoreConcreteModelWithData));

        let asEvenMoreConcreteModel = <EvenMoreConcreteModel>deserializedModel;

        // it is created from a JSON input
        expect(deserializedModel.createdFromJson).toBeTruthy();

        // field validation
        expect(asEvenMoreConcreteModel.someOtherPrivateField).toBe(anEvenMoreConcreteModelWithData.someOtherPrivateField);
        expect(asEvenMoreConcreteModel.someOtherPublicField).toBe(anEvenMoreConcreteModelWithData.someOtherPublicField);
        expect(asEvenMoreConcreteModel.somePublicField).toBe(anEvenMoreConcreteModelWithData.somePublicField);
        expect((<any>asEvenMoreConcreteModel)['aProtectedField']).toBe((<any>anEvenMoreConcreteModelWithData)['aProtectedField']);
        expect(asEvenMoreConcreteModel.someNestedObject.somePublicField)
                .toBe(anEvenMoreConcreteModelWithData.someNestedObject.somePublicField);
        expect(asEvenMoreConcreteModel.anArrayOfModels).toBeDefined();
        expect(asEvenMoreConcreteModel.anArrayOfModels.length).toBe(1);
        expect(asEvenMoreConcreteModel.anArrayOfModels[0].somePublicField)
            .toEqual(anEvenMoreConcreteModelWithData.someNestedObject.somePublicField);

        // compare initial json with the new one
        let jsonStr = anEvenMoreConcreteModelWithData.toJsonString();
        expect(jsonStr.indexOf('$bindinClassName')).toBe(-1); // $_... field should not be present
        (<any>asEvenMoreConcreteModel)['bindingClassnameField'] = bindingClassName;
        (<any>asEvenMoreConcreteModel.someNestedObject)['bindingClassnameField'] = bindingClassNameTwo;

        let jsonObj = JSON.parse(jsonStr);
        expect(jsonObj['anArrayOfModels'][0]['somePublicField'])
            .toEqual(asEvenMoreConcreteModel.anArrayOfModels[0].somePublicField);
    });

  });
}
