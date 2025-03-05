import { PropsService } from "./props.service";
import { getPortal, getItem } from "@esri/arcgis-rest-portal";
export class UtilService {
    constructor() {
        this.isPortal = false;
        // private surveyItemInfo: any;
        // store all the svg for icon component
        this.svgCache = {};
    }
    /**
     * get Service
     * @returns
     */
    static getService() {
        if (!this.service) {
            this.service = new UtilService();
        }
        return this.service;
    }
    /**
     * get portalInfo
     */
    getPortalInfo() {
        if (this.portalInfo && this.portalInfo.user) {
            return Promise.resolve(this.portalInfo);
        }
        return getPortal(null, this.getBaseRequestOptions())
            .then((res) => {
            if (!res.error) {
                this.portalInfo = res;
                this.isPortal = res.isPortal;
                return res;
            }
            else {
                throw new Error(JSON.stringify(res));
            }
        });
    }
    getUser() {
        var _a;
        return ((_a = this.portalInfo) === null || _a === void 0 ? void 0 : _a.user) || {};
    }
    // set dir
    setDir() {
        document.getElementsByTagName('html')[0].dir = ['ar', 'he'].indexOf(PropsService.locale) !== -1 ? 'rtl' : 'ltr';
    }
    /**
     *
     * @param surveyItemId
     * @returns
     */
    getSurveyItemInfo(surveyItemId) {
        return getItem(surveyItemId, this.getBaseRequestOptions())
            .then((info) => {
            // this.surveyItemInfo = info;
            return info;
        });
    }
    /**
     * getBaseRequestOptions
     * @returns
     */
    getBaseRequestOptions() {
        return {
            authentication: PropsService.token,
            portal: `${PropsService.portalUrl}/sharing/rest`
        };
    }
    /**
     * supportFeatureReport
     * @returns
     */
    supportFeatureReport() {
        return (!this.isPortal || (this.isPortal && this.compareVersion(this.portalInfo.currentVersion, this.getRestApiVersion('10.5.0')) >= 0));
    }
    /**
     * format fieldtype
     * @param fieldType
     * @param val
     * @returns
     */
    formatFieldVal(field, val) {
        var _a, _b;
        if (!val) {
            return val;
        }
        const fieldType = field.type;
        const codedValues = (_a = field.domain) === null || _a === void 0 ? void 0 : _a.codedValues;
        // date field
        if (fieldType === 'esriFieldTypeDate') {
            val = this.formatDateTime(val);
        }
        else if (codedValues) {
            // has coded value
            val = ((_b = codedValues.find((codeVal) => {
                return codeVal.code === val;
            })) === null || _b === void 0 ? void 0 : _b.name) || val;
        }
        else if (this.isNumberField(field)) {
            val = this.formatNumber(val);
        }
        return val;
    }
    /**
     * is number field type
     * @param field
     * @returns
     */
    isNumberField(field) {
        if (!field) {
            return false;
        }
        const fieldType = field.type;
        return 'esriFieldTypeSingle,esriFieldTypeDouble,esriFieldTypeInteger,esriFieldTypeSmallInteger'.split(',').includes(fieldType);
    }
    /**
     * format number
     * @param num
     */
    formatNumber(num) {
        return new Intl.NumberFormat(PropsService.locale || 'default').format(num);
    }
    /**
     * format date/time/datetime
     * @param date
     * @param type
     * @param options
     */
    formatDateTime(date, type) {
        type = type || 'date';
        if (!(date instanceof Date)) {
            date = new Date(date);
        }
        const parms = {
            date: {
                year: "numeric",
                month: "numeric",
                day: "numeric",
            },
            time: {
                hour: "numeric",
                minute: "numeric",
                second: "numeric"
            },
            datetime: {
                year: "numeric",
                month: "numeric",
                day: "numeric",
                hour: "numeric",
                minute: "numeric",
                second: "numeric"
            }
        };
        if (!date) {
            return '';
        }
        return new Intl.DateTimeFormat(PropsService.locale || 'default', parms[type]).format(date);
    }
    /**
     * But need to check the new percentage pipe support to show the value like 99.999999999%
     * @param percent
     * @param returnNumber
     */
    getPercentage(job, percent, returnNumber) {
        let numberVal = 0;
        if ((!job || !job.jobStatusInfo) && !percent) {
            return '';
        }
        const percentage = percent ? percent : Number(job.jobStatusInfo.progress + '' || '0');
        let decimal = 1;
        if (Math.round(percentage * 100) === 100 && percentage !== 1) {
            const decimalStr = (percentage + '').substr(3);
            let index = decimalStr.split('').findIndex((str) => {
                return parseInt(str, 10) < 9;
            });
            // if the last number is still 9, use str length
            if (index === -1) {
                index = decimalStr.split('').length - 1;
            }
            decimal = index + 1;
        }
        numberVal = Math.round(percentage * Math.pow(10, decimal + 2)) / Math.pow(10, decimal);
        if (returnNumber) {
            return numberVal;
        }
        return new Intl.NumberFormat(PropsService.locale, { style: 'percent' }).format(numberVal / 100); // percentage  + '%';  
    }
    /**
     * getFileSize
     * @param bytes
     * @returns
     */
    getFileSize(bytes) {
        let result = 0;
        let type = 'KB';
        // if (bytes && bytes > (1024 * 1024 * 1024)) {
        //   result = (bytes / (1024 * 1024 * 1024)).toFixed(1) + 'GB';
        // } else
        if (bytes && bytes > (1024 * 1024)) {
            result = Number((bytes / (1024 * 1024)).toFixed(1)); // + 'MB';
            type = 'MB';
        }
        else {
            result = Number((bytes / (1024)).toFixed(1)); // + 'KB';
            type = 'KB';
        }
        //  else {
        //   result = (bytes).toFixed(1) + 'B';
        // }
        return result + type;
    }
    // remove placeholders in output file name expression
    extractPlaceholders(exp) {
        exp = exp || '';
        const matches = exp.match(/\$[^{$]*?{[^}]*?.*?}/g), returnedMatches = [];
        if (matches) {
            matches.forEach((match) => {
                // if not duplicate, push it
                if (returnedMatches.indexOf(match) === -1) {
                    returnedMatches.push(match);
                }
            });
        }
        return returnedMatches;
    }
    /**
     * parse markdown,
     * eg: convert 'Failed to parse `${tag}` and `${tag}`' to 'Failed to parse <i>${tag}</i> and <i>${tag}</i>'
     */
    parseMarkdown(html) {
        const arr = (html + '').split('`');
        let result = '';
        arr.forEach((seg, index) => {
            if (index % 2 === 0) {
                result += seg;
            }
            else {
                result += '<i>' + seg + '</i>';
            }
        });
        return result;
    }
    /**
     * check if the currrent user has the privilige: premium:user:featurereport
     */
    isUserCanPrintFeatureReport() {
        const privileges = this.getUser().privileges || [];
        const checkValues = ['premium:user:featurereport'];
        return privileges.filter((elem) => {
            return checkValues.indexOf(elem) > -1;
        }).length === checkValues.length;
    }
    /**
     * set the svg cache
     * @param obj
     */
    setSvgCache(key, svgStr) {
        if (!key || !svgStr) {
            return;
        }
        this.svgCache[key] = svgStr;
    }
    /**
    * get svg cache
    * @param key
    * @returns
    */
    getSvgCache(key) {
        if (!key) {
            return this.svgCache;
        }
        if (!this.svgCache) {
            return null;
        }
        return this.svgCache[key];
    }
    /**
    * compare version
    * -1: a < b
    * 0: a = b
    * 1: a > b
    * @param a
    * @param b
    */
    compareVersion(a, b) {
        /**
         * convert version to string
         * the versoin may be number in very old survey
         */
        a = '' + a;
        b = '' + b;
        if (!a || !b) {
            throw new Error('version is not existed');
        }
        let i, diff;
        const regExStrip0 = /(\.0+)+$/;
        const segmentsA = a.replace(regExStrip0, '').split('.');
        const segmentsB = b.replace(regExStrip0, '').split('.');
        const l = Math.min(segmentsA.length, segmentsB.length);
        for (i = 0; i < l; i++) {
            diff = parseInt(segmentsA[i], 10) - parseInt(segmentsB[i], 10);
            if (diff) {
                return diff;
            }
        }
        return segmentsA.length - segmentsB.length;
    }
    /**
     * get rest api version by portalVersion
     * portal    rest version
     * 10.7   >> 6.4
     * 10.6   >> 5.3
     * 10.5.2 >> 5.2
     * 10.5.1 >> 5.1
     * 10.5.0 >> 4.4
     * 10.4.0 >> 3.10
     */
    getRestApiVersion(portalVersion) {
        if (!portalVersion) {
            return '';
        }
        if (portalVersion === '10.9.1') {
            return '9.2';
        }
        if (portalVersion === '10.9.0') {
            return '8.4';
        }
        if (portalVersion === '10.8.1') {
            return '8.2';
        }
        if (portalVersion === '10.8.0') {
            return '7.3';
        }
        if (portalVersion === '10.7.2') {
            return '7.2';
        }
        if (portalVersion === '10.7.1') {
            return '7.1';
        }
        /**
         * portal mistype the version of 10.7.0 to 7.1
         * it will be difficult to distingish 10.7.0 and 10.7.1
         */
        if (portalVersion === '10.7.0') {
            return '7.1'; // '6.4';
        }
        if (portalVersion === '10.6.1') {
            return '6.1';
        }
        if (portalVersion === '10.6.0') {
            return '5.3';
        }
        if (portalVersion === '10.5.2') {
            return '5.2';
        }
        if (portalVersion === '10.5.1') {
            return '5.1';
        }
        if (portalVersion === '10.5.0') {
            return '4.4';
        }
        if (portalVersion === '10.4.0') {
            return '3.10';
        }
        return '';
    }
}
//# sourceMappingURL=util.service.js.map
