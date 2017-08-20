import { Injectable, OnDestroy } from '@angular/core';
import { Client } from 'stompjs';

import { BaseModel, AuthTokenService,
         LoggerService, IWebsocketConnectionCallback, IWebsocketHandler,
         IWebsocketRouteSubscription, WebsocketHandlerType,
         WebsocketTokenUpdateRequestMsg, WebsocketTokenUpdateResponseMsg } from '../../index';

import { WebsocketRegistryManager } from './managers/websocket-registry.manager';
import { WebsocketConnectionManager } from './managers/websocket-connection.manager';
import { WebsocketRouteSubscriptionManager } from './managers/websocket-route-subscription.manager';


const TOKEN_UPDATE_SEND_DESTINATION: string = '/app/token.update';
const USER_QUEUE_TOKEN_UPDATE_SUBSCRIPTION_DESTINATION: string = '/user/queue/tenant.?-token.update';

/**
 * Websocket Service.
 */
@Injectable()
export class WebsocketService implements OnDestroy {

  private _registryManager: WebsocketRegistryManager;

  private _connectionManager: WebsocketConnectionManager;

  private _subscriptionManager: WebsocketRouteSubscriptionManager;

  private _internalSubs: { [wsHandlerType: string]: IWebsocketRouteSubscription } = {};

  /**
   * Ctor.
   */
  constructor(private _loggerService: LoggerService, private _authTokenService: AuthTokenService) {
    this._registryManager = new WebsocketRegistryManager(this._loggerService);
    this._connectionManager = new WebsocketConnectionManager(this._loggerService, this._registryManager);
    this._subscriptionManager = new WebsocketRouteSubscriptionManager(this._loggerService, this._registryManager);

    this._authTokenService.subscribeToTokenRefreshEvent(newToken => this._updateToken(newToken));
    this._authTokenService.subscribeToTokenClearEvent(() => this._freeResources());
  }

  /**
   * On destroy.
   */
  ngOnDestroy() {
    this._freeResources();
  }

  /**
   * Connects a websocket handler to the given url endpoint.
   */
  connect(websocketHandlerType: WebsocketHandlerType, url: string, connectionCallback: IWebsocketConnectionCallback) {
    this._loggerService.debug('Connecting websocket handler of type ({0}) to endpoint ({1}).',
      [WebsocketHandlerType[websocketHandlerType], url]);

    let accessToken: string = this._authTokenService.getAccessToken();
    if (!accessToken || this._authTokenService.isAccessTokenExpired()) {
      this._loggerService.debug('Connection forbidden, the token is expired.');
      return;
    }

    let connectionSuccessInterceptor = (client: any) => this._register(websocketHandlerType, client, connectionCallback);
    let connectionErrorInterceptor = (client: any) => connectionCallback.onConnectionClose();

    this._connectionManager.connect(url, accessToken, websocketHandlerType, connectionSuccessInterceptor, connectionErrorInterceptor);
  }

  /**
   * Disconnects a given websocket handler.
   */
  disconnect(wsHandlerType: WebsocketHandlerType) {
    this._connectionManager.disconnect(wsHandlerType);
  }

  /**
   * Sends a payload to a given route on a given websocket handler.
   */
  send(wsHandlerType: WebsocketHandlerType, route: string, payload: BaseModel) {
    let wsHandler = this._registryManager.getWebsocketHandler(wsHandlerType);
    if (!wsHandler) {
      this._loggerService.error('Cannot send payload for websocket handler ({0}) to route ({1}). The websocket handler is not registered.',
        [WebsocketHandlerType[wsHandlerType], route]);
      return;
    }

    let headers: any = {};
    wsHandler.client.send(route, headers, payload.toJsonString());
  }

  /**
   * Subscribes a websocket handler to a given route.
   */
  subscribe(wsHandlerType: WebsocketHandlerType, route: string,
    subscriber: ((message: BaseModel) => void)): IWebsocketRouteSubscription {
    return this._subscriptionManager.subscribe(wsHandlerType, route, subscriber);
  }

  /**
   * Registers a websocket handler.
   */
  private _register(wsHandlerType: WebsocketHandlerType, client: Client,
    callback?: IWebsocketConnectionCallback) {
    let wsHandler: IWebsocketHandler = {
      type: wsHandlerType,
      client: client,
      subscriptionRoutes: {},
      connectionStateSubscriber: callback
    };

    this._registryManager.register(wsHandler);

    let sub = this.subscribe(
      wsHandlerType, USER_QUEUE_TOKEN_UPDATE_SUBSCRIPTION_DESTINATION.replace('?', this._authTokenService.currentTenant()),
      (message: BaseModel) => {
        let tokenUpdateResponseMsg = <WebsocketTokenUpdateResponseMsg>(message);
        this._loggerService.info('Token update for websocket connection of type {0}. Server updatetime: {1}.',
          [wsHandlerType, tokenUpdateResponseMsg.tokenUpdateTime]);
      });

    this._internalSubs[wsHandlerType] = sub;
  }


  /**
   * Updates the token to all active websocket connetions.
   */
  private _updateToken(newToken: string) {
    if (!newToken) {
      this._loggerService.warn('Token is null. Websocket connections won\'t refresh the token.');
    }

    this._registryManager.registeredHandlerTypes.forEach(wsHandlerType =>
      this.send(wsHandlerType, TOKEN_UPDATE_SEND_DESTINATION, new WebsocketTokenUpdateRequestMsg(newToken)));
  }

  /**
   * Free the resources.
   */
  private _freeResources() {
    // unusbscribes from internal destinations
    for (let sub in this._internalSubs) {
      this._internalSubs[sub].unsubscribe();
      delete this._internalSubs[sub];
    }

    this._registryManager.registeredHandlerTypes.forEach(wsHandlerType => this.disconnect(wsHandlerType));
  }
}
