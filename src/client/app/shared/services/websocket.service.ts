import {Injectable} from 'angular2/core';
import {Stomp} from 'stompjs/lib/stomp';

import {AuthTokenService} from './auth-token.service';
import {LoggerService} from './logger.service';

export enum WebsocketHandlerType {
  CHAT_WEBSOCKET_HANDLER
};

@Injectable()
export class WebsocketService {

  private _websocketHandlers : any = {};

  constructor(private _loggerService : LoggerService, private _authTokenService : AuthTokenService) {}

  connect(websocketHandlerType : WebsocketHandlerType, url : string) {
    let wsHandler = this.getWebsocketHandler(websocketHandlerType);
    //TODO check if wsHandler == null
    //TODO check if client is already connected...

    if(wsHandler === null || wsHandler === undefined) {
      let accessToken : string = this._authTokenService.getAccessToken();
      wsHandler = Stomp.over(url + '?token=' + accessToken);
      //TODO check how to connect + maybe pass token in header instead of url param: http://jmesnil.net/stomp-websocket/doc/
      this.register(websocketHandlerType, wsHandler);
    }
  }

  disconnect(wsHandlerType : WebsocketHandlerType) {
    let client : any = this.getWebsocketHandler(wsHandlerType);
    if(client === null || client === undefined) {
      //TODO
      return;
    }

    client.disconnect(function() {
      //TODO callback
    });

    this.unregister(wsHandlerType); //TODO move this in the callback
  }

  send(wsHandlerType : WebsocketHandlerType, route : string, payload : any) {
    let client : any = this.getWebsocketHandler(wsHandlerType);
    if(client === null || client === undefined) {
      //TODO
      return;
    }

    client.send(route, payload);
  }

  subscribe(wsHandlerType : WebsocketHandlerType, route : string) {
    let client : any = this.getWebsocketHandler(wsHandlerType);
    if(client === null || client === undefined) {
      //TODO log...
      return;
    }

    client.subscribe(route, function(message : any) {
      //CALLBACK TODO
    });
  }

  private getWebsocketHandler(wsHandlerType : WebsocketHandlerType) : any {
    return this._websocketHandlers[wsHandlerType];
  }

  private register(wsHandlerType : WebsocketHandlerType, wsHandler : any) {
    this._websocketHandlers[wsHandlerType] = wsHandler;
  }

  private unregister(wsHandlerType : WebsocketHandlerType) {
    this._websocketHandlers[wsHandlerType] = null;
  }
}
