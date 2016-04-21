import {Injectable} from 'angular2/core';
import * as Stomp from 'stompjs';

import {AuthTokenService} from './auth-token.service';
import {LoggerService} from './logger.service';

export enum WebsocketHandlerType {
  CHAT_WEBSOCKET_HANDLER
};

@Injectable()
export class WebsocketService {

  private _websocketHandlers : any = {};

  constructor(private _loggerService : LoggerService, private _authTokenService : AuthTokenService) {}
  
  connect(WebsocketHandlerType : websocketHandlerType, string : url) {
    let client = this.getWebsocketHandler(websocketHandlerType);
    //TODO check if client == null
    //TODO check if client is already connected...
    
    let accessToken : string = this._authTokenService.getAccessToken(); 
    let client : any = Stomp.overWS(url + '?token=' + accessToken);
    //TODO check how to connect + maybe pass token in header instead of url param: http://jmesnil.net/stomp-websocket/doc/
    this.register(websocketHandlerType, client);
  }

  disconnect(WebsocketHandlerType : websocketHandlerType) {
    let client : any = this.getWebsocketHandler(wsHandlerType);
    if(client == null) {
      //TODO
      return;
    }
    
    client.disconnect(function() {
      //TODO callback
    });
    
    this.unregister(websocketHandlerType);
  }

  send(WebsocketHandlerType : wsHandlerType, string : route, any : payload) {
    let client : any = this.getWebsocketHandler(wsHandlerType);
    if(client == null) {
      //TODO
      return;
    }
    
    client.send(route, payload);
  }

  private subscribe(WebsocketHandlerType : wsHandlerType, string : route) {
    let client : any = this.getWebsocketHandler(wsHandlerType);
    if(client == null) {
      //TODO log...
      return;
    }
    
    client.subscribe(route, function(callback) {
      //CALLBACK TODO
    });
  }

  private getWebsocketHandler(WebsocketHandlerType : wsHandlerType) : any {
    return this._websocketHandlers[wsHandlerType];
  }

  private register(WebsocketHandlerType : wsHandlerType, any : wsHandler) {
    this._websocketHandlers[wsHandlerType] = wsHandler;
  }

  private unregister(WebsocketHandlerType : wsHandlerType) {
    this._websocketHandlers[wsHandlerType] = null;
  }
}
