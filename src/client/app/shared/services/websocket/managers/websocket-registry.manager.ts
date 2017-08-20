import { IWebsocketHandler, WebsocketHandlerType, LoggerService } from '../../../index';

import * as _ from 'lodash';

/**
 * The websocket registry manager.
 */
export class WebsocketRegistryManager {

  private _websocketHandlers : {[wsHandlerType: string]  : IWebsocketHandler} = {};

  constructor(private _loggerService : LoggerService) {}

  /**
   * Gets the registered websocket handler types.
   */
  public get registeredHandlerTypes() {
    return _.map(this._websocketHandlers, entry => entry.type);
  }

  /**
   * Gets the websocket handler from a given type.
   */
  public getWebsocketHandler(wsHandlerType : WebsocketHandlerType) {
    return this._websocketHandlers[wsHandlerType];
  }

  /**
   * Register an entry to the registry.
   */
  public register(registryEntry : IWebsocketHandler) {
      this._websocketHandlers[registryEntry.type] = registryEntry;
  }

  /**
   * Unsubscribes all subscribers from the handler and the free all resources.
   */
  public unregister(wsHandlerType : WebsocketHandlerType) {
    let wsHandler = this._websocketHandlers[wsHandlerType];

    // unsubscribes from all registered destinations
    for(let routeSubscriber in wsHandler.subscriptionRoutes) {
      wsHandler.subscriptionRoutes[routeSubscriber].sub.unsubscribe();
      delete wsHandler.subscriptionRoutes[routeSubscriber];
    }

    delete this._websocketHandlers[wsHandlerType];
  }
}
