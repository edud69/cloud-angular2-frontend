import { WebsocketHandlerType, LoggerService, BaseModel, IWebsocketRouteSubscription,
         UnmappedServerResponse, JsonModelConverter, RandomUtils, IWebsocketHandler } from '../../../index';

import { WebsocketRegistryManager } from './websocket-registry.manager';

/**
 * Manager for websocket route subscriptions.
 */
export class WebsocketRouteSubscriptionManager {

    constructor(private _loggerService: LoggerService, private _websocketRegistryManager: WebsocketRegistryManager) { }


    /**
     * Subscribes a websocket handler to a given route.
     */
    subscribe(wsHandlerType: WebsocketHandlerType, route: string,
        subscriber: ((message: BaseModel) => void)): IWebsocketRouteSubscription {
        let wsHandler: any = this._websocketRegistryManager.getWebsocketHandler(wsHandlerType);
        if (!wsHandler) {
            this._loggerService.error('Cannot subscribe websocket handler ({0}) to route ({1}). The websocket handler is not registered.',
                [WebsocketHandlerType[wsHandlerType], route]);
            return { unsubscribe: () => {/*nothing*/ } };
        }

        return this._doSubscribe(wsHandler, route, subscriber);
    }

    /**
     * Subscribes to the route.
     */
    private _doSubscribe(wsHandler: IWebsocketHandler, route: string,
        subscriber: ((message: BaseModel) => void)): IWebsocketRouteSubscription {
        if (wsHandler.subscriptionRoutes[route]) {
            wsHandler.subscriptionRoutes[route].sub.unsubscribe();
            this._loggerService.warn('A subscription exists on the same route ({0}) for wsHandlerType ({1}).' +
                'The previous subscription has been removed',
                [route, WebsocketHandlerType[wsHandler.type]]);
        }

        let subscription = this._createStompSubscription(wsHandler, route, subscriber);
        let uniqueKey = RandomUtils.randomString(12);

        wsHandler.subscriptionRoutes[uniqueKey] = { route: route, sub: subscription };

        return {
            unsubscribe: () => {
                let handler = wsHandler.subscriptionRoutes[uniqueKey];
                if (handler) {
                    handler.sub.unsubscribe();
                    delete wsHandler.subscriptionRoutes[uniqueKey];
                }
            }
        };
    }

    /**
     * Binds the subscriber in parameter to the stomp subscription.
     */
    private _createStompSubscription(wsHandler: IWebsocketHandler, route: string, subscriber: ((message: BaseModel) => void)): any {
        return wsHandler.client.subscribe(route, (message: any) => {
            if (message && message.body) {
                subscriber(this._convert(message));
            } else {
                this._loggerService.error('Invalid message payload received : {0}.', [message]);
            }
        });
    }

    /**
     * Converts to a managed model.
     */
    private _convert(message: any): BaseModel {
        let model: BaseModel;
        try {
            model = JsonModelConverter.fromJson(JSON.parse(message.body));
        } catch (ex) {
            this._loggerService.warn('Message payload cannot be mapped to BaseModel object : {0}. Details: {1}.', [message, ex]);
            model = new UnmappedServerResponse(JSON.parse(message.body));
        }
        return model;
    }

}
