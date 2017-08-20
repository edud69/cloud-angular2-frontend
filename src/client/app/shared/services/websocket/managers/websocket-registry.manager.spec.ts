import { ServiceMockingUtils } from '../../../../../testing/index';
import { WebsocketRegistryManager } from './websocket-registry.manager';
import { WebsocketHandlerType, IWebsocketHandler } from '../../../index';

export function main() {

  describe('WebsocketHandler Manager', () => {

        let managerUnderTest : WebsocketRegistryManager;
        let mockedLoggerService = ServiceMockingUtils.createMockedLoggerService();
        let aHandlerToRegister : IWebsocketHandler;

        beforeEach(() => {
            managerUnderTest = new WebsocketRegistryManager(mockedLoggerService);
            aHandlerToRegister = {
              connectionStateSubscriber: null,
              client: null,
              type: WebsocketHandlerType.CHAT_WEBSOCKET_HANDLER,
              subscriptionRoutes: null
          };
        });

      it('should return undefined when no handler found', () => {
          expect(managerUnderTest.getWebsocketHandler(WebsocketHandlerType.CHAT_WEBSOCKET_HANDLER)).toBe(undefined);
      });

      it('should return the handler when found', () => {
          (<any>managerUnderTest)._websocketHandlers[WebsocketHandlerType.CHAT_WEBSOCKET_HANDLER] = aHandlerToRegister;
          expect(managerUnderTest.getWebsocketHandler(WebsocketHandlerType.CHAT_WEBSOCKET_HANDLER)).toBe(aHandlerToRegister);
      });

      it('should register the handler', () => {
          managerUnderTest.register(aHandlerToRegister);
          expect((<any>managerUnderTest)._websocketHandlers[WebsocketHandlerType.CHAT_WEBSOCKET_HANDLER]).toBe(aHandlerToRegister);
      });

      it('should return the list of registered websocket handlers', () => {
          managerUnderTest.register(aHandlerToRegister);
          expect(managerUnderTest.registeredHandlerTypes).toEqual([aHandlerToRegister.type]);
      });

      it('should unregister the handler', () => {
          managerUnderTest.register(aHandlerToRegister);
          managerUnderTest.unregister(aHandlerToRegister.type);
          expect(managerUnderTest.registeredHandlerTypes).toEqual([]);
          expect(managerUnderTest.getWebsocketHandler(aHandlerToRegister.type)).toBe(undefined);
      });

      it('should unsubscribe for destinations when unregistering', () => {
          let routeSubscriptions : any = {};
          let routeSub = {
              sub: {
                  unsubscribe: () => {/*nothing*/}
              }
          };

          routeSubscriptions['aRoute'] = routeSub;
          aHandlerToRegister.subscriptionRoutes = routeSubscriptions;

          managerUnderTest.register(aHandlerToRegister);
          spyOn(routeSubscriptions['aRoute'].sub, 'unsubscribe');
          managerUnderTest.unregister(aHandlerToRegister.type);
          expect(routeSub.sub.unsubscribe).toHaveBeenCalled();
      });
  });
}
