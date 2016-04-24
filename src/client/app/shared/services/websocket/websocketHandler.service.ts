import {BaseModel} from '../../models/base.model';
import {LoggerService} from '../logger/logger.service';
import {WebsocketHandlerType, WebsocketService,
  IWebsocketConnectionCallback, IWebsocketSubscriptionCallback} from './websocket.service';


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
          if(connectionCallback !== null) {
            connectionCallback.onConnectionEstablished();
          }

          this._onConnectionEstablished();
        },
        onConnectionClose: () => {
          if(connectionCallback !== null) {
            connectionCallback.onConnectionClose();
          }
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
   * Unsubscribe from a route.
   */
  protected _unsubscribe(route : string) {
    this._websocketService.unsubscribe(this._getHandlerType(), route);
  }

  /**
   * Subscribes to a route.
   */
  protected _subscribe(route : string, callback : IWebsocketSubscriptionCallback) {
    this._websocketService.subscribe(this._getHandlerType(), route, callback);
  }

  /**
   * Sends a message.
   */
  protected _send(route : string, message : BaseModel) {
    this._websocketService.send(this._getHandlerType(), route, message);
  }
}
