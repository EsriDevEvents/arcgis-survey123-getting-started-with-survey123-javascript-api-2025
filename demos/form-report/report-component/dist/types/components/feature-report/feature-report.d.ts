import { EventEmitter } from '../../stencil-public-runtime';
export declare class FeatureReport {
    token: string;
    portalUrl?: string;
    apiUrl?: string;
    featureLayerUrl: string;
    surveyItemId?: string;
    templateItemId?: string;
    templateItemIdChanged(newVal: any): void;
    queryParameters: string;
    queryParametersChanged(newVal: any): Promise<void>;
    mergeFiles: 'none' | 'nextPage' | 'continuous';
    mergeFilesChanged(newVal: any): void;
    outputFormat: string;
    outputFormatChanged(newVal: any): void;
    outputReportName: string;
    outputPackageName: string;
    packageFiles: boolean | string;
    uploadInfo: string;
    webmapItemId: string;
    mapScale: string;
    locale?: string;
    localeChanged(newVal: any): void;
    utcOffset?: string;
    /**
     * ui parameters
     */
    show: string;
    showChanged(newValue: any): void;
    hide: string;
    hideChanged(newVal: any): void;
    inputFeatureTemplate: string;
    inputFeatureTemplateChanged(newVal: any): void;
    label: string;
    labelChanged(newVal: any): Promise<void>;
    reportTemplateIds: string;
    reportTemplateIdsChanged(newVal: any): void;
    clientId: string;
    requestSource: string;
    requestSourceChanged(newVal: any): void;
    userInfoGetted: EventEmitter<any>;
    i18nStringUpdated: EventEmitter<any>;
    _credentialGetted: EventEmitter<any>;
    /**
     * the following parameters are geneareted by the main parameters, ie:
     * the where is genereated from queryParameters
     * the username is generated from token
     */
    where: string;
    username?: string;
    state: string;
    visibleConf: string[];
    checkingList: string[];
    jobs: any[];
    error: any;
    langTasks: any;
    langCommon: any;
    langCustomPrint: any;
    surveyItemInfo: any;
    private stateService;
    private reportService;
    componentWillLoad(): Promise<boolean | void>;
    /**
     * init the component
     * before enter in this function, the token prop must be ready
     */
    init(): Promise<void>;
    /**
     * todo: when the component is embeded in an iframe, will hit the same-origin policy problem:
     * the beginOAuth2 is called in iframe, it will write some info(stateId) to localStorage, but the completeOAuth2 will called in a stanalone page, it cann't read the stateId.
     * @returns
     */
    startLogin(): Promise<boolean>;
    isOAuthCallbackpage(): boolean;
    /**
     * locale change handler
     * @param newLocale
     * @returns
     */
    localeChangeHandler(newLocale: any): Promise<boolean>;
    /**
     * get visible elements
     * @returns
     */
    generateVisibleElems(): any[];
    switchState(state: any): void;
    /**
     * update template list
     * @returns
     */
    updateTemplateList(): Promise<void>;
    generateReportHander(evt: any): void;
    render(): any;
}
