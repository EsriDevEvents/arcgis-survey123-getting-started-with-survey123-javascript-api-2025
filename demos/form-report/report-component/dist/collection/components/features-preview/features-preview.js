import { Host, h } from "@stencil/core";
import { queryFeatures } from "@esri/arcgis-rest-feature-service";
import { PropsService } from "../../services/props.service";
import { ReportService } from "../../services/report.service";
import { TranslateService } from "../../services/translate.service";
import { UtilService } from "../../services/util.service";
import { StateService } from "../../services/state.service";
// import { ArcGISIdentityManager } from '@esri/arcgis-rest-request';
export class FeaturesPreview {
    constructor() {
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
                    else {
                        // show the first four field
                        // resultFields = (fields.length > 3 ? fields.slice(0, 4) : fields).map((field) => {
                        //   return field.name;
                        // }); 
                        // this.inputFeatureTemplate = resultFields.map((fieldName) => {
                        //   return '{' + fieldName +  '}';
                        // }).join(',');
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
    static get is() { return "features-preview"; }
    static get encapsulation() { return "shadow"; }
    static get originalStyleUrls() {
        return {
            "$": ["features-preview.scss"]
        };
    }
    static get styleUrls() {
        return {
            "$": ["features-preview.css"]
        };
    }
    static get properties() {
        return {
            "queryParameters": {
                "type": "string",
                "mutable": false,
                "complexType": {
                    "original": "string",
                    "resolved": "string",
                    "references": {}
                },
                "required": false,
                "optional": true,
                "docs": {
                    "tags": [],
                    "text": ""
                },
                "attribute": "query-parameters",
                "reflect": false
            },
            "inputFeatureTemplate": {
                "type": "string",
                "mutable": false,
                "complexType": {
                    "original": "string",
                    "resolved": "string",
                    "references": {}
                },
                "required": false,
                "optional": true,
                "docs": {
                    "tags": [],
                    "text": "Defines how a feature displays in the \u201CInput feature\u201D section. \nUse {<fieldName>} to refer to a specific attribute of the feature like in MapViewer. \nFor example, {countryName}, population: {pop2000} -> \u201CChina, population: 1,411,750,000\u201D."
                },
                "attribute": "input-feature-template",
                "reflect": false
            }
        };
    }
    static get states() {
        return {
            "featureCount": {},
            "featureStr": {},
            "translator": {},
            "reportLang": {},
            "commonLang": {}
        };
    }
}
//# sourceMappingURL=features-preview.js.map
