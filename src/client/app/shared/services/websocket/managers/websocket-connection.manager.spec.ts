import { ServiceMockingUtils } from '../../../../../testing/index';
import { WebsocketConnectionManager } from './websocket-connection.manager';
import { WebsocketRegistryManager } from './websocket-registry.manager';
import { WebsocketHandlerType, IWebsocketHandler, LoggerService } from '../../../index';

export function main() {

    describe('WebsocketConnection Manager', () => {

        let managerUnderTest: WebsocketConnectionManager;
        let mockedLoggerService: LoggerService;
        let mockedWebsocketRegistryManager: WebsocketRegistryManager;
        let mockedWebsockedHandler: IWebsocketHandler;
        let mockedStompClient: any;

        class MockedWebsocketRegistryManager extends WebsocketRegistryManager { }

        beforeEach(() => {
            mockedLoggerService = ServiceMockingUtils.createMockedLoggerService();
            mockedWebsocketRegistryManager = new MockedWebsocketRegistryManager(mockedLoggerService);
            managerUnderTest = new WebsocketConnectionManager(mockedLoggerService, mockedWebsocketRegistryManager);
            mockedWebsockedHandler = {
                type: WebsocketHandlerType.CHAT_WEBSOCKET_HANDLER,
                client: null,
                subscriptionRoutes: null,
                connectionStateSubscriber: null
            };


            mockedStompClient = {};

            (<any>managerUnderTest)['_createStompConnection'] = (_ : any, __ : any) => mockedStompClient;
            (<any>managerUnderTest)['_isLogForStompTrafficEnabled'] = () => false;
        });

        it('should not connect when handler exists', () => {
            spyOn(mockedWebsocketRegistryManager, 'getWebsocketHandler').and.callFake((handlerType: WebsocketHandlerType) => {
                if (handlerType === WebsocketHandlerType.CHAT_WEBSOCKET_HANDLER) {
                    return mockedWebsockedHandler;
                }

                return null;
            });
            let called = false;
            (<any>managerUnderTest)['_doConnect'] = (a1 : any, a2 : any, a3 : any, a4 : any, a5 : any) => called = true;
            managerUnderTest.connect('endpointUrl', 'accessToken',
                WebsocketHandlerType.CHAT_WEBSOCKET_HANDLER, () => {/* nothing*/ }, null);
            expect(called).toBeFalsy();
        });

        it('should connect when handler does not exists', () => {
            let connectionEstablishedCallbackCalled = false;
            let addHandlerToRegistryFct = (client: any) => {
                mockedWebsockedHandler.type = -1;
                mockedWebsockedHandler.connectionStateSubscriber = {
                    onConnectionClose: () => {/*nothing*/ },
                    onConnectionEstablished: () => connectionEstablishedCallbackCalled = true
                };
                mockedWebsocketRegistryManager.register(mockedWebsockedHandler);
            };

            mockedStompClient.connect = (headers: any, successCallback: any, errorCallback: any) => successCallback(null);
            managerUnderTest.connect('endpointUrl', 'accessToken', -1, (client: any) => addHandlerToRegistryFct(client), null);
            expect(connectionEstablishedCallbackCalled).toBeTruthy();
        });


        it('should get a notification callback when exception on connect', () => {
            let connectionClosedCalled = false;
            let connectionError = (client: any) => connectionClosedCalled = true;
            mockedStompClient.connect = (headers: any, successCallback: any, errorCallback: any) => errorCallback(null);
            managerUnderTest.connect('endpointUrl', 'accessToken', -1, null, (client: any) => connectionError(client));
            expect(connectionClosedCalled).toBeTruthy();
        });

        it('shoud disconnect', () => {
            spyOn(mockedWebsocketRegistryManager, 'getWebsocketHandler').and.callFake((handlerType: WebsocketHandlerType) => {
                if (handlerType === WebsocketHandlerType.CHAT_WEBSOCKET_HANDLER) {
                    return mockedWebsockedHandler;
                }

                return null;
            });

            let clientDisconnected = false;
            let notified = false;
            let client: any = {
                send: (route: string, header: any, payload: string) => {/*nothing*/ },
                heartbeat: null,
                connected: null,
                debug: null,
                connect: null,
                disconnect: (callback: any) => {
                    callback();
                    clientDisconnected = true;
                },
                subscribe: null,
                begin: null,
                commit: null,
                abort: null,
                ack: null,
                nack: null
            };

            mockedWebsockedHandler.client = client;

            mockedWebsockedHandler.connectionStateSubscriber = {
                onConnectionClose: () => notified = true,
                onConnectionEstablished: () => {/*nothing*/ }
            };

            spyOn(mockedWebsocketRegistryManager, 'unregister');
            managerUnderTest.disconnect(WebsocketHandlerType.CHAT_WEBSOCKET_HANDLER);
            expect(mockedWebsocketRegistryManager.unregister).toHaveBeenCalledWith(WebsocketHandlerType.CHAT_WEBSOCKET_HANDLER);
            expect(clientDisconnected).toBeTruthy();
            expect(notified).toBeTruthy();
        });

    });
}
