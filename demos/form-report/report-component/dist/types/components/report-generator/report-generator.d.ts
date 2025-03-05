import { EventEmitter } from '../../stencil-public-runtime';
export declare class ReportGenerator {
    private isPortal;
    private batchPrintLimitCount;
    private canShowEstimateCredits;
    featureCount: number;
    supportShowCredits: boolean;
    printTemplates: any[];
    langObj: any;
    creditsInfo: any;
    creditStatus: string;
    testModeJobObj: any;
    isTestModePrinting: boolean;
    visibleConf: any;
    templateItemId: string;
    isPrinting: boolean;
    private checkingList;
    reportCreated: EventEmitter<any>;
    translator: any;
    private queryJobTimmer;
    private reportService;
    private utilService;
    private state;
    componentWillLoad(): Promise<void>;
    checkPrivilige(): void;
    estimateCredits(): void;
    /**
     * check the clickable of the generate button
     * @returns
     */
    buttonClickable(): boolean;
    executeCustomPrint(isTestMode?: boolean): Promise<void>;
    /**
     * check the job status of the preview job
     * @returns
     */
    watchTestModeJob(): void;
    render(): any;
}
