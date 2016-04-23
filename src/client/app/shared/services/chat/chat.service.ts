import {Injectable} from 'angular2/core';

import {LoggerService} from '../logger/logger.service';
import {WebsocketHandlerType, WebsocketService} from '../websocket/websocket.service';
import {WebsocketHandlerService} from '../websocket/websocketHandler.service';

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
   * Websocket connection callback.
   */
  protected _onConnectionEstablished() {
    this.join(); //TODO remove this, only for testing, the user should make the manual action to join
  }

  /**
   * Opens a chat session.
   */
  openSession() {
    super._connect();
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
  join() {
    let chatTopicPrefix : string = '/topic/chat';
    let route : string = chatTopicPrefix + '/channelname'; //TODO provide channel name
    super._subscribe(route, {
      onMessage: (message : any) => alert(message) //TODO make something cleaner...
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
