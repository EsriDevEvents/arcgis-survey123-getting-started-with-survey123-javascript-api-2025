export declare const t9nLocales: string[];
export declare const locales: string[];
export declare const supportedLocales: readonly string[];
export type SupportedLocale = (typeof supportedLocales)[number];
export declare class TranslateService {
    static service: TranslateService;
    static currentLangObj: any;
    cache: any;
    /**
     * get Service
     * @returns
     */
    static getService(): TranslateService;
    /**
     * get tranlate json
     * @param locale
     * @returns
     */
    getTranslate(): Promise<any>;
    /**
     * get translate sync
     */
    getTranslateSync(): any;
    /**
     * Gets the locale that best matches the context.
     *
     * @param locale – the BCP 47 locale code
     * @param context - specifies whether the locale code should match in the context of CLDR or T9N (translation)
     */
    getSupportedLocale(locale: string): SupportedLocale;
}
