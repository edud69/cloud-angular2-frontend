/**
 * Websocket connection callback.
 */
export interface IWebsocketConnectionCallback {
  onConnectionEstablished() : void;
  onConnectionClose() : void;
}
