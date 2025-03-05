import { r as registerInstance, h, H as Host, c as createEvent, F as Fragment, a as getElement } from './index-15add20a.js';
import { T as TranslateService, P as PropsService } from './translate.service-72bb6f5d.js';
import { R as ReportService, q as queryFeatures } from './report.service-c3cee168.js';
import { d as getPortalUrl, r as request, U as UtilService } from './util.service-95ba91e5.js';
import { S as StateService } from './state.service-a118a4aa.js';

/* Copyright (c) 2017-2018 Environmental Systems Research Institute, Inc.
 * Apache-2.0 */
/**
 * `requestOptions.owner` is given priority, `requestOptions.item.owner` will be checked next. If neither are present, `authentication.getUserName()` will be used instead.
 */
function determineOwner(requestOptions) {
    if (requestOptions.owner) {
        return Promise.resolve(requestOptions.owner);
    }
    else if (requestOptions.item && requestOptions.item.owner) {
        return Promise.resolve(requestOptions.item.owner);
    }
    else if (requestOptions.authentication &&
        requestOptions.authentication.getUsername) {
        return requestOptions.authentication.getUsername();
    }
    else {
        return Promise.reject(new Error("Could not determine the owner of this item. Pass the `owner`, `item.owner`, or `authentication` option."));
    }
}

/**
 * Returns a listing of the user's content. If the `username` is not supplied, it defaults to the username of the authenticated user. If `start` is not specified it defaults to the first page.
 *
 * If the `num` is not supplied it is defaulted to 10. See the [REST Documentation](https://developers.arcgis.com/rest/users-groups-and-items/user-content.htm) for more information.
 *
 * ```js
 * import { getUserContent } from "@esri/arcgis-rest-portal";
 *
 * getUserContent({
 *    owner: 'geemike',
 *    folderId: 'bao7',
 *    start: 1,
 *    num: 20,
 *    authentication
 * })
 * ```
 *
 * @param requestOptions - Options for the request
 * @returns A Promise<IUserContentResponse>
 */
const getUserContent = (requestOptions) => {
    const { folderId: folder, start = 1, num = 10, authentication } = requestOptions;
    const suffix = folder ? `/${folder}` : "";
    return determineOwner(requestOptions)
        .then((owner) => `${getPortalUrl(requestOptions)}/content/users/${owner}${suffix}`)
        .then((url) => request(url, {
        httpMethod: "GET",
        authentication,
        params: {
            start,
            num
        }
    }));
};

const featuresPreviewCss = ":host{display:block;min-height:200;padding:0 0.75rem;background-color:var(--calcite-color-foreground-1);color:var(--calcite-color-text-2)}:host .heading{margin-inline:0px;margin-block:1.25rem 1rem;font-size:var(--calcite-font-size-0);line-height:1.25rem;font-weight:var(--calcite-font-weight-medium)}";
const FeaturesPreviewStyle0 = featuresPreviewCss;

const FeaturesPreview = class {
    constructor(hostRef) {
        registerInstance(this, hostRef);
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
};
FeaturesPreview.style = FeaturesPreviewStyle0;

const reportGeneratorCss = ":host{padding:0 0.75rem;display:block}:host .clickable-text{cursor:pointer;font-weight:normal}:host calcite-notice{margin-top:6px}:host .credits-info{margin:10px 0 10px 0;padding:10px 0;background-color:var(--calcite-color-foreground-3);color:var(--calcite-color-text-2);display:flex;justify-content:space-between}:host .credits-info>div{margin:0px 10px}:host .credits-info .show-credits{display:inline-flex;align-items:center}:host .credits-info .show-credits survey123-ui-spinner{line-height:0}:host .credits-info .show-credits ::ng-deep span{line-height:0}:host .credits-info .show-credits .icon-spin.icon-refresh{top:1px}:host .credits-info .show-credits .spinner{-webkit-transition:none;-moz-transition:none;-o-transition:none;transition:none}:host .credits-info .show-credits span:not(.clickable-text){cursor:default}:host .credits-info .show-credits span.clickable-text.disabled{cursor:not-allowed}:host .credits-info .credits-result-info{flex-grow:1;display:flex;justify-content:flex-end}:host .credits-info .credits-result-info span{word-break:break-word}:host .pieview-info{margin-top:10px;margin-bottom:20px}:host .pieview-info .has-spinner>span{cursor:default}:host .pieview-info .has-spinner>span.report-status{padding:0 2px}:host .pieview-info .preview-text{cursor:default;display:flex;align-items:center}:host .pieview-info .preview-text>span{cursor:pointer}:host .pieview-info .preview-text.disabled{text-decoration:underline solid #979797;color:#979797;cursor:not-allowed}:host .pieview-info .preview-text.disabled>span{cursor:not-allowed}:host .execute-btn{overflow:auto;margin:-5px 0 30px 0}:host .execute-btn>span{line-height:41px}:host .execute-btn a{float:inline-start}:host .execute-btn a button{width:auto}:host .execute-btn.portal-btn{margin:20px 0}:host calcite-loader{display:inline-block;margin:0 0 0 10px}";
const ReportGeneratorStyle0 = reportGeneratorCss;

const ReportGenerator = class {
    constructor(hostRef) {
        registerInstance(this, hostRef);
        this.reportCreated = createEvent(this, "reportCreated", 7);
        this.batchPrintLimitCount = 2000;
        // private buttonClickable: boolean;
        this.checkingList = [];
        this.reportService = ReportService.getService();
        this.utilService = UtilService.getService();
        this.state = StateService.getService();
        this.featureCount = undefined;
        this.supportShowCredits = true;
        this.printTemplates = [];
        this.langObj = undefined;
        this.creditsInfo = undefined;
        this.creditStatus = undefined;
        this.testModeJobObj = undefined;
        this.isTestModePrinting = undefined;
        this.visibleConf = undefined;
        this.templateItemId = undefined;
        this.isPrinting = undefined;
        this.translator = undefined;
    }
    componentWillLoad() {
        // check whether to show the estimate credit button
        this.checkPrivilige();
        this.printTemplates = this.reportService.getHelperObj('printTemplates') || [];
        this.state.subscribe('print-templates-updated', (data) => {
            this.printTemplates = data || [];
        });
        this.state.subscribe('portal-info-update', () => {
            this.checkPrivilige();
        });
        this.state.subscribe('feature-count-updated', () => {
            this.checkPrivilige();
        });
        return Promise.resolve(true)
            // .then(() => {
            //   return TranslateService.getService().getTranslate();
            // })
            .then(() => {
            const res = TranslateService.getService().getTranslateSync();
            this.translator = res;
            this.state.subscribe('locale-data-changed', (data) => {
                this.translator = data;
            });
            // const langTasks = res.customPrint.recentTasks;
            // this.langTasks = langTasks;
            // this.statusI18nConfig = {
            //   esriJobWaiting: langTasks.jobStatusWaiting,
            //   esriJobSubmitted: langTasks.jobStatusSubmitted,
            //   esriJobExecuting: langTasks.jobStatusExecuting,
            //   esriJobSucceeded: langTasks.jobStatusSucceeded,
            //   esriJobFailed: langTasks.jobStatusFailed,
            //   pdfConverting: langTasks.pdfConverting,
            //   pdfConverted: langTasks.pdfConverted,
            //   dfConvertFailed: langTasks.dfConvertFailed
            // };
        });
    }
    checkPrivilige() {
        this.featureCount = this.reportService.getHelperObj('featureCount') || 0;
        this.isPortal = this.utilService.isPortal;
        const isSupport = this.utilService.supportFeatureReport();
        const canPrintFeatureReport = this.utilService.isUserCanPrintFeatureReport();
        this.canShowEstimateCredits = isSupport ? canPrintFeatureReport : false;
        this.supportShowCredits = !this.isPortal && this.featureCount <= this.batchPrintLimitCount && this.canShowEstimateCredits;
    }
    estimateCredits() {
        if (this.featureCount > this.batchPrintLimitCount) {
            return;
        }
        if (this.featureCount < 1) {
            return;
        }
        if (!this.printTemplates || !this.printTemplates.length) {
            return;
        }
        if (!(this.creditsInfo && this.creditStatus === 'estimating')) {
            const paramStore = this.reportService.getParamCache();
            const templateItemId = paramStore.templateItemId || PropsService.templateItemId;
            const params = {
                queryParameters: PropsService.queryParameters,
                featureLayerUrl: PropsService.featureLayerUrl,
                templateItemId: templateItemId,
                surveyItemId: PropsService.surveyItemId
            };
            // if (this.isInternalTest) {
            //   (params as any).isInternalTest = true;
            // }
            this.creditStatus = 'estimating';
            this.creditsInfo = this.creditsInfo || {};
            this.reportService.estimateReportCosts(params)
                .then((res) => {
                if (res.resultInfo) {
                    this.creditsInfo = res.resultInfo;
                    this.creditStatus = 'finished';
                    // temporarily save lastCalculatedCount and lastSelectedTemplateId, to detect if estimate is invalid
                    this.creditsInfo.lastCalculatedCount = this.featureCount;
                    this.creditsInfo.lastSelectedTemplateId = templateItemId;
                }
                else {
                    throw res.error;
                }
            })
                .catch((err) => {
                this.reportService.showError(err);
                this.creditStatus = 'changed';
            });
        }
    }
    /**
     * check the clickable of the generate button
     * @returns
     */
    buttonClickable() {
        const clickable = true;
        /**
         * check print feautre report privilege
         */
        // if (!this.canPrintFeatureReport) {
        //   return false;
        // }
        if (this.templateItemId) {
            return true;
        }
        if (!this.printTemplates || !this.printTemplates.length) {
            return false;
        }
        // todo: need string when there is no fieldName or feature count is 0
        // const paramStore: any = this.reportService.getParamCache();
        // const templateItemId = paramStore.templateItemId || PropsService.templateItemId;
        // const fileName = paramStore.outputPackageName || PropsService.outputPackageName || paramStore.outputReportName || PropsService.outputReportName || '';
        // const count = this.featureCount;
        // if (count < 1 || !templateItemId || count > this.batchPrintLimitCount) {
        //   clickable = false;
        // } else if (!fileName) { //  || (this.saveToItem && this.canCreateItem && !this.selectedFolder)) {
        //   clickable = false;
        // }
        return clickable;
    }
    executeCustomPrint(isTestMode) {
        var _a;
        const paramStore = this.reportService.getParamCache();
        if (isTestMode && this.isTestModePrinting) {
            return;
        }
        this.featureCount = this.reportService.getHelperObj('featureCount') || 0;
        if (this.featureCount < 1) {
            this.reportService.showError({}, { errorStr: (_a = this.translator) === null || _a === void 0 ? void 0 : _a.common.noResults });
            return;
        }
        // const helper = this.reportService.getHelperObj();
        // const count = helper.featureCount;
        // if (count < 1) {
        //   console.log('There is no reocord to print.')
        //   return;
        // }
        // let formatStrings: string[] = [
        //   'MM/DD/YYYY',
        //   'YYYY-MM-DD HH:mm:ss',
        //   'YYYYMMDDHHmmss'
        // ];
        // const template = paramStore.templateItemId;
        // template.printing = true;
        if (isTestMode) {
            this.isTestModePrinting = true;
        }
        else {
            this.isPrinting = true;
        }
        if (isTestMode) {
            const params = {
                queryParameters: PropsService.queryParameters,
                templateItemId: paramStore.templateItemId || PropsService.templateItemId,
                surveyItemId: PropsService.surveyItemId,
                featureLayerUrl: PropsService.featureLayerUrl,
                outputReportName: paramStore.outputPackageName || PropsService.outputPackageName || paramStore.outputReportName || PropsService.outputReportName || '' // !this.saveToItem ? fName + '' : '',
            };
            // Use outputReportName as outputPackageName if it doesn't have any variables and outputPackageName is not specified by user
            // https://devtopia.esri.com/Beijing-R-D-Center/feature-report/issues/252
            if (params.outputReportName) {
                const placeholders = this.utilService.extractPlaceholders(params.outputReportName);
                if (!(placeholders && placeholders.length)) {
                    params.outputPackageName = params.outputReportName;
                }
            }
            const mergeFiles = paramStore.mergeFiles || PropsService.mergeFiles;
            if (mergeFiles && mergeFiles !== 'none') {
                params.mergeFiles = mergeFiles;
            }
            return this.reportService.createSampleReport(params).then((res) => {
                var _a, _b;
                if (!res || !res.success) {
                    this.reportService.showError({}, { errorStr: (_b = (_a = this.translator) === null || _a === void 0 ? void 0 : _a.customPrint) === null || _b === void 0 ? void 0 : _b.printErrMsg, detail: ((res.error && res.error.message) ? res.error.message : '') });
                    // template.printing = false;
                    this.isTestModePrinting = false;
                }
                else {
                    this.testModeJobObj = res;
                    this.watchTestModeJob();
                    // template.printing = false;
                    // this.isPrinting = false;
                }
            }).catch((err) => {
                var _a, _b;
                this.reportService.showError({}, { errorStr: (_b = (_a = this.translator) === null || _a === void 0 ? void 0 : _a.customPrint) === null || _b === void 0 ? void 0 : _b.printErrMsg, detail: ((err.error && err.error.message) ? err.error.message : '') });
                // template.printing = false;
                this.isTestModePrinting = false;
            });
        }
        // let fileName = this.validateFileName(this.survey.title) + '_' + moment().format(this.formatStrings[2]) + '.docx';
        let fileName = paramStore.outputPackageName || PropsService.outputPackageName || paramStore.outputReportName || PropsService.outputReportName || '';
        if (fileName.length > 250) {
            fileName = fileName.substr(0, 250);
        }
        return Promise.resolve()
            /**
             * first: get objectId, if only one record is selected, and no uploadInfo
             */
            // return new Promise((resolve) => {
            //   if (!this.saveToItem && this.featureCount === 1) {
            //     let objectId: any = '';
            //     if (this.selectedMode === 'selected') {
            //       objectId = this.getSelectedOIDs();
            //       if (Array.isArray(objectId)) {
            //         objectId = objectId[0];
            //       }
            //       resolve(objectId);
            //     } else {
            //       let where = this.where || '1=1';
            //       if (this.featureTable && this.featureTable.layer) {
            //         where = this.featureTable.layer.definitionExpression || '1=1';
            //       }
            //       this.surveyFeatureSetService.queryFromCurrentLayerToRootLayer(this.featureLayerUrl, this.featureLayerUrl.split('/').pop(), null, where, true).then((res) => {
            //         const rootLayerIdx = this.featureLayerUrl.split('/').pop();
            //         if (res && res[rootLayerIdx] && res[rootLayerIdx].objectIds && res[rootLayerIdx].objectIds.length) {
            //           resolve(res[rootLayerIdx].objectIds);
            //         } else {
            //           resolve(null);
            //         }
            //       });
            //     }
            //   } else {
            //     resolve(null);
            //   }
            // })
            /**
             * second, get the file name if needed
             */
            // .then((objectId) => {
            //   // todo: get the survey form json title, remove html tags
            //   let outputReportName = this.utilService.stripscript(this.survey.title) + '_OID' + objectId + '_' + moment().format('YYYYMMDDHHmmss') + '.' + this.selectedFormat.value;
            //   if (!this.saveToItem && this.featureCount === 1 && this.survey.form.settings.instanceName) {
            //     return this.surveyFeatureSetService.getSurveyDataSet({
            //       survey: this.survey,
            //       featureServiceUrl: this.featureLayerUrl,
            //       objectIds: objectId + '',
            //       outSR: null,
            //       fieldMapping: null
            //     })
            //       .then((resp) => {
            //         const instanceOption = {
            //           isHub: this.survey.isHubItem(),
            //           instance: this.survey.form.settings.instanceName
            //         };
            //         resp.title = this.survey.title;
            //         const instance = new InstanceName(instanceOption).getInstanceValue(resp);
            //         if (instance) {
            //           outputReportName = this.utilService.stripscript(this.survey.title) + '-' + this.utilService.stripscript(instance) + '_' + moment().format('YYYYMMDDHHmmss');
            //         }
            //         return outputReportName;
            //       });
            //   } else {
            //     return Promise.resolve(outputReportName);
            //   }
            // })
            /**
             * third: execute the custom print
             */
            .then(() => {
            // execute custom print
            // let queryParams: any = { objectIds: this.getSelectedOIDs().join(',') + '' };
            // if (this.selectedMode !== 'selected') {
            // let where = PropsService.where || '1=1'; // this.where || '1=1';
            // const queryParams = JSON.parse(PropsService.queryParameters);
            // let queryParams = PropsService.queryParameters; // { where: where };
            // }
            // add sort config
            // const sortParams = this.generateSortParams();
            // if (sortParams) {
            //   queryParams['orderByFields'] = sortParams;
            // }
            let uploadInfo = null;
            // if (this.saveToItem) {
            uploadInfo = paramStore.uploadInfo || PropsService.uploadInfo || {
                type: 'arcgis', // 'ArcGIS Online',
                parameters: {},
                conflictBehavior: 'rename'
            };
            // fileName = null;
            // }
            const packageFiles = PropsService.packageFiles + '' === 'true' ? true : (PropsService.packageFiles + '' === 'false' ? false : 'auto');
            const params = {
                queryParameters: PropsService.queryParameters, //JSON.stringify(queryParams),
                templateItemId: paramStore.templateItemId || PropsService.templateItemId,
                outputReportName: fileName || '', // !this.saveToItem ? fName + '' : '',
                // surveyItemId: PropsService.surveyItemId,
                featureLayerUrl: PropsService.featureLayerUrl,
                uploadInfo: JSON.stringify(uploadInfo),
                packageFiles: packageFiles // todo: are we really need to pass this parameter?
                // mapScale: mapScale
            };
            if (PropsService.surveyItemId) {
                params.surveyItemId = paramStore.surveyItemId || PropsService.surveyItemId;
            }
            if (paramStore.outputFormat || PropsService.outputFormat) {
                params.outputFormat = paramStore.outputFormat || PropsService.outputFormat;
            }
            if (PropsService.webmapItemId) {
                params.webmapItemId = PropsService.webmapItemId;
            }
            if (Number(PropsService.mapScale) || Number(PropsService.mapScale) === 0) {
                params.mapScale = Number(PropsService.mapScale);
            }
            if (PropsService.locale) {
                params.locale = '||' + PropsService.locale;
            }
            if (PropsService.utcOffset) {
                params.utcOffset = PropsService.utcOffset;
            }
            // Use outputReportName as outputPackageName if it doesn't have any variables and outputPackageName is not specified by user
            // https://devtopia.esri.com/Beijing-R-D-Center/feature-report/issues/252
            const outputPackageName = paramStore.outputPackageName || PropsService.outputPackageName;
            if (outputPackageName) {
                params.outputPackageName = outputPackageName;
            }
            const mergeFiles = paramStore.mergeFiles || PropsService.mergeFiles;
            if (mergeFiles && mergeFiles !== 'none') {
                params.mergeFiles = mergeFiles;
            }
            const helper = this.reportService.getHelperObj();
            if (helper.canCreateItem === false) {
                delete params.uploadInfo;
            }
            let jobId = null;
            this.reportService.executeReport(params).then((res) => {
                var _a, _b;
                if (!res || !res.success) {
                    this.reportService.showError({}, {
                        errorStr: (_b = (_a = this.translator) === null || _a === void 0 ? void 0 : _a.customPrint) === null || _b === void 0 ? void 0 : _b.printErrMsg,
                        detail: res.error.message
                    });
                    // this.alertService.setOption({
                    //   alertType: 'danger',
                    //   html: this.translator?.customPrint?.printErrMsg,
                    //   detail: (res.error && res.error.message) ? res.error.message : ''
                    // }).show();
                    // template.printing = false;
                    this.isPrinting = false;
                }
                else {
                    jobId = res.jobId;
                    // this.sessionJobs.push(jobId);
                    // this.isPrinting = false;
                    // // this.isPrinting = false;
                    // this.isSubmitAnimating = true;
                    // this.offsetLeft = this.calcNumIconOffset('left');
                    // this.offsetTop = this.calcNumIconOffset('top');
                    // this.offsetOpacity = this.calcNumIconOffset('opacity');
                    // setTimeout(() => {
                    //   this.isSubmitAnimating = false;
                    //   this.offsetOpacity = this.calcNumIconOffset('opacity');
                    // }, 150);
                    // setTimeout(() => {
                    //   this.checkingListChange = false;
                    //   this.offsetLeft = this.calcNumIconOffset('left');
                    //   this.offsetTop = this.calcNumIconOffset('top');
                    // }, 1500);
                    // todo: if the current job list is 10 ,should add the new job, and delete the 10th job.
                    return this.reportService.checkJobStatus(jobId);
                }
            })
                .then(() => {
                // if there is no cheching list before ,nee to queryJobs now
                // if (this.checkingList.length === 1) {
                //   this.queryJobTimmer = this.queryJobs();
                // }
                /**
                 * jump to the recent tasks panel
                 */
                if (this.queryJobTimmer) {
                    clearTimeout(this.queryJobTimmer);
                }
                this.queryJobTimmer = setTimeout(() => {
                    this.reportService.queryJobs(true).then((resp) => {
                        this.checkingList.push(jobId);
                        this.reportCreated.emit({
                            jobId: jobId,
                            checkingList: this.checkingList,
                            jobs: (resp === null || resp === void 0 ? void 0 : resp.jobs) || []
                        });
                        this.isPrinting = false;
                    });
                }, 100);
            })
                .catch((err) => {
                var _a, _b;
                const detail = this.reportService.getErrorStr(err);
                // this.customReportService.showError(err, {errorStr:this.translator?.customPrint?.printErrMsg, detail: detail});
                // template.printing = false;
                this.reportService.showError(err, { errorStr: (_b = (_a = this.translator) === null || _a === void 0 ? void 0 : _a.customPrint) === null || _b === void 0 ? void 0 : _b.printErrMsg, detail: detail });
                this.isPrinting = false;
            });
        });
    }
    /**
     * check the job status of the preview job
     * @returns
     */
    watchTestModeJob() {
        if (!this.testModeJobObj) {
            return;
        }
        const jobId = this.testModeJobObj.jobId;
        const checking = () => {
            return this.reportService.checkJobStatus(jobId).then((statusObj) => {
                var _a, _b;
                this.testModeJobObj = statusObj;
                if (statusObj.jobStatus === 'esriJobSucceeded' || statusObj.jobStatus === 'esriJobPartialSucceeded') {
                    // let format = 'docx';
                    // if (statusObj.inputInfo && statusObj.inputInfo.parameters) {
                    //   format = statusObj.inputInfo.parameters.outputFormat || 'docx';
                    // }
                    this.reportService.downloadFile(statusObj);
                    this.isTestModePrinting = false;
                    if (statusObj.jobStatus === 'esriJobPartialSucceeded') {
                        this.reportService.showError({}, {
                            alertType: 'warning',
                            errorStr: (_b = (_a = this.translator) === null || _a === void 0 ? void 0 : _a.customPrint) === null || _b === void 0 ? void 0 : _b.printErrMsg,
                            detail: statusObj.detail || statusObj.message || (statusObj.messages && statusObj.messages.length ? statusObj.messages.reduce((acu, msg) => acu + msg) : '')
                        });
                    }
                    return true;
                }
                else if (this.testModeJobObj.jobStatus === 'esriJobFailed') {
                    this.isTestModePrinting = false;
                    throw statusObj;
                }
                else if (statusObj.error) {
                    throw statusObj.error;
                }
                else {
                    setTimeout(() => {
                        checking();
                    }, 1500);
                }
            }).catch((statusObj) => {
                var _a, _b;
                // this.alertService.setOption({
                //   alertType: 'danger',
                //   html: this.langSurveyData.customPrint.printErrMsg,
                //   detail: statusObj.detail || statusObj.message || (statusObj.messages && statusObj.messages.length ? statusObj.messages.reduce((acu, msg) => acu + msg) : '')
                // }).show();
                this.reportService.showError({}, {
                    errorStr: (_b = (_a = this.translator) === null || _a === void 0 ? void 0 : _a.customPrint) === null || _b === void 0 ? void 0 : _b.printErrMsg,
                    detail: statusObj.detail || statusObj.message || (statusObj.messages && statusObj.messages.length ? statusObj.messages.reduce((acu, msg) => acu + msg) : '')
                });
                // template.printing = false;
                this.isTestModePrinting = false;
            });
        };
        checking();
    }
    // deprecated
    // public stripscript(s) {
    //   const pattern = new RegExp("[`~!@#$^&*()=|{}':;',\\[\\]<>/?\"~！@#￥……&*（）;—|{}【】《》‘；：”“'。，、？]");
    //   let rs = '';
    //   for (let i = 0; i < s.length; i++) {
    //     rs = rs + s.substr(i, 1).replace(pattern, '_');
    //   }
    //   return rs;
    // }
    render() {
        var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q;
        return (h(Host, { key: 'aca32173e6e0e969c0321fdd6dc10145da134760' }, h("p", { key: '2a893d489dfe3a83bb27a2fe590621223025894d' }, this.supportShowCredits), this.supportShowCredits && this.visibleConf.indexOf('showCredits') >= 0 ?
            h("div", { class: "credits-info" }, h("div", { class: "show-credits has-spinner" }, this.creditsInfo && this.creditStatus === 'estimating' ?
                h(Fragment, null, h("span", { class: `${this.featureCount < 1 || (!this.printTemplates.length) ? 'disabled' : ''}`, onClick: () => this.estimateCredits() }, `${(_a = this.translator) === null || _a === void 0 ? void 0 : _a.common.calculating}`), h("calcite-loader", { label: (_b = this.translator) === null || _b === void 0 ? void 0 : _b.common.calculating, inline: "true" }))
                :
                    h("calcite-link", { disabled: `${this.featureCount < 1 || (!this.printTemplates.length) ? true : false}`, onClick: () => this.estimateCredits() }, `${(_d = (_c = this.translator) === null || _c === void 0 ? void 0 : _c.customPrint) === null || _d === void 0 ? void 0 : _d.creditsEstimate}`)), this.creditsInfo && this.creditStatus === 'finished' && this.featureCount > 0 && this.printTemplates.length ?
                h("div", { class: "credits-result-info" }, h("span", null, (_f = (_e = this.translator) === null || _e === void 0 ? void 0 : _e.customPrint) === null || _f === void 0 ? void 0 : _f.creditsRecordsCount.replace('${$recordsCount}', `${this.featureCount}`).replace('${$requiredCredits}', `${this.creditsInfo.cost}`))) : '', this.creditsInfo && this.creditStatus === 'changed' && this.featureCount > 0 && this.printTemplates.length ?
                h("div", { class: "credits-result-info" }, h("span", null, (_h = (_g = this.translator) === null || _g === void 0 ? void 0 : _g.customPrint) === null || _h === void 0 ? void 0 : _h.credtisResultInvalid)) : '') : '', h("div", { key: 'bc95469bad71ab752a604a34b258471f73992a8f', class: `execute-btn ${!this.isPortal && this.featureCount <= this.batchPrintLimitCount && this.canShowEstimateCredits ? '' : 'portal-btn'}` }, h("a", { key: 'cdc19e375ccf3d035b72706b70ba771b185e9706', class: "no-hover" }, h("calcite-button", { key: '32ec0cfa2757e0d8124ba0c9703d90f2d1850e62', id: "submit-btn", disabled: this.isPrinting || !this.buttonClickable(), onClick: () => this.executeCustomPrint() }, (_k = (_j = this.translator) === null || _j === void 0 ? void 0 : _j.customPrint) === null || _k === void 0 ? void 0 :
            _k.generate, this.isPrinting ?
            h("calcite-loader", { label: (_m = (_l = this.translator) === null || _l === void 0 ? void 0 : _l.common) === null || _m === void 0 ? void 0 : _m.loading, inline: "true" })
            : null), (this.printTemplates || []).length > 0 || this.templateItemId || ((_o = this.visibleConf) === null || _o === void 0 ? void 0 : _o.indexOf('selectTemplate')) >= 0 ?
            null :
            h("calcite-notice", { open: true, kind: "danger", scale: "s", width: "auto" }, h("div", { slot: "message" }, (_q = (_p = this.translator) === null || _p === void 0 ? void 0 : _p.customPrint) === null || _q === void 0 ? void 0 : _q.chooseTemplateNoOneYet1)))), h("slot", { key: '5ff5f48aaf6df90e383672eb15e850a46a867f48' })));
    }
};
ReportGenerator.style = ReportGeneratorStyle0;

const reportSettingsCss = ":host{display:block;padding:0 0.75rem}:host .heading{margin-inline:0px;margin-block:1.25rem 1rem;font-size:var(--calcite-font-size-0);line-height:1.25rem;font-weight:var(--calcite-font-weight-medium)}:host .folder-label{display:flex;justify-content:space-between;align-items:center}:host .conflict-name-setting{padding-block:0.5rem;padding-inline:0.75rem;font-size:var(--calcite-font-size--1);line-height:1rem}";
const ReportSettingsStyle0 = reportSettingsCss;

const ReportSettings = class {
    constructor(hostRef) {
        registerInstance(this, hostRef);
        this.fileOptionChange = createEvent(this, "fileOptionChange", 7);
        this.fileNameChange = createEvent(this, "fileNameChange", 7);
        this.selectedFolderChange = createEvent(this, "selectedFolderChange", 7);
        this.selectedFileFormatChange = createEvent(this, "selectedFileFormatChange", 7);
        this.reportService = ReportService.getService();
        this.state = StateService.getService();
        this.mergeFiles = undefined;
        this.outputFormat = 'word';
        this.conflictBehavior = 'rename';
        this.fileName = undefined;
        this.visibleElems = [];
        this.translator = undefined;
        this.langReport = undefined;
        this.helperObj = undefined;
        this.featureCount = undefined;
        this.printTemplates = [];
    }
    onFileNameChange() {
        this.fileNameChangeHandler({
            target: {
                value: this.fileName
            }
        });
    }
    componentWillLoad() {
        return Promise.resolve(true)
            // .then(() => {
            //   return TranslateService.getService().getTranslate();
            // })
            .then(() => {
            const res = TranslateService.getService().getTranslateSync();
            this.translator = res;
            this.langReport = res === null || res === void 0 ? void 0 : res.customPrint;
            this.state.subscribe('locale-data-changed', (data) => {
                this.translator = data;
                this.langReport = data === null || data === void 0 ? void 0 : data.customPrint;
            });
            // this.langCommon = res.common;
            this.printTemplates = this.reportService.getHelperObj('printTemplates') || [];
            this.state.subscribe('print-templates-updated', (data) => {
                this.printTemplates = data || [];
            });
            this.helperObj = this.reportService.getHelperObj();
            this.featureCount = this.reportService.getHelperObj('featureCount') || 0;
            this.state.subscribe('portal-info-update', () => {
                this.featureCount = this.reportService.getHelperObj('featureCount') || 0;
            });
            this.state.subscribe('feature-count-updated', () => {
                this.featureCount = this.reportService.getHelperObj('featureCount') || 0;
            });
            return this.getUserFolders();
        }).catch((err) => {
            this.reportService.showError(err);
        });
    }
    /**
     * merge mode change: 'none' | 'nextPage' | 'continuous'
     * @param evt
     */
    fileOptChangeHandler(evt) {
        const cachedParam = this.reportService.getParamCache();
        if (evt.detail !== 'split') {
            cachedParam.mergeFiles = evt.detail;
        }
        else {
            delete cachedParam.mergeFiles;
        }
        this.fileOptionChange.emit(evt.detail);
    }
    /**
     * file name change handler
     * @param evt
     */
    fileNameChangeHandler(evt) {
        this.fileName = evt.target.value;
        const outputReportName = this.fileName;
        // Use outputReportName as outputPackageName if it doesn't have any variables and outputPackageName is not specified by user
        // https://devtopia.esri.com/Beijing-R-D-Center/feature-report/issues/252
        if (outputReportName) {
            const placeholders = this.extractPlaceholders(outputReportName);
            if (!(placeholders && placeholders.length)) {
                this.reportService.setParamCache({
                    outputPackageName: outputReportName
                });
            }
        }
        this.reportService.setParamCache({
            outputReportName: outputReportName
        });
        this.fileNameChange.emit(this.fileName);
    }
    /**
     * selected folder changed
     * @param evt
     */
    selectedFolderChangeHandler() {
        const uploadInfo = this.reportService.getParamCache('uploadInfo') || {
            type: 'arcgis', // 'ArcGIS Online',
            parameters: {},
            conflictBehavior: 'rename'
        };
        uploadInfo.parameters.folderId = this.selectedFolder.id === 'all' ? '' : this.selectedFolder.id;
        this.reportService.setParamCache({
            uploadInfo: uploadInfo
        });
        this.selectedFolderChange.emit(this.selectedFolder);
    }
    /**
     * selected format handlder
     * @param evt
     */
    outputFormatChangeHandler(evt) {
        this.outputFormat = evt.target.value;
        this.reportService.setParamCache({
            outputFormat: this.outputFormat
        });
        this.selectedFileFormatChange.emit(this.outputFormat);
    }
    /**
     * get user folders
     * @returns
     */
    getUserFolders() {
        var _a, _b;
        const utilService = UtilService.getService();
        const userName = (_a = utilService.getUser()) === null || _a === void 0 ? void 0 : _a.username;
        const rootFolderStr = (_b = this.langReport) === null || _b === void 0 ? void 0 : _b.saveToAGOFolderRoot.replace('${$username}', userName);
        const params = Object.assign({ owner: userName }, utilService.getBaseRequestOptions());
        return getUserContent(params).then((res) => {
            this.folders = [];
            const folders = [];
            // add root folder
            folders.push({
                username: userName,
                id: 'all',
                value: 'all',
                title: rootFolderStr, // todo: use i18n string
                label: rootFolderStr,
                created: null
            });
            if (res && res.folders && res.folders.length) {
                res.folders.forEach((folder) => {
                    folder['label'] = folder.title;
                    folder['value'] = folder.id;
                });
                this.folders = folders.concat(res.folders);
            }
            else {
                this.folders = folders;
            }
            // if the folder name is the same as the survey title, set it as the default folder
            // this.selectedFolder = this.folders.find((fd) => {
            //   return fd.title === 'Survey-' + this.survey.title;
            // }) || this.folders[0];
            this.selectedFolder = this.folders[0];
            return this.folders;
        });
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
     * confilict behavior changed.
     * @param evt
     */
    changeConflictBehavior(evt) {
        this.conflictBehavior = evt.target.value;
        const uploadInfo = this.reportService.getParamCache('uploadInfo') || {
            type: 'arcgis',
            parameters: {},
            conflictBehavior: 'rename'
        };
        uploadInfo.conflictBehavior = this.conflictBehavior;
        this.reportService.setParamCache({
            uploadInfo: uploadInfo
        });
    }
    render() {
        var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r, _s, _t, _u, _v, _w, _x, _y, _z, _0, _1, _2, _3, _4, _5;
        return (h(Host, { key: 'f7533ed880148f57d8d02b32f1c098b7a50aaf0c' }, h("div", { key: '2a9949c62bbb802797eb7f959769290f665d5d58', class: "heading" }, (_b = (_a = this.translator) === null || _a === void 0 ? void 0 : _a.customPrint) === null || _b === void 0 ? void 0 : _b.resultSettingsLabel1), this.visibleElems.indexOf('fileOptions') < 0 ?
            null : h("file-option-chooser", { fileOption: this.mergeFiles, onFileOptionChange: (evt) => { this.fileOptChangeHandler(evt); } }), this.visibleElems.indexOf('reportName') < 0 ?
            null :
            h("calcite-label", null, (_d = (_c = this.translator) === null || _c === void 0 ? void 0 : _c.customPrint) === null || _d === void 0 ? void 0 :
                _d.saveToAGOItemName, h("calcite-input-text", { placeholder: (_f = (_e = this.translator) === null || _e === void 0 ? void 0 : _e.customPrint) === null || _f === void 0 ? void 0 : _f.saveToAGOItemName, value: this.fileName, onCalciteInputTextChange: (evt) => this.fileNameChangeHandler(evt) })), this.visibleElems.indexOf('saveToAGSAccount') < 0 ? null :
            h("calcite-label", null, h("div", { class: "folder-label" }, h("span", null, (_h = (_g = this.translator) === null || _g === void 0 ? void 0 : _g.customPrint) === null || _h === void 0 ? void 0 : _h.saveToAGOFolder), h("calcite-dropdown", { width: "l", scale: "m", "close-on-select-disabled": true, type: "click", "width-scale": "l" }, h("calcite-button", { slot: "trigger", "icon-start": "gear", appearance: "transparent" }), h("calcite-dropdown-group", null, h("div", { class: "conflict-name-setting" }, h("calcite-radio-button-group", { name: "conflict-name-options", layout: "vertical" }, h("calcite-label", { layout: "inline" }, (_k = (_j = this.translator) === null || _j === void 0 ? void 0 : _j.customPrint) === null || _k === void 0 ? void 0 :
                _k.nameConflictOptLabel, h("calcite-icon", { id: "info-icon", icon: "question", scale: "s" }, " "), h("calcite-tooltip", { label: (_m = (_l = this.translator) === null || _l === void 0 ? void 0 : _l.customPrint) === null || _m === void 0 ? void 0 : _m.nameConflictOptLabel, "reference-element": "info-icon" }, h("span", null, (_p = (_o = this.translator) === null || _o === void 0 ? void 0 : _o.customPrint) === null || _p === void 0 ? void 0 : _p.nameConflictOptLabel))), h("calcite-label", { layout: "inline" }, h("calcite-radio-button", { value: "rename", checked: this.conflictBehavior == 'rename', onCalciteRadioButtonChange: (evt) => this.changeConflictBehavior(evt) }), (_r = (_q = this.translator) === null || _q === void 0 ? void 0 : _q.customPrint) === null || _r === void 0 ? void 0 :
                _r.nameConflictOptRename), h("calcite-label", { layout: "inline" }, h("calcite-radio-button", { value: "replace", checked: this.conflictBehavior == 'replace', onCalciteRadioButtonChange: (evt) => this.changeConflictBehavior(evt) }), (_t = (_s = this.translator) === null || _s === void 0 ? void 0 : _s.customPrint) === null || _t === void 0 ? void 0 :
                _t.nameConflictOptReplace), h("calcite-label", { layout: "inline" }, h("calcite-radio-button", { value: "fail", checked: this.conflictBehavior == 'fail', onCalciteRadioButtonChange: (evt) => this.changeConflictBehavior(evt) }), (_v = (_u = this.translator) === null || _u === void 0 ? void 0 : _u.customPrint) === null || _v === void 0 ? void 0 :
                _v.nameConflictOptSkip)))))), h("calcite-tooltip", { label: this.helperObj.canCreateItem === false ? this.langReport.saveToAGONoCreatePrivilegeTip : '', "reference-element": "folder-selector" }, h("span", null, this.helperObj.canCreateItem === false ? this.langReport.saveToAGONoCreatePrivilegeTip : '')), h("calcite-combobox", { id: "folder-selector", disabled: this.helperObj.canCreateItem === false, placeholder: (_x = (_w = this.translator) === null || _w === void 0 ? void 0 : _w.customPrint) === null || _x === void 0 ? void 0 : _x.saveToAGOFolder, "selection-mode": "single-persist", clearDisabled: "true", maxItems: "7", value: this.selectedFolder, onCalciteComboboxChange: () => { this.selectedFolderChangeHandler(); } }, (this.folders || []).map((folder) => {
                var _a;
                return h("calcite-combobox-item", { value: folder.value, "text-label": folder.label, selected: folder.value === ((_a = this.selectedFolder) === null || _a === void 0 ? void 0 : _a.id) });
            }))), this.visibleElems.indexOf('outputFormat') < 0 ? null :
            h("calcite-label", null, (_z = (_y = this.translator) === null || _y === void 0 ? void 0 : _y.customPrint) === null || _z === void 0 ? void 0 :
                _z.outputFormat, h("calcite-combobox", { placeholder: (_1 = (_0 = this.translator) === null || _0 === void 0 ? void 0 : _0.customPrint) === null || _1 === void 0 ? void 0 : _1.outputFormat, "selection-mode": "single-persist", clearDisabled: "true", value: this.outputFormat, onCalciteComboboxChange: (evt) => this.outputFormatChangeHandler(evt) }, h("calcite-combobox-item", { value: 'docx', selected: this.outputFormat === 'docx', "text-label": (_3 = (_2 = this.translator) === null || _2 === void 0 ? void 0 : _2.customPrint) === null || _3 === void 0 ? void 0 : _3.outputFormatDocx }), h("calcite-combobox-item", { value: 'pdf', selected: this.outputFormat === 'pdf', "text-label": (_5 = (_4 = this.translator) === null || _4 === void 0 ? void 0 : _4.customPrint) === null || _5 === void 0 ? void 0 : _5.outputFormatPdf }))), h("slot", { key: '0ea7f1954b4d990870bce17a6f6ab3d9904242df' })));
    }
    static get watchers() { return {
        "fileName": ["onFileNameChange"]
    }; }
};
ReportSettings.style = ReportSettingsStyle0;

const taskListCss = ":host{display:block}:host *{-webkit-box-sizing:border-box;-moz-box-sizing:border-box;box-sizing:border-box}:host *{font-size:14px}:host .banner{cursor:pointer;font-weight:700;line-height:60px}:host .banner a{cursor:pointer;float:inline-start;transform:rotateZ(180deg);top:16px}:host .banner span{float:inline-start;padding-left:10px}:host .no-tasks{margin-bottom:20px}:host .list{height:calc(100% - 60px);padding:0 0.75rem;overflow:auto;width:100%}:host .list ul{padding-left:0}:host .list ul li{list-style:none;margin-bottom:15px;border-radius:2px}:host .list p.job-date{color:#979797;line-height:40px;margin-bottom:0}:host-context([dir=rtl]) .banner a{transform:none !important}:host-context([dir=rtl]) .banner span{padding-right:10px;padding-left:unset !important}:host-context([dir=rtl]) list ul{padding-right:0;padding-left:unset !important}";
const TaskListStyle0 = taskListCss;

const ReportTaskList = class {
    constructor(hostRef) {
        registerInstance(this, hostRef);
        this.goBackClicked = createEvent(this, "goBackClicked", 7);
        this.recentTasksCount = 10;
        this.reportService = ReportService.getService();
        this.stateService = StateService.getService();
        this.utilService = UtilService.getService();
        this.langReport = undefined;
        this.langCommon = undefined;
        this.langTasks = undefined;
        this.state = 'loading';
        this.jobs = undefined;
    }
    componentWillLoad() {
        this.state = 'loading';
        Promise.resolve(true)
            // .then(() => {
            //   return TranslateService.getService().getTranslate();
            // })
            .then(() => {
            var _a;
            const res = TranslateService.getService().getTranslateSync();
            this.langReport = res === null || res === void 0 ? void 0 : res.customPrint;
            this.langCommon = res === null || res === void 0 ? void 0 : res.common;
            this.langTasks = res === null || res === void 0 ? void 0 : res.customPrint.recentTasks;
            this.stateService.subscribe('locale-data-changed', (data) => {
                this.langReport = data === null || data === void 0 ? void 0 : data.customPrint;
                this.langCommon = data === null || data === void 0 ? void 0 : data.common;
                this.langTasks = data === null || data === void 0 ? void 0 : data.customPrint.recentTasks;
            });
            if ((_a = this.jobs) === null || _a === void 0 ? void 0 : _a.length) {
                return {
                    jobs: this.jobs
                };
            }
            return this.reportService.queryJobs(true);
        })
            .then((res) => {
            var _a;
            this.jobList = res;
            this.jobs = ((_a = this.jobList) === null || _a === void 0 ? void 0 : _a.jobs) || [];
            this.state = 'ready';
            return this.jobList;
        });
    }
    jobSplitDate(job, index) {
        if (!this.jobs || index < 0 || index >= this.jobs.length || !job) {
            return null;
        }
        const curDate = this.utilService.formatDateTime(job.submitted, 'date');
        if (index === 0) {
            return curDate;
        }
        if (this.jobs[index - 1]) {
            const lastDate = this.utilService.formatDateTime(this.jobs[index - 1].submitted, 'date');
            if (lastDate === curDate) {
                return null;
            }
            else {
                return curDate;
            }
        }
        return null;
    }
    goBack() {
        this.goBackClicked.emit();
    }
    removeJob(evt) {
        const job = evt.detail;
        if (this.jobs) {
            const targetIdx = this.jobs.findIndex((jobItem) => {
                return jobItem.jobId === job.jobId;
            });
            this.jobs.splice(targetIdx, 1);
            this.jobs = [].concat(this.jobs);
        }
    }
    render() {
        var _a, _b;
        return (h(Host, { key: '9e04f7f484918b584487a2cd887a4473424e2a86' }, h("div", { key: '7bd7270ce284bdc0d8bf858c6d4726e165d96b88', class: "banner" }, h("calcite-action", { key: '53d1f3665321ff931bfd32771d01baba7995676c', onClick: () => this.goBack(), text: (_a = this.langTasks) === null || _a === void 0 ? void 0 : _a.label, icon: "chevrons-left", "text-enabled": true })), this.state === 'ready' && this.langReport && this.langCommon && this.langTasks && this.jobList ?
            h("div", { class: "list" }, this.jobs.length < 1 ?
                h("div", { class: "no-tasks" }, this.langTasks.noTaskDesc)
                : '', this.jobs.length ?
                h(Fragment, null, h("div", { class: "no-tasks" }, this.langTasks.limitationDesc.replace('${$maxJobCount}', `${this.recentTasksCount}`)), h("ul", null, this.jobs.map((job, index) => {
                    return h("li", { key: 'li_' + job.jobId }, this.jobSplitDate(job, index) ? h("p", { class: "job-date" }, this.jobSplitDate(job, index)) : '', h("task-info", { key: job.jobId, job: job, onJobRemoved: (evt) => this.removeJob(evt) }));
                }))) : '')
            :
                h("div", { class: "loading" }, h("calcite-loader", { label: (_b = this.langCommon) === null || _b === void 0 ? void 0 : _b.loading })), h("slot", { key: '6e879c58da983aa00e6040ae7a5e7efbf61d8a2b' })));
    }
};
ReportTaskList.style = TaskListStyle0;

const templateChooserCss = ":host{display:block;padding:0 0.75rem}:host calcite-notice{margin-top:6px}:host .heading{margin-inline:0px;margin-block:1.25rem 1rem;font-size:var(--calcite-font-size-0);line-height:1.25rem;font-weight:var(--calcite-font-weight-medium)}";
const TemplateChooserStyle0 = templateChooserCss;

const TemplateChooser = class {
    constructor(hostRef) {
        registerInstance(this, hostRef);
        this.selectedTemplateChange = createEvent(this, "selectedTemplateChange", 7);
        this.reportService = ReportService.getService();
        this.stateService = StateService.getService();
        this.langObj = undefined;
        this.selectedTemplateId = undefined;
        this.templateIds = undefined;
        this.templates = [];
        this.translator = undefined;
    }
    selectedTemplateIdChanged() {
        this.reportService.setParamCache({
            templateItemId: this.selectedTemplateId
        });
    }
    templateIdsChanged() {
        this.init();
    }
    componentWillLoad() {
        this.reportService.setParamCache({
            templateItemId: this.selectedTemplateId
        });
        return Promise.resolve(true)
            // .then(() => {
            //   return TranslateService.getService().getTranslate();
            // })
            .then(() => {
            const res = TranslateService.getService().getTranslateSync();
            this.translator = res;
            this.stateService.subscribe('locale-data-changed', (data) => {
                this.translator = data;
            });
            return this.init();
        });
    }
    init() {
        const globalProps = PropsService;
        const reportService = ReportService.getService();
        return Promise.resolve(true).then(() => {
            if (this.templateIds === undefined) {
                return reportService.getReportTemplates(globalProps.surveyItemId);
            }
            else {
                return reportService.getReportTemplates(globalProps.surveyItemId, { templateIds: this.templateIds });
            }
        })
            .then((templates) => {
            this.templates = templates;
            this.stateService.notifyDataChanged('print-templates-updated', { value: templates });
            this.reportService.setHelperObj({
                printTemplates: templates
            });
            // use the first one as default, if the selected template id is not provided
            if (!this.selectedTemplateId && templates.length) {
                this.selectedTemplateId = templates[0].id;
                this.reportService.setParamCache({
                    templateItemId: this.selectedTemplateId
                });
                this.selectedTemplateChange.emit(this.selectedTemplateId);
            }
            return true;
        }).catch((err) => {
            this.reportService.showError(err);
        });
    }
    /**
     *
     * @param evt
     */
    selectedTemplateChangeHandler(evt) {
        this.reportService.setParamCache({
            templateItemId: evt.target.value
        });
        this.selectedTemplateChange.emit(evt.target.value);
    }
    render() {
        var _a, _b, _c;
        return (h(Host, { key: '7f3ef2c784e04f8a1a0d1861200d4c794ed50fb7' }, h("div", { key: '5e54734af22f84f41e1f5a6c87773e6c0a302869', class: "heading" }, (_a = this.translator) === null || _a === void 0 ? void 0 : _a.customPrint.chooseTemplateLabel1), h("calcite-combobox", { key: '7eb5e61f8d97e61b6421ac73a6a814842e5e11a0', placeholder: (_b = this.translator) === null || _b === void 0 ? void 0 : _b.customPrint.chooseTemplateLabel1, "selection-mode": "single-persist", clearDisabled: "true", value: this.selectedTemplateId, onCalciteComboboxChange: (evt) => { this.selectedTemplateChangeHandler(evt); } }, (this.templates || []).map((template) => {
            return h("calcite-combobox-item", { value: template.id, "text-label": template.title, selected: template.id === this.selectedTemplateId });
        })), (this.templates || []).length > 0 ?
            null :
            h("calcite-notice", { open: true, kind: "danger", scale: "s", width: "auto" }, h("div", { slot: "message" }, (_c = this.translator) === null || _c === void 0 ? void 0 : _c.customPrint.chooseTemplateNoOneYet1)), h("slot", { key: '2cea7b7e4e0d4591c35e8466f4295af2b6119c66' })));
    }
    get element() { return getElement(this); }
    static get watchers() { return {
        "selectedTemplateId": ["selectedTemplateIdChanged"],
        "templateIds": ["templateIdsChanged"]
    }; }
};
TemplateChooser.style = TemplateChooserStyle0;

export { FeaturesPreview as features_preview, ReportGenerator as report_generator, ReportSettings as report_settings, ReportTaskList as task_list, TemplateChooser as template_chooser };

//# sourceMappingURL=features-preview_5.entry.js.map