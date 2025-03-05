import { EventEmitter } from '../../../stencil-public-runtime';
export declare class FileOptionChooser {
    fileOption: 'none' | 'nextPage' | 'continuous';
    fileOptionChange: EventEmitter<any>;
    private ele;
    translator: any;
    langReport: any;
    private state;
    componentWillLoad(): Promise<void>;
    /**
     * selet item
     * @param type
     */
    selectItem(type: 'none' | 'nextPage' | 'continuous'): void;
    private svgs;
    render(): any;
}
