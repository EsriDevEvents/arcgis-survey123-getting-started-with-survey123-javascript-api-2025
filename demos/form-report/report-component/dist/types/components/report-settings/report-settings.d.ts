import { EventEmitter } from '../../stencil-public-runtime';
export declare class ReportSettings {
    mergeFiles: 'none' | 'nextPage' | 'continuous';
    outputFormat: string;
    conflictBehavior: 'rename' | 'replace' | 'fail';
    fileName: string;
    onFileNameChange(): void;
    visibleElems: string[];
    fileOptionChange: EventEmitter<any>;
    fileNameChange: EventEmitter<any>;
    selectedFolderChange: EventEmitter<any>;
    selectedFileFormatChange: EventEmitter<any>;
    private folders;
    private selectedFolder;
    translator: any;
    langReport: any;
    helperObj: any;
    featureCount: number;
    printTemplates: any[];
    private reportService;
    private state;
    componentWillLoad(): Promise<void | any[]>;
    /**
     * merge mode change: 'none' | 'nextPage' | 'continuous'
     * @param evt
     */
    fileOptChangeHandler(evt: any): void;
    /**
     * file name change handler
     * @param evt
     */
    fileNameChangeHandler(evt: any): void;
    /**
     * selected folder changed
     * @param evt
     */
    selectedFolderChangeHandler(): void;
    /**
     * selected format handlder
     * @param evt
     */
    outputFormatChangeHandler(evt: any): void;
    /**
     * get user folders
     * @returns
     */
    getUserFolders(): Promise<any[]>;
    extractPlaceholders(exp: string): any[];
    /**
     * confilict behavior changed.
     * @param evt
     */
    changeConflictBehavior(evt: any): void;
    render(): any;
}
