import { EventEmitter } from '../../stencil-public-runtime';
export declare class ReportTaskList {
    goBackClicked: EventEmitter;
    langReport: any;
    langCommon: any;
    langTasks: any;
    state: 'loading' | 'ready';
    jobs: any[];
    recentTasksCount: number;
    private jobList;
    private reportService;
    private stateService;
    private utilService;
    componentWillLoad(): void;
    jobSplitDate(job: any, index: number): string;
    private goBack;
    private removeJob;
    render(): any;
}
