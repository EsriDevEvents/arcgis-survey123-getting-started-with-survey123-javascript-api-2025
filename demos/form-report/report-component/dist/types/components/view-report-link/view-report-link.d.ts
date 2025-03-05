/**
 * Deprecated!
 */
import { EventEmitter } from '../../stencil-public-runtime';
export declare class ViewReportLink {
    viewReportLinkClicked: EventEmitter;
    checkingList: string[];
    langTasks: any;
    private stateService;
    componentWillLoad(): Promise<void>;
    private linkClicked;
    render(): any;
}
