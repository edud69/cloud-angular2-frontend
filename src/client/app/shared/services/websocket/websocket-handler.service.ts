import { BaseModel, LoggerService,
         WebsocketHandlerType, WebsocketService,
         IWebsocketConnectionCallback, IWebsocketRouteSubscription } from '../../index';


/**
 * Websocket Handler Service.
 */
export abstract class WebsocketHandlerService {

  /**
   * Ctor.
   */
  constructor(protected _loggerService : LoggerService, protected _websocketService : WebsocketService) {}

  /**
   * Gets the ws handler type.
   */
  protected abstract _getHandlerType() : WebsocketHandlerType;

  /**
   * Gets the ws connection url.
   */
  protected abstract _getWsConnectEndpointUrl() : string;

  /**
   * Websocket connection opened callback.
   */
  protected abstract _onConnectionEstablished() : void;

  /**
   * Websocket connection closed callback.
   */
  protected abstract _onConnectionClosed() : void;

  /**
   * Connects the current handler.
   */
  protected _connect(connectionCallback? : IWebsocketConnectionCallback) {
        this._websocketService.connect(
          this._getHandlerType(),
          this._getWsConnectEndpointUrl(),
          {
            onConnectionEstablished: () => {
              if(connectionCallback) {
                connectionCallback.onConnectionEstablished();
              }

              this._onConnectionEstablished();
            },
            onConnectionClose: () => {
              if(connectionCallback) {
                connectionCallback.onConnectionClose();
              }

              this._onConnectionClosed();
            }
        });
  }

  /**
   * Disconnects the current websocketHandler.
   */
  protected _disconnect() {
    this._websocketService.disconnect(this._getHandlerType());
  }

  /**
   * Subscribes to a route.
   */
  protected _subscribe(route : string, subscriber : ((message : BaseModel) => void)) : IWebsocketRouteSubscription {
    return this._websocketService.subscribe(this._getHandlerType(), route, subscriber);
  }

  /**
   * Sends a message.
   */
  protected _send(route : string, message : BaseModel) {
    this._websocketService.send(this._getHandlerType(), route, message);
  }
}
