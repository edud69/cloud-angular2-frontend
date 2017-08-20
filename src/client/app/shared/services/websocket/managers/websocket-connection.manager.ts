import { Client } from 'stompjs';
import * as Stomp from 'stompjs';

import { WebsocketHandlerType, LoggerService, Config, IWebsocketHandler } from '../../../index';

import { WebsocketRegistryManager } from './websocket-registry.manager';

/**
 * Manager for websocket connections.
 */
export class WebsocketConnectionManager {

    constructor(private _loggerService: LoggerService,
        private _registryManager: WebsocketRegistryManager) { }

    /**
     * Connects to the given endpoint.
     */
    public connect(endpointUrl: string, accessToken: string, websocketHandlerType: WebsocketHandlerType,
        onConnectionSuccess: ((client: Client) => void), onConnectionError: ((client: Client) => void)) {
        let wsHandler: IWebsocketHandler = this._registryManager.getWebsocketHandler(websocketHandlerType);
        if (!wsHandler) {
            this._doConnect(endpointUrl, accessToken, websocketHandlerType, onConnectionSuccess, onConnectionError);
        } else {
            this._loggerService.warn('Websocket handler of type ({0}) was already connected to a endpoint ({1}).',
                [WebsocketHandlerType[websocketHandlerType], endpointUrl]);
        }
    }

    /**
     * Closes the connection for the given handler type.
     */
    public disconnect(wsHandlerType: WebsocketHandlerType) {
        let wsHandler = this._registryManager.getWebsocketHandler(wsHandlerType);
        if (!wsHandler) {
            this._loggerService.debug('Websocket handler of type ({0}) was already disconnected.', [WebsocketHandlerType[wsHandlerType]]);
            return;
        }

        this._registryManager.unregister(wsHandlerType);

        // close the connection
        wsHandler.client.disconnect(() => {
            wsHandler.connectionStateSubscriber.onConnectionClose();
            this._loggerService.info('Websocket handler of type ({0}) is now disconnected.', [WebsocketHandlerType[wsHandlerType]]);
        },
            (errorMessage: any) => {
                wsHandler.connectionStateSubscriber.onConnectionClose();
                this._loggerService.warn('Websocket handler of type ({0]}) failed to disconnect. Trace : {1}',
                    [WebsocketHandlerType[wsHandlerType], errorMessage]);
            });
    }

    /**
     * Creates a stomp websocket connection.
     */
    private _createStompConnection(endpointUrl: string, accessToken: string) {
        let stompOver : (ws : WebSocket) => Client = ((<any>Stomp)['Stomp'])['over'];
        return stompOver(new WebSocket(endpointUrl + '?token=' + accessToken));
    }

    /**
     * Stomp log traffic enabled.
     */
    private _isLogForStompTrafficEnabled() {
        return Config.LOG.STOMPJS_TRAFFIC_LOGGING_ENABLED;
    }

    /**
     * Attempts to connect.
     */
    private _doConnect(endpointUrl: string, accessToken: string, websocketHandlerType: WebsocketHandlerType,
        onConnectionSuccess: ((client: Client) => void), onConnectionError: ((client: Client) => void)) {
        let client: Client = this._createStompConnection(endpointUrl, accessToken);
        let headers: any = {};

        // binds to the stompjs logger
        if (this._isLogForStompTrafficEnabled()) {
            client.debug = (logMsg: string) => this._loggerService.log(logMsg);
        } else {
            client.debug = (logMsg: string) => {/* do not log */ };
        }

        client.connect(headers,
            (successMessageCallback: any) => {
                onConnectionSuccess(client);
                let wsHandler = this._registryManager.getWebsocketHandler(websocketHandlerType);
                wsHandler.connectionStateSubscriber.onConnectionEstablished();
                this._loggerService.debug('Websocket handler of type {0} is now connected.', [WebsocketHandlerType[websocketHandlerType]]);
            },
            (errorMessageCallback: any) => {
                onConnectionError(client);
                this._loggerService.error('Failed to connect websocket handler of type {0}. Trace: {1}',
                    [WebsocketHandlerType[websocketHandlerType], errorMessageCallback]);
            });
    }
}
