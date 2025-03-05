export declare enum EsriJobStatusType {
    submitted = "esriJobSubmitted",
    executing = "esriJobExecuting",
    succeeded = "esriJobSucceeded",
    partialSucceeded = "esriJobPartialSucceeded",
    failed = "esriJobFailed",
    cancelled = "esriJobStatusCancelled"
}
export declare class ReportService {
    static service: ReportService;
    checkingList: any[];
    isRequestingTasks: boolean;
    jobList: any;
    private queryJobTimmer;
    private sessionJobs;
    private templateItemsCache;
    private stateService;
    private paramCache;
    private helperObj;
    /**
     * get Service
     * @returns
     */
    static getService(): ReportService;
    /**
     * get the report parameter cache
     * @param key
     */
    getParamCache(key?: string): any;
    /**
     * set the report parameter cache
     * @param obj
     */
    setParamCache(obj: any): void;
    initParamCache(): void;
    /**
     * get the report parameter cache
     * @param key
     */
    getHelperObj(key?: string): any;
    /**
     * set the report parameter cache
     * @param obj
     */
    setHelperObj(obj: any): void;
    /**
     * getReportTemplates
     * @param surveyItemId
     */
    getReportTemplates(surveyItemId: string, options?: {
        templateIds?: string;
    }): Promise<any[]>;
    /**
     * get layer json
     * @param layerUrl
     */
    getLayerJson(layerUrl?: string): Promise<any>;
    /**
     * get feature count
     * @returns
     */
    getFeatureCount(): Promise<void>;
    /**
     * get custom printing file url (e.g. word)
     * @param itemId: String
     * @return string
     */
    getCustomPrintingFileUrl(itemId: string): string;
    /**
     * estimate report costs
     * @param options
     */
    estimateReportCosts(options: any): Promise<any>;
    /**
     * print report
     */
    executeReport(options: any): Promise<any>;
    /**
   * createSampleReport
   * @param options
   */
    createSampleReport(options: any): Promise<any>;
    /**
   * remove job
   * @param jobId
   * @returns
   */
    removeJob(jobId: any): Promise<any>;
    cancelJob(jobId: any): Promise<any>;
    /**
     * Deprecated, remove job from the job list
     * @param job
     * @returns
     */
    removeJobFromList(job: any): void;
    /**
     * query jobs
     * @param forceQuery
     * @returns
     */
    queryJobs(forceQuery?: boolean): Promise<any>;
    /**
     * check all the jobs, if any job is failed, and it has no details, call the status api to get the details
     */
    checkJobListDetails(): void;
    /**
     * check job detail, if the job is failed, and it has no details, call the status api to get the details
     */
    checkJobDetails(job: any): Promise<any>;
    /**
     * query job list
     */
    sendQueryJobsRequest(surveyItemId?: any): Promise<any>;
    /**
     * checkJobStatus
     */
    checkJobStatus(jobId: string): Promise<any>;
    downloadReport(job: any): void;
    /**
     * download file
     * @param jobObj
     * @param openInNewtab
     * @returns
     */
    downloadFile(jobObj: any, openInNewtab?: any): void;
    startDownload(url: string, openInNewtab?: any): void;
    getErrorStr(err: any): string;
    /**
    * show error
    * @param errorStr
    */
    showError(err: any, options?: {
        alertType?: string;
        errorStr?: string;
        detail?: any;
        showDetails?: boolean;
    }): void;
    /**
     * manage the error from server side
     * @param e
     * @param type
     */
    manageError(e: any, type: string): void;
    /**
     * update job detail
     * @param res
     * @returns
     */
    private updateJobDetail;
    /**
     * _getLocalTimezoneOffset
     */
    private _getLocalTimezoneOffset;
    /**
     * generate request headers
     * @returns
     */
    private _generateRequestHeaders;
}
