/**
 * StateService
 * hook event and trigger callback
 */
export declare class StateService {
    /**
     * static variable
     */
    static getService(): StateService;
    /**
     * private variables
     */
    private static instance;
    private _data;
    private _dataStream$;
    private _subscriptions;
    /**
     * constructor
     */
    private constructor();
    /**
     * notifyDataChanged
     * @param event
     * @param value
     * @param ignoreSameValueEvent
     */
    notifyDataChanged(event: string, options?: {
        value?: any;
        ignoreSameValueEvent?: boolean;
    }): void;
    /**
     * notifyDataChangedByName
     * @param name
     * @param value
     * @param ignoreSameValueEvent
     */
    notifyDataChangedByName(name: string, options?: {
        value?: any;
        ignoreSameValueEvent?: boolean;
    }): void;
    /**
     * subscribe
     * @param event
     * @param callback
     */
    subscribe(event: string, callback: any): {};
    /**
     * delete the subscribe, suggest to call this method when component destroy
     * @param subscribeObj
     */
    unSubscribe(subscribeObj: any): void;
    private _onEvent;
}
