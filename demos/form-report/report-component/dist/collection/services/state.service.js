/**
 * StateService
 * components can call notifyDataChanged to brodcast event, call subscribe function to register event
 */
import { Subject } from "rxjs";
/**
 * StateService
 * hook event and trigger callback
 */
export class StateService {
    /**
     * static variable
     */
    static getService() {
        if (!StateService.instance) {
            StateService.instance = new StateService();
        }
        return StateService.instance;
    }
    /**
     * constructor
     */
    constructor() {
        this._data = new Subject();
        this._dataStream$ = this._data.asObservable();
        this._subscriptions = new Map();
        this._dataStream$.subscribe((data) => this._onEvent(data));
    }
    /**
     * notifyDataChanged
     * @param event
     * @param value
     * @param ignoreSameValueEvent
     */
    notifyDataChanged(event, options) {
        // options
        options = Object.assign({
            value: null,
            ignoreSameValueEvent: false
        }, options || {});
        const current = this._data[event];
        if (options.ignoreSameValueEvent && current !== options.value) {
            return;
        }
        this._data[event] = options.value;
        this._data.next({
            event: event,
            data: this._data[event]
        });
    }
    /**
     * notifyDataChangedByName
     * @param name
     * @param value
     * @param ignoreSameValueEvent
     */
    notifyDataChangedByName(name, options) {
        if (this._subscriptions.size > 0) {
            const keys = this._subscriptions.keys();
            let k = keys.next();
            while (!k.done) {
                if (k.value.indexOf(name) !== -1) {
                    this.notifyDataChanged(k.value, options);
                }
                k = keys.next();
            }
        }
    }
    /**
     * subscribe
     * @param event
     * @param callback
     */
    subscribe(event, callback) {
        const subscribers = this._subscriptions.get(event) || [];
        subscribers.push(callback);
        this._subscriptions.set(event, subscribers);
        const returnObj = {};
        if (event) {
            returnObj[event] = callback;
        }
        return returnObj;
    }
    /**
     * delete the subscribe, suggest to call this method when component destroy
     * @param subscribeObj
     */
    unSubscribe(subscribeObj) {
        if (!subscribeObj) {
            return;
        }
        for (const event in subscribeObj) {
            if (Object.prototype.hasOwnProperty.call(subscribeObj, event)) {
                if (event && event.length) {
                    const subscribers = this._subscriptions.get(event) || [];
                    const callback = subscribeObj[event];
                    for (let i = 0; i < subscribers.length; i++) {
                        if (callback === subscribers[i]) {
                            subscribers.splice(i, 1);
                        }
                    }
                    this._subscriptions.set(event, subscribers);
                    /**
                     * if there is no subscribers
                     * delete event in _subscriptions
                     */
                    if (subscribers.length === 0) {
                        this._subscriptions.delete(event);
                    }
                }
                return;
            }
        }
    }
    // /**
    //  * Tool: add register a subscribe event to a given group(object), usually, this is usefull to manage all
    //  * subscribe listeners in a component 
    //  * @param group 
    //  * @param eventName 
    //  * @param callback 
    //  */
    // public addSubscribeToGroup(groupObj: any, eventName, callback) {
    //   if (!groupObj) {
    //     groupObj = {};
    //   }
    //   if (!(groupObj instanceof Object && !(Array.isArray(groupObj)))) {
    //     groupObj = {};
    //   }
    //   if (!eventName || !callback) {
    //     return;
    //   }
    //   groupObj[eventName] = this.subscribe(eventName, callback);
    // }
    // /**
    //  * Tool: remove all the subscribes which are in a group(object)
    //  * @param groupObj 
    //  */
    // public clearSubscribesInGroup(groupObj: any) {
    //   if (!groupObj || !(groupObj instanceof Object && !(Array.isArray(groupObj)))) {
    //     return;
    //   }
    //   try {
    //     // tslint:disable-next-line:forin
    //     for (const key in groupObj) {
    //       this.unSubscribe(groupObj[key]);
    //     }
    //     groupObj = {};
    //   } catch (e) {
    //     console.log('un-subscribe event error.');
    //   }
    // }
    _onEvent(data) {
        const subscribers = this._subscriptions.get(data['event']) || [];
        subscribers.forEach((callback) => {
            callback.call(null, data['data']);
        });
    }
}
//# sourceMappingURL=state.service.js.map
