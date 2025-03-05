import { IRequestOptions } from "@esri/arcgis-rest-request";
export declare class UtilService {
    static service: UtilService;
    isPortal: boolean;
    private portalInfo;
    private svgCache;
    /**
     * get Service
     * @returns
     */
    static getService(): UtilService;
    /**
     * get portalInfo
     */
    getPortalInfo(): Promise<any>;
    getUser(): any;
    setDir(): void;
    /**
     *
     * @param surveyItemId
     * @returns
     */
    getSurveyItemInfo(surveyItemId: string): Promise<import("@esri/arcgis-rest-portal").IItem>;
    /**
     * getBaseRequestOptions
     * @returns
     */
    getBaseRequestOptions(): IRequestOptions;
    /**
     * supportFeatureReport
     * @returns
     */
    supportFeatureReport(): boolean;
    /**
     * format fieldtype
     * @param fieldType
     * @param val
     * @returns
     */
    formatFieldVal(field: any, val: any): any;
    /**
     * is number field type
     * @param field
     * @returns
     */
    isNumberField(field: any): boolean;
    /**
     * format number
     * @param num
     */
    formatNumber(num: any): string;
    /**
     * format date/time/datetime
     * @param date
     * @param type
     * @param options
     */
    formatDateTime(date: Date | 'string' | 'number', type?: 'date' | 'time' | 'datetime'): string;
    /**
     * But need to check the new percentage pipe support to show the value like 99.999999999%
     * @param percent
     * @param returnNumber
     */
    getPercentage(job: any, percent?: number, returnNumber?: boolean): string | number;
    /**
     * getFileSize
     * @param bytes
     * @returns
     */
    getFileSize(bytes: any): string;
    extractPlaceholders(exp: string): any[];
    /**
     * parse markdown,
     * eg: convert 'Failed to parse `${tag}` and `${tag}`' to 'Failed to parse <i>${tag}</i> and <i>${tag}</i>'
     */
    parseMarkdown(html: string): string;
    /**
     * check if the currrent user has the privilige: premium:user:featurereport
     */
    isUserCanPrintFeatureReport(): boolean;
    /**
     * set the svg cache
     * @param obj
     */
    setSvgCache(key: any, svgStr: string): void;
    /**
    * get svg cache
    * @param key
    * @returns
    */
    getSvgCache(key?: string): any;
    /**
    * compare version
    * -1: a < b
    * 0: a = b
    * 1: a > b
    * @param a
    * @param b
    */
    private compareVersion;
    /**
     * get rest api version by portalVersion
     * portal    rest version
     * 10.7   >> 6.4
     * 10.6   >> 5.3
     * 10.5.2 >> 5.2
     * 10.5.1 >> 5.1
     * 10.5.0 >> 4.4
     * 10.4.0 >> 3.10
     */
    private getRestApiVersion;
}
