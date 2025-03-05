/**
 * This class aims to store the shared props
 */
export declare class PropsService {
    /**
     * report parameters
     * all the paraemters are listed in: https://devtopia.esri.com/Beijing-R-D-Center/feature-report/issues/505#issuecomment-4495107
     */
    static token: string;
    static portalUrl?: string;
    static apiUrl?: string;
    static featureLayerUrl: string;
    static surveyItemId?: string;
    static templateItemId?: string;
    static queryParameters: string;
    static mergeFiles: 'none' | 'nextPage' | 'continuous';
    static outputFormat: string;
    static outputReportName: string;
    static outputPackageName: string;
    static packageFiles: boolean | string;
    static uploadInfo: string;
    static webmapItemId: string;
    static mapScale: string;
    static locale?: string;
    static utcOffset?: string;
    static reportTemplateIds?: string;
    static clientId?: string;
    static requestSource: string;
    /**
     * the following parameters are geneareted by the main parameters, ie:
     * the where is genereated from queryParameters
     * the username is generated from token
     */
    static where: string;
    static username?: string;
    /**
     * ui parameters
     */
    static show: string;
    static hide: string;
    static inputFeatureTemplate: string;
    static label: string;
    static paramesWhitelist: string[];
    /**
     * set props
     * @param obj
     */
    static setProps(obj: any): void;
    /**
     * get locale
     * @returns
     */
    static getLocale(options?: {
        userDefinedLocale?: string;
        userInfo?: any;
        portalInfo?: any;
    }): string;
    /**
    * convert the provided language code to the supported language code
    * @param lang
    */
    static convertToSupportedLang(lang: any): string;
}
