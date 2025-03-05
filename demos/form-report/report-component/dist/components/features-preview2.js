import { proxyCustomElement, HTMLElement, h, Host } from '@stencil/core/internal/client';
import { P as PropsService } from './props.service.js';
import { R as ReportService, q as queryFeatures } from './report.service.js';
import { T as TranslateService } from './translate.service.js';
import { U as UtilService } from './util.service.js';
import { S as StateService } from './state.service.js';

const featuresPreviewCss = ":host{display:block;min-height:200;padding:0 0.75rem;background-color:var(--calcite-color-foreground-1);color:var(--calcite-color-text-2)}:host .heading{margin-inline:0px;margin-block:1.25rem 1rem;font-size:var(--calcite-font-size-0);line-height:1.25rem;font-weight:var(--calcite-font-weight-medium)}";
const FeaturesPreviewStyle0 = featuresPreviewCss;

const FeaturesPreview = /*@__PURE__*/ proxyCustomElement(class FeaturesPreview extends HTMLElement {
    constructor() {
        super();
        this.__registerHost();
        this.__attachShadow();
        this.reportService = ReportService.getService();
        this.utilService = UtilService.getService();
        this.stateService = StateService.getService();
        this.queryParameters = undefined;
        this.inputFeatureTemplate = undefined;
        this.featureCount = 0;
        this.featureStr = '';
        this.translator = undefined;
        this.reportLang = undefined;
        this.commonLang = undefined;
    }
    componentWillLoad() {
        this.stateService.subscribe('update-features-preview', (newVal) => {
            if (newVal !== undefined) {
                this.inputFeatureTemplate = newVal;
            }
            this.featureCount = this.reportService.getHelperObj('featureCount') || 0;
            this.init();
        });
        return Promise.resolve(true)
            // .then(() => {
            //   return TranslateService.getService().getTranslate();
            // })
            .then(() => {
            const res = TranslateService.getService().getTranslateSync();
            this.translator = res;
            this.initTranslateData(res);
            this.stateService.subscribe('locale-data-changed', (data) => {
                this.initTranslateData(data);
            });
            // })
            // .then(() => {
            //   return this.init()
        }).catch((err) => {
            this.reportService.showError(err);
        });
    }
    initTranslateData(res) {
        this.translator = res;
        this.commonLang = res === null || res === void 0 ? void 0 : res.common;
        this.reportLang = res === null || res === void 0 ? void 0 : res.customPrint;
    }
    /**
     * @returns
     */
    init() {
        let displayFields = [];
        return this.getDisplayFields()
            .then((fields) => {
            displayFields = fields;
            let outFields = [];
            // if (displayFields[0] === '*') {
            //   outFields = ['*'];
            // } else {
            outFields = displayFields;
            // }
            /**
             * query features
             */
            const queryParms = JSON.parse(this.queryParameters);
            let resultRecordCount = 10;
            if (queryParms.resultRecordCount < 10) {
                resultRecordCount = queryParms.resultRecordCount;
            }
            // the order by fields may be '||EditDate DESC, objectid ASC', but it is not supported by rest api
            if (queryParms.orderByFields) {
                queryParms.orderByFields = queryParms.orderByFields.replace('||', '');
            }
            const params = Object.assign({
                url: PropsService.featureLayerUrl,
                authentication: PropsService.token, // todo: pass the portalUrl
                outFields: outFields,
                resultRecordCount: resultRecordCount
            }, queryParms);
            const where = 'where' in params ? params.where : null;
            const objectIds = 'objectIds' in params ? params.objectIds : null;
            const additionalParams = {};
            if (where !== null) {
                additionalParams.where = where;
            }
            if (objectIds != null) {
                additionalParams.objectIds = objectIds;
            }
            if (!objectIds && !where) {
                additionalParams.where = '1<>1'; // if no objectIds and where, set where as '1<>1' to avoid requesting error
                delete additionalParams.objectIds;
            }
            params.params = additionalParams;
            delete params.where;
            delete params.objectIds;
            return queryFeatures(params);
        })
            .then((result) => {
            // no feature
            if (this.featureCount === 0) {
                this.featureStr = this.commonLang.noResults;
                return true;
            }
            // generate the display string
            const fields = result.fields || [];
            const fieldMapping = {};
            fields.forEach((field) => {
                fieldMapping[field.name] = field;
            });
            const displayCount = this.featureCount > 10 ? 10 : this.featureCount;
            const displayFeats = result.features.splice(0, displayCount);
            // give a default display fields(the first four fields)
            // if (displayFields[0] === '*') {
            //   displayFields = this.getDisplayFields(fields);
            // }
            this.featureStr = displayFeats.map((feat) => {
                let innerStr = this.inputFeatureTemplate;
                displayFields.forEach((field) => {
                    const val = this.utilService.formatFieldVal(fieldMapping[field], feat.attributes[field]);
                    innerStr = innerStr.replace(`{${field}}`, val);
                });
                return innerStr;
            }).join('<br>');
            if (this.featureCount > 10) {
                this.featureStr += `<br>...(${this.utilService.formatNumber(this.featureCount - 10)} ${this.commonLang.more || 'more'})`;
            }
            // console.log(this.featureCount , this.featureStr);
            return true;
        }).catch((err) => {
            this.reportService.showError(err);
        });
    }
    /**
     * get display fields
     * @returns
     */
    getDisplayFields() {
        let resultFields = [];
        return this.reportService.getLayerJson().then((layerJson) => {
            if (!this.inputFeatureTemplate) {
                // auto generate a default inputFeatureTemplate, show the displayField
                if (layerJson.displayField) {
                    // todo: how about the displayField is a expression?
                    this.inputFeatureTemplate = '{' + layerJson.displayField + '}';
                    resultFields = [layerJson.displayField];
                }
                else {
                    const fields = layerJson.fields || [];
                    const spatialFields = Object.keys(layerJson.editFieldsInfo || {}).map((key) => {
                        return layerJson.editFieldsInfo[key];
                    }).concat([layerJson.objectIdField || '', layerJson.globalIdField || '']);
                    const firstStringField = fields.find((field) => {
                        return !spatialFields.includes(field.name) && field.type === 'esriFieldTypeString';
                    });
                    const firstNumberField = fields.find((field) => {
                        return !spatialFields.includes(field.name) && this.utilService.isNumberField(field);
                    });
                    const firstAnyField = fields.find((field) => {
                        return !spatialFields.includes(field.name) && !this.utilService.isNumberField(field) && field.type !== 'esriFieldTypeString';
                    });
                    // priority: first string field > first number field > first other field.
                    const defaultField = firstStringField || firstNumberField || firstAnyField || fields[0];
                    if (defaultField) {
                        this.inputFeatureTemplate = '{' + defaultField.name + '}';
                        resultFields = [defaultField.name];
                    }
                }
                return resultFields;
            }
            else {
                const fields = layerJson.fields || [];
                const matches = this.inputFeatureTemplate.match(/\{.*?\}/g);
                (matches || []).forEach((match) => {
                    const curName = (match).substring(1, match.length - 1);
                    const isValidField = fields.find((field) => {
                        return field.name === curName;
                    });
                    if (resultFields.indexOf(curName) < 0 && isValidField) {
                        resultFields.push(curName);
                    }
                });
                if (!resultFields.length) {
                    resultFields = [layerJson.objectIdField || 'objectid'];
                }
                return resultFields;
            }
        });
    }
    render() {
        var _a, _b;
        return (h(Host, { key: 'f2c77b92f32d439574043b1746bf8b4f36df78e9' }, h("div", { key: '250a3421f00f699028066cddbb133be62f3df570' }, h("div", { key: '4e2c1ac52c1bd185cfba5df6ab87155a3762615c', class: "heading" }, (_b = (_a = this.translator) === null || _a === void 0 ? void 0 : _a.customPrint) === null || _b === void 0 ? void 0 :
            _b.inputFeatures, " (", this.featureCount, ")"), h("div", { key: 'ad8ebea8558d0ec9d5e25b3b97ee2b3e070b6d11', innerHTML: this.featureStr })), h("slot", { key: '4346d0030a306b4ae30ec8b808667147e0ffc080' })));
    }
    static get style() { return FeaturesPreviewStyle0; }
}, [1, "features-preview", {
        "queryParameters": [1, "query-parameters"],
        "inputFeatureTemplate": [1, "input-feature-template"],
        "featureCount": [32],
        "featureStr": [32],
        "translator": [32],
        "reportLang": [32],
        "commonLang": [32]
    }]);
function defineCustomElement() {
    if (typeof customElements === "undefined") {
        return;
    }
    const components = ["features-preview"];
    components.forEach(tagName => { switch (tagName) {
        case "features-preview":
            if (!customElements.get(tagName)) {
                customElements.define(tagName, FeaturesPreview);
            }
            break;
    } });
}

export { FeaturesPreview as F, defineCustomElement as d };

//# sourceMappingURL=features-preview2.js.map