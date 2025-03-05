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

export { PropsService as P };

//# sourceMappingURL=props.service.js.map