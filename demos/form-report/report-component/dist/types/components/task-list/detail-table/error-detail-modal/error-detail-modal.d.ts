export declare class ErrorDetailModal {
    job: any;
    open: boolean;
    maxFailedOIDLength: number;
    modal: any;
    errorModalMaxHeight: number;
    private langTasks;
    langCommon: any;
    private utilService;
    componentWillLoad(): Promise<void>;
    componentDidRender(): void;
    private updateFailedOIDlength;
    render(): any;
}
