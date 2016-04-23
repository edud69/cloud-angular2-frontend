import {LoggerService} from '../logger/logger.service';
import {WebsocketHandlerType, WebsocketService, IWebsocketSubscriptionCallback} from './websocket.service';


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
   * Websocket connection callback.
   */
  protected abstract _onConnectionEstablished() : void;

  /**
   * Connects the current handler.
   */
  protected _connect() {
        this._websocketService.connect(
      this._getHandlerType(),
      this._getWsConnectEndpointUrl(),
      {
        onConnectionEstablished: () => this._onConnectionEstablished()
      });
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
  protected _send(route : string, message : any) {
    this._websocketService.send(this._getHandlerType(), route, message);
  }
}
