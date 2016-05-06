import {Injectable} from 'angular2/core';
import {Stomp, Client, Subscription} from 'stompjs/lib/stomp';

import {JsonModelConverter} from '../../models/json-model-converter';

import {BaseModel} from '../../models/base.model';

import {AuthTokenService} from '../authentication/auth-token.service';
import {LoggerService} from '../logger/logger.service';


const TOKEN_UPDATE_SEND_DESTINATION : string = '/app/token/update';
const USER_QUEUE_TOKEN_UPDATE_SUBSCRIPTION_DESTINATION : string = '/user/queue/tenant.?/token/update';

/**
 * Websocket handler types.
 */
export enum WebsocketHandlerType {
  CHAT_WEBSOCKET_HANDLER
};


/**
 * Websocket subscription callback.
 */
export interface IWebsocketSubscriptionCallback {
  onMessage(message : string) : void;
}

/**
 * Websocket connection callback.
 */
export interface IWebsocketConnectionCallback {
  onConnectionEstablished() : void;
  onConnectionClose() : void;
}

/**
 * Websocket handler.
 */
interface IWebsocketHandler {
  type: WebsocketHandlerType;
  client : Client;
  subscriptionRoutes: { [route: string] : Subscription; };
  callbacks: IWebsocketConnectionCallback[];
}

/**
 * Websocket handler mapper.
 */
interface IWebsocketHandlerMapper {
  [wsHandlerType: string]  : IWebsocketHandler;
}

/**
 * The websocket token update request message class.
 */
class WebsocketTokenUpdateRequestMsg extends BaseModel {

    constructor(private _newTokenValue : string) {
      super();
    }

     get newTokenValue() : string {
         return this._newTokenValue;
     }
}

BaseModel.registerType({bindingClassName: 'TokenUpdateRequestMsg', targetClass: WebsocketTokenUpdateRequestMsg});


/**
 * The websocket token update response message class.
 */
class WebsocketTokenUpdateResponseMsg extends BaseModel {

    constructor(private _tokenUpdateTime : Date) {
      super();
    }

     get tokenUpdateTime() : Date {
         return this._tokenUpdateTime;
     }
}

BaseModel.registerType({bindingClassName: 'TokenUpdateResponseMsg', targetClass: WebsocketTokenUpdateResponseMsg});




/**
 * Websocket Service.
 */
@Injectable()
export class WebsocketService {

  private _websocketHandlers : IWebsocketHandlerMapper = { };

  /**
   * Ctor.
   */
  constructor(private _loggerService : LoggerService, private _authTokenService : AuthTokenService) {
    this._authTokenService.subscribeToTokenRefreshEvent({ 
      onTokenRefreshed: newToken => this._updateToken(newToken) });
  }

  /**
   * Connects a websocket handler to the given url endpoint.
   */
  connect(websocketHandlerType : WebsocketHandlerType, url : string, connectionCallback? : IWebsocketConnectionCallback) {
    this._loggerService.debug(`Connecting websocket handler of type (${WebsocketHandlerType[websocketHandlerType]}) to endpoint (${url}).`);

    let wsHandler : IWebsocketHandler = this._getWebsocketHandler(websocketHandlerType);
    if(!wsHandler) {
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
        wsHandler = this._websocketHandlers[websocketHandlerType];
        if(wsHandler) {
          wsHandler.callbacks
            .forEach((callback : IWebsocketConnectionCallback) => callback.onConnectionClose());
            delete this._websocketHandlers[websocketHandlerType];
        }

        this._loggerService.error(`Failed to connect websocket 
                                        handler of type ${WebsocketHandlerType[websocketHandlerType]}}. Trace: ` + errorMessageCallback);
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
    if(!wsHandler) {
      this._loggerService.warn(`Websocket handler of type (${WebsocketHandlerType[wsHandlerType]}) 
                  was already disconnected.`);
      return;
    }

    wsHandler.client.disconnect(() => {
      this._websocketHandlers[wsHandlerType].callbacks
        .forEach((callback : IWebsocketConnectionCallback) => callback.onConnectionClose());
      delete this._websocketHandlers[wsHandlerType];
      this._loggerService.info(`Websocket handler of type (${WebsocketHandlerType[wsHandlerType]}) is now disconnected.`);
    },
    (errorMessage : any) => this._loggerService.warn(`Websocket handler of type (${WebsocketHandlerType[wsHandlerType]}) 
        failed to disconnect. Trace : ` + errorMessage));
  }

  /**
   * Sends a payload to a given route on a given websocket handler.
   */
  send(wsHandlerType : WebsocketHandlerType, route : string, payload : BaseModel) {
    let wsHandler = this._getWebsocketHandler(wsHandlerType);
    if(!wsHandler) {
      this._loggerService.error(`Cannot send payload for websocket handler (${WebsocketHandlerType[wsHandlerType]}) 
            to route (${route}). The websocket handler is not registered.`);
      return;
    }

    let headers : any = {};
    wsHandler.client.send(route, headers, payload.toJsonString());
  }

  /**
   * Subscribes a websocket handler to a given route.
   */
  subscribe(wsHandlerType : WebsocketHandlerType, route : string, callbacks : IWebsocketSubscriptionCallback) {
    let wsHandler : any = this._getWebsocketHandler(wsHandlerType);
    if(!wsHandler) {
      this._loggerService.error(`Cannot subscribe websocket handler (${WebsocketHandlerType[wsHandlerType]}) 
          to route (${route}). The websocket handler is not registered.`);
      return;
    }

    let subscription = wsHandler.client.subscribe(route, (message : any) => {
      if(message && message.body) {
        callbacks.onMessage(message.body);
      } else {
        this._loggerService.error('Invalid message payload received : ' + message + '.');
      }
    });

    if(wsHandler.subscriptionRoutes[route]) {
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
    if(!wsHandler) {
      this._loggerService.error(`Cannot subscribe websocket handler (${WebsocketHandlerType[wsHandlerType]}) 
          to route (${route}). The websocket handler is not registered.`);
      return;
    }

    let subscription = wsHandler.subscriptionRoutes[route];
    if(subscription) {
      subscription.unsubscribe();
    } else {
      this._loggerService.warn(`No subscribtion was found on route=${route} for wsHandlerType=${WebsocketHandlerType[wsHandlerType]}.`);
    }

    delete wsHandler.subscriptionRoutes[route];
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

    this.subscribe(wsHandlerType, USER_QUEUE_TOKEN_UPDATE_SUBSCRIPTION_DESTINATION.replace('?', this._authTokenService.currentTenant()), {
      onMessage: (message : any) => {
        let tokenUpdateResponseMsg = <WebsocketTokenUpdateResponseMsg>(JsonModelConverter.fromJson(JSON.parse(message)));
        this._loggerService.info(`Token update for websocket connection of type ${wsHandlerType}. 
                      Server updatetime: ${tokenUpdateResponseMsg.tokenUpdateTime}.`);
      }
    });
  }

  /**
   * Updates the token to all active websocket connetions.
   */
  private _updateToken(newToken : string) {
    if(!newToken) {
      this._loggerService.warn('Token is null. Websocket connections won\'t refresh the token.');
    }

    for (var key in this._websocketHandlers) {
      if (this._websocketHandlers.hasOwnProperty(key)) {
        let wsHandler = this._websocketHandlers[key];
        if(wsHandler) {
          this.send(wsHandler.type, TOKEN_UPDATE_SEND_DESTINATION, new WebsocketTokenUpdateRequestMsg(newToken));
        }
      }
    }
  }  
}
