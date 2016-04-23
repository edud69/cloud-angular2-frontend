import {Injectable} from 'angular2/core';
import {Stomp, Client, Subscription} from 'stompjs/lib/stomp';

import {AuthTokenService} from '../authentication/auth-token.service';
import {LoggerService} from '../logger/logger.service';


export enum WebsocketHandlerType {
  CHAT_WEBSOCKET_HANDLER
};

export interface IWebsocketSubscriptionCallback {
  onMessage(message : any) : void;
}

export interface IWebsocketConnectionCallback {
  onConnectionEstablished() : void;
  onConnectionClose() : void;
}

interface IWebsocketHandler {
  type: WebsocketHandlerType;
  client : Client;
  subscriptionRoutes: { [route: string] : Subscription; };
  callbacks: IWebsocketConnectionCallback[];
}

interface IWebsocketHandlerMapper {
  [wsHandlerType: string]  : IWebsocketHandler;
}

/**
 * Websocket Service.
 */
@Injectable()
export class WebsocketService {

  private _websocketHandlers : IWebsocketHandlerMapper = { };

  /**
   * Ctor.
   */
  constructor(private _loggerService : LoggerService, private _authTokenService : AuthTokenService) {}

  /**
   * Connects a websocket handler to the given url endpoint.
   */
  connect(websocketHandlerType : WebsocketHandlerType, url : string, connectionCallback? : IWebsocketConnectionCallback) {
    this._loggerService.debug(`Connecting websocket handler of type (${WebsocketHandlerType[websocketHandlerType]}) to endpoint (${url}).`);

    let wsHandler : IWebsocketHandler = this._getWebsocketHandler(websocketHandlerType);
    if(wsHandler === null || wsHandler === undefined || !wsHandler.client.connected) {
      let accessToken : string = this._authTokenService.getAccessToken();
      let ws = new WebSocket(url + '?token=' + accessToken);
      let client : Client = Stomp.over(ws);
      let headers : any = {};

      client.connect(headers,
      (successMessageCallback : any) => {
        this._register(websocketHandlerType, client, connectionCallback);
        this._websocketHandlers[websocketHandlerType].callbacks
          .forEach((callback : IWebsocketConnectionCallback) => callback.onConnectionEstablished());
        this._loggerService.debug(`Websocket handler of type ${WebsocketHandlerType[websocketHandlerType]} is now connected.`);
      },
      (errorMessageCallback : any) => { 
        this._websocketHandlers[websocketHandlerType].callbacks
          .forEach((callback : IWebsocketConnectionCallback) => callback.onConnectionClose());
        this._loggerService.error(`Failed to connect websocket 
                                        handler of type ${wsHandler}. Trace: ` + errorMessageCallback);
      });
    } else {
      this._loggerService.warn(`Websocket handler of type (${WebsocketHandlerType[websocketHandlerType]}) 
            was already connected to a endpoint (${url}).`);
    }
  }

  /**
   * Disconnects a given websocket handler.
   */
  disconnect(wsHandlerType : WebsocketHandlerType) {
    let wsHandler = this._getWebsocketHandler(wsHandlerType);
    if(wsHandler === null || wsHandler === undefined) {
      this._loggerService.warn(`Websocket handler of type (${WebsocketHandlerType[wsHandlerType]}) 
                  was already disconnected.`);
      return;
    }

    wsHandler.client.disconnect(() => {
      this._websocketHandlers[wsHandlerType].callbacks
        .forEach((callback : IWebsocketConnectionCallback) => callback.onConnectionClose());
      this._websocketHandlers[wsHandlerType] = null;
      this._loggerService.info(`Websocket handler of type (${WebsocketHandlerType[wsHandlerType]}) is now disconnected.`);
    },
    (errorMessage : any) => this._loggerService.warn(`Websocket handler of type (${WebsocketHandlerType[wsHandlerType]}) 
        failed to disconnect. Trace : ` + errorMessage));
  }

  /**
   * Sends a payload to a given route on a given websocket handler.
   */
  send(wsHandlerType : WebsocketHandlerType, route : string, payload : any) {
    let wsHandler = this._getWebsocketHandler(wsHandlerType);
    if(wsHandler === null || wsHandler === undefined) {
      this._loggerService.error(`Cannot send payload for websocket handler (${WebsocketHandlerType[wsHandlerType]}) 
            to route (${route}). The websocket handler is not registered.`);
      return;
    }

    let headers : any = {};
    wsHandler.client.send(route, headers, JSON.stringify(payload));
  }

  /**
   * Subscribes a websocket handler to a given route.
   */
  subscribe(wsHandlerType : WebsocketHandlerType, route : string, callbacks : IWebsocketSubscriptionCallback) {
    let wsHandler : any = this._getWebsocketHandler(wsHandlerType);
    if(wsHandler === null || wsHandler === undefined) {
      this._loggerService.error(`Cannot subscribe websocket handler (${WebsocketHandlerType[wsHandlerType]}) 
          to route (${route}). The websocket handler is not registered.`);
      return;
    }

    let subscription = wsHandler.client.subscribe(route, (message : any) => callbacks.onMessage(message));
    if(wsHandler.subscriptionRoutes[route] !== null && wsHandler.subscriptionRoutes[route] !== undefined) {
      wsHandler.subscriptionRoutes[route].unsubscribe();
      this._loggerService.warn(`A subscription exists on the same route (${route}) 
                for wsHandlerType (${WebsocketHandlerType[wsHandlerType]}).
                The previous subscription has been removed`);
    }

    wsHandler.subscriptionRoutes[route] = subscription;
  }

  /**
   * Unsubscribes a websocket handler from a route.
   */
  unsubscribe(wsHandlerType : WebsocketHandlerType, route : string) {
    let wsHandler : any = this._getWebsocketHandler(wsHandlerType);
    if(wsHandler === null || wsHandler === undefined) {
      this._loggerService.error(`Cannot subscribe websocket handler (${WebsocketHandlerType[wsHandlerType]}) 
          to route (${route}). The websocket handler is not registered.`);
      return;
    }

    let subscription = wsHandler.subscriptionRoutes[route];
    if(subscription !== null || subscription !== undefined) {
      subscription.unsubscribe();
    } else {
      this._loggerService.warn(`No subscribtion was found on route=${route} for wsHandlerType=${WebsocketHandlerType[wsHandlerType]}.`);
    }

    wsHandler.subscriptionRoutes[route] = null;
  }

  /**
   * Retrieves a websocket handler.
   */
  private _getWebsocketHandler(wsHandlerType : WebsocketHandlerType) : IWebsocketHandler {
    return this._websocketHandlers[wsHandlerType];
  }

  /**
   * Registers a websocket handler.
   */
  private _register(wsHandlerType : WebsocketHandlerType, client : Client,
      callback? : IWebsocketConnectionCallback) {
    this._websocketHandlers[wsHandlerType] = {
      type: wsHandlerType,
      client: client,
      subscriptionRoutes: {},
      callbacks: []
    };
    
    if(callback !== null) {
      this._websocketHandlers[wsHandlerType].callbacks.push(callback);
    }
  }
}
