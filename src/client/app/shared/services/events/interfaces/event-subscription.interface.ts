import { IEvent } from '../../../index';

export interface IEventSubscription<T extends IEvent> {
    unsubscribe() : void;
}
