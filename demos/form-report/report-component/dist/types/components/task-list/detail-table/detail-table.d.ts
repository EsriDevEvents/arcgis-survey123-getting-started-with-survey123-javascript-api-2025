export declare class ReportDetailTable {
    job: any;
    errorMsg: string;
    host: HTMLElement;
    private langTasks;
    statusI18nConfig: any;
    componentWillLoad(): Promise<void>;
    getPercentage(p: any): string | number;
    /**
     * open the error detailed modal
     */
    private errorDetailModalOpen;
    /**
     * open the success detailed modal
     */
    private succeedDetailModalOpen;
    render(): any;
}
