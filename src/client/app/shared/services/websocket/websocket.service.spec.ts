import { Client } from 'stompjs';

import { ServiceMockingUtils } from '../../../../testing/index';
import { WebsocketService, AuthTokenService, WebsocketHandlerType,
         BaseModel, IWebsocketConnectionCallback, IWebsocketHandler } from '../../index';

export function main() {

    describe('Websocket Service', () => {

        class MockedAuthTokenService extends AuthTokenService { }
        class MessagePayload extends BaseModel { }

        let mockedLoggerService = ServiceMockingUtils.createMockedLoggerService();
        let mockedAuthTokenService: MockedAuthTokenService = null;
        let connectionUrl = 'wss://url.com/api/endpoint';
        let connectionClosedCalled = false;
        let connectionEstablishedCalled = false;
        let messagePayLoad: MessagePayload = null;
        let serviceUnderTest: WebsocketService;

        let connectionCallback: IWebsocketConnectionCallback = {
            onConnectionClose: () => connectionClosedCalled = true,
            onConnectionEstablished: () => connectionEstablishedCalled = true
        };

        beforeEach(() => {
            // weird bug that displays a Karma warning for missing css. It should not happen as this is a service, not component
            // maybe the service is loading a component (when it should not)
            document.body.insertAdjacentHTML('afterbegin', '<link rel=\"stylesheet\" href=\"/base/dist/dev/css/indigo-pink.css\" />')

            mockedAuthTokenService = new MockedAuthTokenService(null, mockedLoggerService);
            serviceUnderTest = new WebsocketService(mockedLoggerService, mockedAuthTokenService);
            connectionClosedCalled = false;
            connectionEstablishedCalled = false;
            messagePayLoad = new MessagePayload();
        });


        it('should freeResources when token is cleared', () => {
                let theSubscriber: any;
                mockedAuthTokenService.subscribeToTokenClearEvent = (sub: () => void) => {
                    theSubscriber = sub;
                    return { unsubscribe: () => {/*nothing*/ } };
                };

                let service = new WebsocketService(mockedLoggerService, mockedAuthTokenService);
                let called = false;
                (<any>service)['_freeResources'] = () => called = true;
                theSubscriber();
                expect(called).toBeTruthy();
            });


        it('should update when token is updated', () => {
                let theSubscriber: any;
                mockedAuthTokenService.subscribeToTokenRefreshEvent = (sub: (newToken: string) => void) => {
                    theSubscriber = sub;
                    return { unsubscribe: () => {/*nothing*/ } };
                };

                let service = new WebsocketService(mockedLoggerService, mockedAuthTokenService);
                let tkn = null;
                (<any>service)['_updateToken'] = (a1 : any) => tkn = a1;
                theSubscriber('a-new-refresh-token');
                expect(tkn).toBe('a-new-refresh-token');
            });

        it('should freeResources on destroy', () => {
                let called = false;
                (<any>serviceUnderTest)['_freeResources'] = () => called = true;
                serviceUnderTest.ngOnDestroy();
                expect(called).toBeTruthy();
            });


        it('should not call the connection manager if token is not valid', () => {
                mockedAuthTokenService.getAccessToken = () => 'an-expired-token';
                mockedAuthTokenService.isAccessTokenExpired = () => true;
                spyOn((<any>serviceUnderTest)._connectionManager, 'connect');
                serviceUnderTest.connect(WebsocketHandlerType.CHAT_WEBSOCKET_HANDLER, connectionUrl, connectionCallback);
                expect((<any>serviceUnderTest)._connectionManager.connect).not.toHaveBeenCalled();
            });


        it('should call the connection manager if token is valid', () => {
                mockedAuthTokenService.getAccessToken = () => 'a-valid-token';
                mockedAuthTokenService.isAccessTokenExpired = () => false;
                spyOn((<any>serviceUnderTest)._connectionManager, 'connect');
                serviceUnderTest.connect(WebsocketHandlerType.CHAT_WEBSOCKET_HANDLER, connectionUrl, connectionCallback);
                expect((<any>serviceUnderTest)._connectionManager.connect)
                    .toHaveBeenCalledWith(connectionUrl, 'a-valid-token',
                    WebsocketHandlerType.CHAT_WEBSOCKET_HANDLER, jasmine.anything(), jasmine.anything());
            });

        it('should dispatch to connection manager a disconnection action', () => {
                spyOn((<any>serviceUnderTest)._connectionManager, 'disconnect');
                serviceUnderTest.disconnect(WebsocketHandlerType.CHAT_WEBSOCKET_HANDLER);
                expect((<any>serviceUnderTest)._connectionManager.disconnect)
                    .toHaveBeenCalledWith(WebsocketHandlerType.CHAT_WEBSOCKET_HANDLER);
            });

        it('should have an error when sending payload to unregistered handler', () => {
                spyOn(mockedLoggerService, 'error');
                serviceUnderTest.send(WebsocketHandlerType.CHAT_WEBSOCKET_HANDLER, 'a-route', messagePayLoad);
                expect(mockedLoggerService.error).toHaveBeenCalled();
            });

        it('should send a message', () => {
                let client: Client = {
                    send: (route: string, header: any, payload: string) => {/*nothing*/ },
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
                    subscribe: null,
                    begin: null,
                    commit: null,
                    abort: null,
                    ack: null,
                    nack: null
                };
                let wsHandler: IWebsocketHandler = {
                    client: client,
                    subscriptionRoutes: null,
                    type: WebsocketHandlerType.CHAT_WEBSOCKET_HANDLER,
                    connectionStateSubscriber: null
                };

                (<any>serviceUnderTest)._registryManager.register(wsHandler);

                spyOn(wsHandler.client, 'send');
                serviceUnderTest.send(WebsocketHandlerType.CHAT_WEBSOCKET_HANDLER, 'a-route', messagePayLoad);
                expect(wsHandler.client.send).toHaveBeenCalledWith('a-route', {}, messagePayLoad.toJsonString());
            });
    });
}
