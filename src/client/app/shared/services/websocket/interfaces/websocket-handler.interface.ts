import { IWebsocketConnectionCallback, WebsocketHandlerType } from '../../../index';
import { Client } from 'stompjs';

/**
 * Websocket handler.
 */
export interface IWebsocketHandler {
  type: WebsocketHandlerType;
  client : Client;
  subscriptionRoutes: { [uniqueKey: string] : { route : string, sub: any} };
  connectionStateSubscriber: IWebsocketConnectionCallback;
}
