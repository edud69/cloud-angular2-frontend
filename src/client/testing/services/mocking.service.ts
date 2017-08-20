import { IApiResult, BaseModel } from '../../app/shared/index';

export namespace ServiceMockingUtils {

    export class MockedLoggerService {}

    export function createMockedLoggerService() {
        let mockedLoggerService : any = new MockedLoggerService();
        mockedLoggerService.log = (msg : any, arg : any) => {/*nothing*/};
        mockedLoggerService.warn = (msg : any, arg : any) => {/*nothing*/};
        mockedLoggerService.debug = (msg : any, arg : any) => {/*nothing*/};
        mockedLoggerService.info = (msg : any, arg : any) => {/*nothing*/};
        mockedLoggerService.error = (msg : any, arg : any) => {/*nothing*/};
        return mockedLoggerService;
    }

    export function createMockedServiceResponse<T extends BaseModel>(returnedResponse? : T) : IApiResult<T> {
        return { subscribe: (onResponse, onError, onComplete) => {
            if(onResponse) {
                onResponse(returnedResponse);
            }
            if(onComplete) {
                onComplete();
            }
            return { unsubscribe: () => {/* nothing */}};
        } };
    }
}
