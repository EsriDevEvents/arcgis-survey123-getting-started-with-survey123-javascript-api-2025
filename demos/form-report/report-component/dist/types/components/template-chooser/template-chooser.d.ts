import { EventEmitter } from '../../stencil-public-runtime';
export declare class TemplateChooser {
    langObj: any;
    selectedTemplateId: any;
    selectedTemplateIdChanged(): void;
    templateIds: string;
    templateIdsChanged(): void;
    element: HTMLElement;
    selectedTemplateChange: EventEmitter<any>;
    templates: any[];
    translator: any;
    private reportService;
    private stateService;
    componentWillLoad(): Promise<boolean | void>;
    init(): Promise<boolean | void>;
    /**
     *
     * @param evt
     */
    selectedTemplateChangeHandler(evt: any): void;
    render(): any;
}
