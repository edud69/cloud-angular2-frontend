import {Injectable} from 'angular2/core';

import {LoggerService} from './logger.service';
import {WebsocketHandlerType, WebsocketService} from './websocket.service';

/**
 * Chat service.
 */
@Injectable()
export class ChatService {

  constructor(private _loggerService:LoggerService, private _websocketService : WebsocketService) {}
  
  /**
   * Opens a chat session.
   */
  openSession() {
    this._websocketService.connect(
      WebsocketHandlerType.CHAT_WEBSOCKET_HANDLER,
      '<%= CHATSERVICE_API_connect %>'
      );
  }

}
