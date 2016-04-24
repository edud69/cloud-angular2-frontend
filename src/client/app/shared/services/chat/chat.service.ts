import {Injectable} from 'angular2/core';

import {ChatMessage} from '../../models/chat/chat-message.model';
import {GroupChatMessage} from '../../models/chat/group-chat-message.model';
import {PrivateChatMessage} from '../../models/chat/private-chat-message.model';
import {TypingAction} from '../../models/chat/typing-action.model';

import {LoggerService} from '../logger/logger.service';
import {WebsocketHandlerType, WebsocketService,
     IWebsocketConnectionCallback} from '../websocket/websocket.service';
import {WebsocketHandlerService} from '../websocket/websocketHandler.service';

export interface IChatMessageCallback {
  onReceive(message : any) : void;
}

const CHAT_PUBLIC_SEND_ROUTE_PREFIX : string = '/app/chat.group.message';
const CHAT_USER_SEND_ROUTE_PREFIX : string = '/app/chat.private.message';
const CHAT_TYPINGACTION_SEND_ROUTE_PREFIX : string = '/app/chat.action.typing';

const CHAT_TOPIC_SUBCRIPTION_PREFIX : string = '/topic/chat';
const CHAT_QUEUE_SUBSCRIPTION_PREFIX : string = '/user/queue/chat';
const CHAT_QUEUE_SUBSCRIPTION_TYPINGACTION_PREFIX : string = '/user/queue/chat.action.typing';
const CHAT_TOPIC_SUBSCRIPTION_TYPINGACTION_PREFIX : string = '/topic/chat.action.typing';


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
  sendChat(channelName : string, message : string) {
    let msgToSend : GroupChatMessage =
      new GroupChatMessage(message, 'I_AM_SENDER_USER', channelName); //TODO get user from jwt
    this._sendMessage(msgToSend, false);
  }

  /**
   * Sends a chat to a specific user.
   */
  sendPrivateChat(targetUsername : string, message : string) {
    let msgToSend : any =
      new PrivateChatMessage(message, 'I_AM_THE_SENDER', targetUsername); //TODO get user from jwt
    this._sendMessage(msgToSend, true);
  }

  /**
   * Notify a user that current user is typing.
   */
  notifyTypingToUser(usernameToNotify : string) {
    let typingActionMsg : TypingAction =//TODO get current username from jwt token store
      new TypingAction('I_AM_SENDER_USER', null, usernameToNotify);
    super._send(CHAT_TYPINGACTION_SEND_ROUTE_PREFIX, typingActionMsg);
  }

  /**
   * Notify a channel that current user is typing.
   */
  notifyTypingActionToChannel(channelName : string) {
    let typingActionMsg : TypingAction =
      new TypingAction('I_AM_THE_SENDER', channelName, null);//TODO get current username from jwt token store
    super._send(CHAT_TYPINGACTION_SEND_ROUTE_PREFIX, typingActionMsg);
  }

  /**
   * Joins a chat channel.
   */
  join(channelName : string, callback : IChatMessageCallback) {
    let forwardCallback : any = {
      onMessage: (message : any) => callback.onReceive(message)
    };

    super._subscribe(CHAT_TOPIC_SUBCRIPTION_PREFIX + '/' + channelName, forwardCallback);
    super._subscribe(CHAT_TOPIC_SUBSCRIPTION_TYPINGACTION_PREFIX + '/' + channelName, forwardCallback);
  }

  /**
   * Joins the personal chat queue.
   */
  joinPersonalChat(callback : IChatMessageCallback) {
    let forwardCallback : any = {
      onMessage: (message : any) => callback.onReceive(message)
    };

    super._subscribe(CHAT_QUEUE_SUBSCRIPTION_PREFIX, forwardCallback);
    super._subscribe(CHAT_QUEUE_SUBSCRIPTION_TYPINGACTION_PREFIX, forwardCallback);
  }

  /**
   * Leave the personal chat queue.
   */
  leavePersonalChat() {
    super._unsubscribe(CHAT_QUEUE_SUBSCRIPTION_PREFIX);
    super._unsubscribe(CHAT_QUEUE_SUBSCRIPTION_TYPINGACTION_PREFIX);
  }

  /**
   * Leaves a chat channel.
   */
  leave(channelName : string) {
    super._unsubscribe(CHAT_TOPIC_SUBCRIPTION_PREFIX + '/' + channelName);
    super._unsubscribe(CHAT_TOPIC_SUBSCRIPTION_TYPINGACTION_PREFIX + '/' + channelName);
  }

  /**
   * Sends a message.
   */
  protected _sendMessage(message : ChatMessage, isPrivateChat : boolean) {
    if(isPrivateChat) {
      super._send(CHAT_USER_SEND_ROUTE_PREFIX, message);
    } else {
      super._send(CHAT_PUBLIC_SEND_ROUTE_PREFIX, message);
    }
  }
}
