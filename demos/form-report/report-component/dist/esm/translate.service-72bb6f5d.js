import { g as getAssetPath } from './index-15add20a.js';

/**
 * This class aims to store the shared props
 */
class PropsService {
    /**
     * set props
     * @param obj
     */
    static setProps(obj) {
        const whitelist = PropsService.paramesWhitelist;
        let env = '';
        const pattern = /survey123(.*?).arcgis.com/;
        const match = window.location.hostname.match(pattern);
        if (match && match[1]) {
            if (['dev', 'qa', 'beta'].includes(match[1])) {
                env = match[1];
            }
        }
        const defaultLocale = this.getLocale();
        const defaultValue = {
            apiUrl: `https://survey123${env}.arcgis.com/api/featureReport`,
            itemId: null,
            token: null,
            outputFormat: 'docx',
            portalUrl: 'https://www.arcgis.com',
            locale: defaultLocale,
            f: 'json'
        };
        if (typeof obj === 'object') {
            for (let key in obj) {
                if (whitelist.indexOf(key) >= 0) {
                    PropsService[key] = obj[key] || defaultValue[key] || obj[key];
                    if (key === 'locale' && obj[key]) {
                        PropsService[key] = this.convertToSupportedLang(obj[key]);
                    }
                }
            }
            // Object.assign(this, obj || {});
        }
        if (PropsService.outputFormat !== 'docx' && PropsService.outputFormat !== 'pdf') {
            PropsService.outputFormat = 'docx';
        }
    }
    /**
     * get locale
     * @returns
     */
    static getLocale(options) {
        options = Object.assign({}, options || {});
        let userInfo = options.userInfo || {};
        let portalInfo = options.portalInfo || {};
        const browerLocale = navigator.language || navigator.userLanguage;
        // https://devtopia.esri.com/Beijing-R-D-Center/survey123-webform/issues/857
        return this.convertToSupportedLang(options.userDefinedLocale) ||
            this.convertToSupportedLang(userInfo.culture) ||
            this.convertToSupportedLang(portalInfo.culture) ||
            this.convertToSupportedLang(browerLocale) || 'en';
    }
    /**
    * convert the provided language code to the supported language code
    * @param lang
    */
    static convertToSupportedLang(lang) {
        const supportLangs = [
            "ar",
            "bg",
            "bs",
            "ca",
            "cs",
            "da",
            "de",
            "el",
            "en",
            "es",
            "et",
            "fi",
            "fr",
            "he",
            "hr",
            "hu",
            "id",
            "it",
            "ja",
            "ko",
            "lt",
            "lv",
            "nb",
            "nl",
            "pl",
            "pt-br",
            "pt-pt",
            "ro",
            "ru",
            "sk",
            "sl",
            "sr",
            "sv",
            "th",
            "tr",
            "uk",
            "vi",
            "zh-cn",
            "zh-hk",
            "zh-tw"
        ];
        const supportSubLocales = [
            "en-US",
            "en-GB",
            "en-AU",
            "en-CA",
            "es-ES",
            "es-MX",
            "it-CH",
            "de-CH",
            "de-AT",
            "fr-CH"
        ];
        lang = lang || '';
        lang = (lang + '').toLowerCase();
        const isSupportLangs = supportLangs.find((e) => {
            return e.toLowerCase() === lang || e.toLowerCase() === lang.split('-')[0] || e.toLowerCase().split('-')[0] === lang;
        });
        const isSupportSubLocale = supportSubLocales.find((e) => {
            return e.toLowerCase() === lang;
        });
        return isSupportSubLocale || isSupportLangs;
    }
}
// /**
//  * @internal
//  * @param metadata 
//  */
// constructor(metadata?: any) {
//   const defaultValue = {
//     url: 'https://survey123.arcgis.com/api/featureReport',
//     itemId: null,
//     token: null,
//     portalUrl: 'https://www.arcgis.com',
//     f: 'json'
//   };
//   Object.assign(this, defaultValue, metadata || {});
// }
PropsService.paramesWhitelist = ['token', 'portalUrl', 'apiUrl', 'featureLayerUrl', 'surveyItemId',
    'templateItemId', 'queryParameters', 'mergeFiles', 'outputFormat', 'outputReportName',
    'outputPackageName', 'packageFiles', 'uploadInfo', 'webmapItemId', 'mapScale',
    'locale', 'utcOffset', 'where', 'username', 'show', 'hide', 'inputFeatureTemplate', 'label', 'reportTemplateIds', 'clientId', 'requestSource'];

const defaultLocale = "en";
const t9nLocales = [
    "ar",
    "bg",
    "bs",
    "ca",
    "cs",
    "da",
    "de",
    "el",
    defaultLocale,
    "es",
    "et",
    "fi",
    "fr",
    "he",
    "hr",
    "hu",
    "id",
    "it",
    "ja",
    "ko",
    "lt",
    "lv",
    "no",
    "nl",
    "pl",
    "pt-br",
    "pt-pt",
    "ro",
    "ru",
    "sk",
    "sl",
    "sr",
    "sv",
    "th",
    "tr",
    "uk",
    "vi",
    "zh-cn",
    "zh-hk",
    "zh-tw",
];
class TranslateService {
    /**
     * get Service
     * @returns
     */
    static getService() {
        if (!this.service) {
            this.service = new TranslateService();
        }
        return this.service;
    }
    /**
     * get tranlate json
     * @param locale
     * @returns
     */
    getTranslate() {
        const lang = this.getSupportedLocale(PropsService.locale || 'en');
        return Promise.resolve(true)
            .then(() => {
            // read the cache
            if (this.cache && this.cache[lang]) {
                try {
                    return JSON.parse(this.cache[lang]);
                }
                catch (_a) {
                    return null;
                }
            }
        })
            .then((res) => {
            if (res) {
                return res;
            }
            return fetch(getAssetPath(`./assets/i18n/${lang}.json`))
                .then((resp) => {
                if (!resp.ok) {
                    throw new Error("could not fetch the translate json file");
                }
                return resp.json();
            });
        })
            .then((res) => {
            // save the cache
            if (res) {
                this.cache = this.cache || {};
                if (!this.cache[lang]) {
                    try {
                        this.cache[lang] = JSON.stringify(res);
                    }
                    catch (_a) {
                        //
                    }
                }
                // override the default string if the 'label' prop existing
                if (PropsService.label) {
                    const keyMapping = {
                        inputFeatures: 'inputFeatures',
                        selectTemplate: 'chooseTemplateLabel1',
                        reportSetting: 'resultSettingsLabel1',
                        fileOptions: 'outputMode',
                        reportName: 'saveToAGOItemName',
                        saveToAGSAccount: 'saveToAGOFolder',
                        outputFormat: 'outputFormat',
                        showCredits: 'creditsEstimate',
                        generateReport: 'generate',
                        previewMode: 'previewReport'
                    };
                    const labelsObj = JSON.parse(PropsService.label);
                    Object.keys(labelsObj).forEach((key) => {
                        const str = labelsObj[key];
                        if (key === 'recentReports') {
                            res.customPrint.recentTasks.label = str;
                        }
                        const strkey = keyMapping[key];
                        if (['inputFeatures', 'selectTemplate', 'reportSetting', 'fileOptions', 'reportName', 'saveToAGSAccount', 'outputFormat', 'showCredits', 'generateReport', 'previewReport'].indexOf(key) >= 0) {
                            res.customPrint[strkey] = str;
                        }
                    });
                }
                TranslateService.currentLangObj = res;
            }
            return res;
        })
            .catch((res) => { throw new Error(res); });
    }
    /**
     * get translate sync
     */
    getTranslateSync() {
        return TranslateService.currentLangObj;
    }
    /**
     * Gets the locale that best matches the context.
     *
     * @param locale – the BCP 47 locale code
     * @param context - specifies whether the locale code should match in the context of CLDR or T9N (translation)
     */
    getSupportedLocale(locale) {
        const contextualLocales = t9nLocales; // = context === "cldr" ? locales : t9nLocales;
        if (!locale) {
            return defaultLocale;
        }
        if (contextualLocales.includes(locale)) {
            return locale;
        }
        locale = locale.toLowerCase();
        // we support both 'nb' and 'no' (BCP 47) for Norwegian but only `no` has corresponding bundle
        if (locale === "nb") {
            return "no";
        }
        // we use `pt-BR` as it will have the same translations as `pt`, which has no corresponding bundle
        if (locale === "pt") {
            return "pt-br";
        }
        if (locale.includes("-")) {
            locale = locale.replace(/(\w+)-(\w+)/, (_match, language, region) => `${language}-${region.toUpperCase()}`);
            if (!contextualLocales.includes(locale)) {
                locale = locale.split("-")[0];
            }
        }
        // we can `zh-CN` as base translation for chinese locales which has no corresponding bundle.
        if (locale === "zh") {
            return "zh-cn";
        }
        if (!contextualLocales.includes(locale)) {
            console.warn(`Translations for the "${locale}" locale are not available and will fall back to the default, English (en).`);
            return defaultLocale;
        }
        return locale;
    }
}

export { PropsService as P, TranslateService as T };

//# sourceMappingURL=translate.service-72bb6f5d.js.map