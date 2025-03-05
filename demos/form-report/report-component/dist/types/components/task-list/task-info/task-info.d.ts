import { EventEmitter } from '../../../stencil-public-runtime';
export declare class ReportTaskInfo {
    job: any;
    showDetail: string;
    detailedStatus: string;
    detailedStatusEle: string;
    isWaitingToConfirmRemove: boolean;
    isRemoving: boolean;
    isCanceling: boolean;
    jobRemoved: EventEmitter<any>;
    host: HTMLElement;
    isRTL: boolean;
    jobId: string;
    private langTasks;
    private langCommon;
    statusI18nConfig: any;
    maxFailedOIDLength: number;
    private utils;
    private reportService;
    private stateService;
    componentWillLoad(): Promise<void>;
    getPercentage(p: any): string | number;
    updateJobStatusString(): void;
    getDuration(start: any, end: any, cancelled?: any): string;
    showDetailHandler(): void;
    hideDetail(): void;
    /**
     * execute removing job
     * @param job
     */
    executeRemoveJob(job: any): void;
    /**
     * cancel removing job
     * @param job
     */
    cancelRemoveJob(): void;
    /**
     * remove job
     * @param job
     */
    startRemoveJob(): void;
    private startCancelJob;
    render(): any;
}
