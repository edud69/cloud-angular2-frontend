import { Injectable, OnDestroy } from '@angular/core';

import { IEvent, IEventSubscription, RandomUtils } from '../../index';

@Injectable()
export class EventService implements OnDestroy {

    private _subscribers : {[key : string] : {[key:string] : IEventSubscription<any>}} = {};

    ngOnDestroy() {
        for(let eventKey in this._subscribers) {
            let subs = this._subscribers[eventKey];
            for(let subKey in subs) {
                subs[subKey].unsubscribe();
            }
        }
    }

    emit(event : IEvent) {
        let eventSubs = this._subscribers[event.constructor.name];
        if(eventSubs) {
            for(let key in eventSubs) {
                (<any>eventSubs[key]).callback(event);
            }
        }
    }

    subscribe<T extends IEvent>(subscriber : ((received : T) => void), eventType : new () => T) : IEventSubscription<T> {
        let eventKey = new eventType().constructor.name;
        let subscriberKey = RandomUtils.randomString(12);
        let sub = this._buildSubscription(subscriber, subscriberKey, eventKey);
        this._addSubscription(sub, subscriberKey, eventKey);
        return sub;
    }

    private _buildSubscription<T extends IEvent>(subscriber : (received : T) => void, subscriberKey : string, eventKey : string)
                : IEventSubscription<T> {
        let sub : IEventSubscription<T> = { unsubscribe: () => this._removeSubscription(eventKey, subscriberKey) };
        (<any>sub).callback = subscriber;
        return sub;
    }

    private _removeSubscription(eventType : string, subscriberKey : string) {
        let eventSubs = this._subscribers[eventType];
        if(eventSubs) {
            delete eventSubs[subscriberKey];
            let count = 0;
            for(let key in eventSubs) {
                if(key) {
                    count++;
                }
            }
            if(count === 0) {
                delete this._subscribers[eventType];
            }
        }
    }

    private _addSubscription(subscription : IEventSubscription<any>, subscriberKey : string, eventKey : string) {
        let subs = this._subscribers[eventKey];
        if(!subs) {
            subs = {};
            this._subscribers[eventKey] = subs;
        }

        subs[subscriberKey] = subscription;
    }
}
