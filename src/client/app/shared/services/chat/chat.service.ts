import { Injectable, OnDestroy } from '@angular/core';

import { BaseModel, ChatMessage, GroupChatMessage, ParticipantJoinEvent, ParticipantLeaveEvent,
         PrivateChatMessage, TypingAction, IChatMessageCallback,
         AuthTokenService, LoggerService, WebsocketHandlerType,
         WebsocketService, IWebsocketConnectionCallback, WebsocketHandlerService, IWebsocketRouteSubscription } from '../../index';

const CHAT_PUBLIC_SEND_ROUTE_PREFIX : string = '/app/chat.group.message';
const CHAT_USER_SEND_ROUTE_PREFIX : string = '/app/chat.private.message';
const CHAT_TYPINGACTION_SEND_ROUTE_PREFIX : string = '/app/chat.action.typing';

const CHAT_TOPIC_SUBCRIPTION_PREFIX : string = '/topic/tenant.?-chat';
const CHAT_TOPIC_SUBCRIPTION_PARTICIPANTS_PREFIX : string = '/topic/tenant.?-chat.participants';
const CHAT_QUEUE_SUBSCRIPTION_PREFIX : string = '/user/queue/tenant.?-chat';
const CHAT_QUEUE_SUBSCRIPTION_TYPINGACTION_PREFIX : string = '/user/queue/tenant.?-chat.action.typing';
const CHAT_TOPIC_SUBSCRIPTION_TYPINGACTION_PREFIX : string = '/topic/tenant.?-chat.action.typing';


/**
 * Chat service.
 */
@Injectable()
export class ChatService extends WebsocketHandlerService implements OnDestroy {

  private _personalChatSubs : IWebsocketRouteSubscription[] = [];

  private _publicChannelSubs : {[channelName : string] : IWebsocketRouteSubscription[]} = {};

  /**
   * Ctor.
   */
  constructor(_loggerService : LoggerService, _websocketService : WebsocketService,
    private _authTokenService : AuthTokenService) {
    super(_loggerService, _websocketService);
  }

  /**
   * On destroy.
   */
  ngOnDestroy() {
    this._freeResources();
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
    return '<%= BACKEND_API.CHATSERVICE_API_connect %>';
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
    this._freeResources();
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
      new GroupChatMessage(message, this._resolveCurrentUser(), channelName);
    this._sendMessage(msgToSend, false);
  }

  /**
   * Sends a chat to a specific user.
   */
  sendPrivateChat(targetUsername : string, message : string) {
    let msgToSend : any =
      new PrivateChatMessage(message, this._resolveCurrentUser(), targetUsername);
    this._sendMessage(msgToSend, true);
  }

  /**
   * Notify a user that current user is typing.
   */
  notifyTypingToUser(usernameToNotify : string) {
    let typingActionMsg : TypingAction =
      new TypingAction(this._resolveCurrentUser(), null, usernameToNotify);
    super._send(CHAT_TYPINGACTION_SEND_ROUTE_PREFIX, typingActionMsg);
  }

  /**
   * Notify a channel that current user is typing.
   */
  notifyTypingActionToChannel(channelName : string) {
    let typingActionMsg : TypingAction =
      new TypingAction(this._resolveCurrentUser(), channelName, null);
    super._send(CHAT_TYPINGACTION_SEND_ROUTE_PREFIX, typingActionMsg);
  }

  /**
   * Joins a chat channel.
   */
  join(channelName : string, callback : IChatMessageCallback) {
    if(this._publicChannelSubs[channelName]) {
      this._loggerService.warn('Already have subscriptions to channel: {0}.', [channelName]);
      return;
    }

    let forwardCallback : any = (message : BaseModel) => {
        if (message instanceof TypingAction) {
          callback.onTypingActionReceive(<TypingAction>message);
        } else if(message instanceof ChatMessage) {
          callback.onMessageReceive(<ChatMessage>message);
        } else if(message instanceof ParticipantJoinEvent) {
          callback.onParticipantJoin(<ParticipantJoinEvent>message);
        } else if(message instanceof ParticipantLeaveEvent) {
          callback.onParticipantLeave(<ParticipantLeaveEvent>message);
        }
    };

    let sub1 = super._subscribe(CHAT_TOPIC_SUBCRIPTION_PARTICIPANTS_PREFIX.replace('?', this._authTokenService.currentTenant())
        + '-' + channelName, forwardCallback);
    let sub2 = super._subscribe(CHAT_TOPIC_SUBCRIPTION_PREFIX.replace('?', this._authTokenService.currentTenant())
        + '-' + channelName, forwardCallback);
    let sub3 = super._subscribe(CHAT_TOPIC_SUBSCRIPTION_TYPINGACTION_PREFIX.replace('?', this._authTokenService.currentTenant())
        + '-' + channelName, forwardCallback);

    this._publicChannelSubs[channelName] = [];
    this._publicChannelSubs[channelName].push(sub1);
    this._publicChannelSubs[channelName].push(sub2);
    this._publicChannelSubs[channelName].push(sub3);
  }

  /**
   * Joins the personal chat queue.
   */
  joinPersonalChat(callback : IChatMessageCallback) {
    if(this._personalChatSubs.length > 0) {
      this._loggerService.warn('You are already subscribed to your personnal chat.');
      return;
    }

    let forwardCallback : any = (message : BaseModel) => {
        if (message instanceof TypingAction) {
          callback.onTypingActionReceive(<TypingAction>message);
        } else if (message instanceof ChatMessage) {
          callback.onMessageReceive(<ChatMessage>message);
        }
    };

    let sub1 = super._subscribe(CHAT_QUEUE_SUBSCRIPTION_PREFIX.replace('?', this._authTokenService.currentTenant()),
        forwardCallback);
    let sub2 = super._subscribe(CHAT_QUEUE_SUBSCRIPTION_TYPINGACTION_PREFIX.replace('?', this._authTokenService.currentTenant()),
      forwardCallback);

    this._personalChatSubs.push(sub1);
    this._personalChatSubs.push(sub2);
  }

  /**
   * Leave the personal chat queue.
   */
  leavePersonalChat() {
    this._personalChatSubs.forEach(sub => sub.unsubscribe());
  }

  /**
   * Leaves a chat channel.
   */
  leave(channelName : string) {
    this._unsubscribeFromChannelChat(channelName);
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

  /**
   * Returns the current username.
   */
  private _resolveCurrentUser() : string {
    return this._authTokenService.currentUsername();
  }

  /**
   * Unsubscribes from a channel.
   */
  private _unsubscribeFromChannelChat(channelName : string) {
    let subs = this._publicChannelSubs[channelName];
    if(subs) {
      subs.forEach(sub => sub.unsubscribe());
      delete this._publicChannelSubs[channelName];
    } else {
      this._loggerService.warn('Leaving a channel where no subscriptions exists. Channel: {0}.', [channelName]);
    }
  }

  /**
   * Free the resources.
   */
  private _freeResources() {
    this.leavePersonalChat();
    for(let channel in this._publicChannelSubs) {
      this.leave(channel);
    }

    this.closeSession();
  }
}
