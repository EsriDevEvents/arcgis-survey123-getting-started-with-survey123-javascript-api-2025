export declare class FeaturesPreview {
    queryParameters?: string;
    /**
     * Defines how a feature displays in the “Input feature” section.
     * Use {<fieldName>} to refer to a specific attribute of the feature like in MapViewer.
     * For example, {countryName}, population: {pop2000} -> “China, population: 1,411,750,000”.
     */
    inputFeatureTemplate?: string;
    featureCount: number;
    featureStr: string;
    translator: any;
    reportLang: any;
    commonLang: any;
    private reportService;
    private utilService;
    private stateService;
    componentWillLoad(): Promise<void>;
    initTranslateData(res: any): void;
    /**
     * @returns
     */
    init(): Promise<boolean | void>;
    /**
     * get display fields
     * @returns
     */
    private getDisplayFields;
    render(): any;
}
