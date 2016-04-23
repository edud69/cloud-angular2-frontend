import {Injectable} from 'angular2/core';

import {LoggerService} from '../logger/logger.service';
import {WebsocketHandlerType, WebsocketService,
     IWebsocketConnectionCallback} from '../websocket/websocket.service';
import {WebsocketHandlerService} from '../websocket/websocketHandler.service';

export interface IChatMessageCallback {
  onReceive(message : any) : void;
}

/**
 * Chat service.
 */
@Injectable()
export class ChatService extends WebsocketHandlerService {

  /**
   * Ctor.
   */
  constructor(_loggerService : LoggerService, _websocketService : WebsocketService) {
    super(_loggerService, _websocketService);
  }

  /**
   * Returns the ws handler type.
   */
  protected _getHandlerType() : WebsocketHandlerType {
    return WebsocketHandlerType.CHAT_WEBSOCKET_HANDLER;
  }

  /**
   * Gets the ws connection endpoint.
   */
  protected _getWsConnectEndpointUrl() : string {
    return '<%= CHATSERVICE_API_connect %>';
  }

  /**
   * Websocket connection opened callback.
   */
  protected _onConnectionEstablished() {
    this._loggerService.log('Connection established');
  }

  /**
   * Websocket connection closed callback.
   */
  protected _onConnectionClosed() {
    this._loggerService.log('Connection closed');
  }

  /**
   * Opens a chat session.
   */
  openSession(connectionCallback? : IWebsocketConnectionCallback) {
    super._connect(connectionCallback);
  }

  /**
   * Closes the session.
   */
  closeSession() {
    super._disconnect();
  }

  /**
   * Sends a chat message.
   */
  sendChat(message : string) {
    let msgToSend : any = {
      channelName: 'channelname', //TODO
      message: message,
      senderUsername: 'I_AM_SENDER_USER'
    };

    this._send(msgToSend);
  }

  /**
   * Joins a chat channel.
   */
  join(callback : IChatMessageCallback) {
    let chatTopicPrefix : string = '/topic/chat';
    let route : string = chatTopicPrefix + '/channelname'; //TODO provide channel name
    super._subscribe(route, {
      onMessage: (message : any) => callback.onReceive(message)
    });
  }

  /**
   * Sends a message.
   */
  protected _send(message : any) {
    let route : string = '/app/chat.group.message'; //TODO change
    super._send(route, message);
  }
}
