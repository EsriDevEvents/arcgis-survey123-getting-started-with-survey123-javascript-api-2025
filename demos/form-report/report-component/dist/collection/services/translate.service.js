import { PropsService } from "./props.service";
import { getAssetPath } from "@stencil/core";
const defaultLocale = "en";
export const t9nLocales = [
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
export const locales = [
    "ar",
    "bg",
    "bs",
    "ca",
    "cs",
    "da",
    "de",
    "de-at",
    "de-ch",
    "el",
    defaultLocale,
    "en-au",
    "en-ca",
    "en-gb",
    "es",
    "es-mx",
    "et",
    "fi",
    "fr",
    "fr-ch",
    "he",
    "hi",
    "hr",
    "hu",
    "id",
    "it",
    "it-ch",
    "ja",
    "ko",
    "lt",
    "lv",
    "mk",
    "no",
    "nl",
    "pl",
    "pt",
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
export const supportedLocales = [...new Set([...t9nLocales, ...locales])];
export class TranslateService {
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
//# sourceMappingURL=translate.service.js.map
