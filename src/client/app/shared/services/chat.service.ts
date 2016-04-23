import {Injectable} from 'angular2/core';

import {LoggerService} from './logger.service';
import {WebsocketHandlerType, WebsocketService, IWebsocketConnectionCallback} from './websocket.service';

/**
 * Chat service.
 */
@Injectable()
export class ChatService {

  private _handlerType : WebsocketHandlerType;

  constructor(private _loggerService:LoggerService, private _websocketService : WebsocketService) {
    this._handlerType = WebsocketHandlerType.CHAT_WEBSOCKET_HANDLER;
  }

  /**
   * Opens a chat session.
   */
  openSession() {
    let callback : IWebsocketConnectionCallback = {
      onConnectionEstablished: () => this.join()
    }; //TODO remove this, only for testing, the user should make the manual action to join

    this._websocketService.connect(
      this._handlerType,
      '<%= CHATSERVICE_API_connect %>',
      callback);
  }

  /**
   * Sends a chat message.
   */
  sendChat(message : string) {
    let msgToSend : any = {
      channelName: 'channelname', //TODO
      message: message,
      senderUsername: 'I_AM_SENDER_USER', //TODO
      sentTime: new Date()
    };

    this._send(msgToSend);
  }

  /**
   * Joins a chat channel.
   */
  join() {
    let chatTopicPrefix : string = '/app/topic/chat';
    let route : string = chatTopicPrefix + '/channelname'; //TODO provide channel name
    this._websocketService.subscribe(this._handlerType, route, {
      onMessage: (message : any) => alert(message) //TODO make something cleaner...
    });
  }

  /**
   * Sends a message.
   */
  private _send(message : any) {
    let route : string = '/chat.group.message'; //TODO change
    this._websocketService.send(this._handlerType, route, message);
  }
}
