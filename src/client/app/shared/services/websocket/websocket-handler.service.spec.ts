import { ServiceMockingUtils } from '../../../../testing/index';
import { WebsocketHandlerService, WebsocketHandlerType, IWebsocketConnectionCallback } from '../../index';

export function main() {

  describe('WebsocketHandler Service', () => {

        class WebsocketHandlerServiceTest extends WebsocketHandlerService {
            public connectionEstablished = false;
            public connectionClosed = false;

            get wsHandlerType () {
                return this._getHandlerType();
            }

            get endpoint() {
                return this._getWsConnectEndpointUrl();
            }

            protected _getWsConnectEndpointUrl() : string {
                return 'wss://urlendpoint.com/';
            }

            protected _getHandlerType() : WebsocketHandlerType {
                return WebsocketHandlerType.CHAT_WEBSOCKET_HANDLER;
            }

            public _onConnectionClosed() {
                this.connectionClosed = true;
                this.connectionEstablished = false;
            }

            public _onConnectionEstablished() {
                this.connectionClosed = false;
                this.connectionEstablished = true;
            }

            public connect(aCallback? : IWebsocketConnectionCallback) {
                super._connect(aCallback);
            }

            public disconnect() {
                super._disconnect();
            }
        }

        class MockedWebsocketService {}

        let mockedLoggerService = ServiceMockingUtils.createMockedLoggerService();
        let mockedWebsocketService : any = new MockedWebsocketService();
        let serviceUnderTest : WebsocketHandlerServiceTest;

        beforeEach(() => {
            serviceUnderTest = new WebsocketHandlerServiceTest(mockedLoggerService, mockedWebsocketService);
        });

      it('should connect with appropriate arguments and then disconnect', () => {
        mockedWebsocketService.connect = (arg1 : any, arg2 : any, arg3 : any) => arg3.onConnectionEstablished();
        spyOn(mockedWebsocketService, 'connect').and.callFake((arg1 : any, arg2 : any, arg3 : any) => arg3.onConnectionEstablished());

        serviceUnderTest.connect();

        expect(mockedWebsocketService.connect).toHaveBeenCalledWith(
                serviceUnderTest.wsHandlerType, serviceUnderTest.endpoint, jasmine.anything());
        expect(serviceUnderTest.connectionClosed).toBeFalsy();
        expect(serviceUnderTest.connectionEstablished).toBeTruthy();

        mockedWebsocketService.disconnect = (arg1 : any, arg2 : any, arg3 : any) => {/* nothing */};
        spyOn(mockedWebsocketService, 'disconnect').and.callFake(
                (arg1 : any, arg2 : any, arg3 : any) => (<any>serviceUnderTest)._onConnectionClosed());
        serviceUnderTest.disconnect();
        expect(serviceUnderTest.connectionEstablished).toBeFalsy();
        expect(serviceUnderTest.connectionClosed).toBeTruthy();
      });

      it('should make the callback to the external interface', () => {
            mockedWebsocketService.connect = (arg1 : any, arg2 : any, arg3 : any) => {/* nothing */};
            spyOn(mockedWebsocketService, 'connect').and.callFake((arg1 : any, arg2 : any, arg3 : any) => arg3.onConnectionEstablished());

            let connClosedCalled = false;
            let connEstablishedCalled = false;

            let aCallback : IWebsocketConnectionCallback = {
                onConnectionClose: () => connClosedCalled = true,
                onConnectionEstablished: () => connEstablishedCalled = true
            };

            serviceUnderTest.connect(aCallback);
            expect(connEstablishedCalled).toBeTruthy();
            expect(serviceUnderTest.connectionEstablished).toBeTruthy();

            mockedWebsocketService.disconnect = (arg1 : any, arg2 : any, arg3 : any) => {/* nothing */};
            spyOn(mockedWebsocketService, 'disconnect').and.callFake(
                (arg1 : any, arg2 : any, arg3 : any) => {
                    (<any>serviceUnderTest)._onConnectionClosed();
                    aCallback.onConnectionClose();
                });

            serviceUnderTest.disconnect();
            expect(connClosedCalled).toBeTruthy();
            expect(serviceUnderTest.connectionClosed).toBeTruthy();
      });
  });
}
