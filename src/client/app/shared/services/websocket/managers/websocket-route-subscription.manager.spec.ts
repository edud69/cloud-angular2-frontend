import { ServiceMockingUtils } from '../../../../../testing/index';
import { WebsocketRouteSubscriptionManager } from './websocket-route-subscription.manager';
import { WebsocketRegistryManager } from './websocket-registry.manager';
import { WebsocketHandlerType, IWebsocketHandler, LoggerService, BaseModel } from '../../../index';

export function main() {

    describe('WebsocketRouteSubscription Manager', () => {

        let managerUnderTest: WebsocketRouteSubscriptionManager;
        let mockedLoggerService: LoggerService;
        let mockedWebsocketRegistryManager: WebsocketRegistryManager;
        let mockedWebsockedHandler: IWebsocketHandler;
        let aMessage: any = {
            body: '{json string...}'
        };

        class MockedWebsocketRegistryManager extends WebsocketRegistryManager { }
        class MockedModel extends BaseModel { }

        beforeEach(() => {
            mockedLoggerService = ServiceMockingUtils.createMockedLoggerService();
            mockedWebsocketRegistryManager = new MockedWebsocketRegistryManager(mockedLoggerService);
            managerUnderTest = new WebsocketRouteSubscriptionManager(mockedLoggerService, mockedWebsocketRegistryManager);
            mockedWebsockedHandler = {
                type: WebsocketHandlerType.CHAT_WEBSOCKET_HANDLER,
                client: null,
                subscriptionRoutes: {},
                connectionStateSubscriber: null
            };
            mockedWebsockedHandler.client = {
                send: null,
                counter: -1,
                maxWebSocketFrameSize: -1,
                subscriptions: null,
                ws: null,
                unsubscribe: null,
                heartbeat: null,
                connected: null,
                debug: null,
                connect: null,
                disconnect: null,
                subscribe: (route: any, callback: any) => {
                    callback(aMessage);
                    return {
                        unsubscribe: () => {/*nothing*/}
                    };
                },
                begin: null,
                commit: null,
                abort: null,
                ack: null,
                nack: null
            };

            spyOn(mockedWebsocketRegistryManager, 'getWebsocketHandler').and.returnValue(mockedWebsockedHandler);
        });

        it('should subscribe', () => {
            let aModelReceived: any = null;
            let aDestination = 'aDestination';
            let aSubscriber = (model: any) => aModelReceived = model;
            let aModelToReturn = new MockedModel();
            (<any>managerUnderTest)['_convert'] = (msg : any) => aModelToReturn;
            managerUnderTest.subscribe(WebsocketHandlerType.CHAT_WEBSOCKET_HANDLER, aDestination, aSubscriber);
            expect(aModelReceived).toBe(aModelToReturn);
        });


        it('should unsubscribe', () => {
            let aDestination = 'aDestination';
            let aSubscriber = (model: any) => {/* nothing */ };
            (<any>managerUnderTest)['_convert'] = (msg : any) => <any>null;
            let subscription = managerUnderTest.subscribe(WebsocketHandlerType.CHAT_WEBSOCKET_HANDLER, aDestination, aSubscriber);
            subscription.unsubscribe();
            let count = Object.getOwnPropertyNames((<any>mockedWebsockedHandler.subscriptionRoutes)).length;
            expect(count).toBe(0);
        });

    });
}
