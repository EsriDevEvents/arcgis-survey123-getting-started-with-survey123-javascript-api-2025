import { proxyCustomElement, HTMLElement, createEvent, h, Host, Fragment } from '@stencil/core/internal/client';
import { T as TranslateService } from './translate.service.js';
import { R as ReportService } from './report.service.js';
import { P as PropsService } from './props.service.js';
import { U as UtilService } from './util.service.js';
import { S as StateService } from './state.service.js';

const reportGeneratorCss = ":host{padding:0 0.75rem;display:block}:host .clickable-text{cursor:pointer;font-weight:normal}:host calcite-notice{margin-top:6px}:host .credits-info{margin:10px 0 10px 0;padding:10px 0;background-color:var(--calcite-color-foreground-3);color:var(--calcite-color-text-2);display:flex;justify-content:space-between}:host .credits-info>div{margin:0px 10px}:host .credits-info .show-credits{display:inline-flex;align-items:center}:host .credits-info .show-credits survey123-ui-spinner{line-height:0}:host .credits-info .show-credits ::ng-deep span{line-height:0}:host .credits-info .show-credits .icon-spin.icon-refresh{top:1px}:host .credits-info .show-credits .spinner{-webkit-transition:none;-moz-transition:none;-o-transition:none;transition:none}:host .credits-info .show-credits span:not(.clickable-text){cursor:default}:host .credits-info .show-credits span.clickable-text.disabled{cursor:not-allowed}:host .credits-info .credits-result-info{flex-grow:1;display:flex;justify-content:flex-end}:host .credits-info .credits-result-info span{word-break:break-word}:host .pieview-info{margin-top:10px;margin-bottom:20px}:host .pieview-info .has-spinner>span{cursor:default}:host .pieview-info .has-spinner>span.report-status{padding:0 2px}:host .pieview-info .preview-text{cursor:default;display:flex;align-items:center}:host .pieview-info .preview-text>span{cursor:pointer}:host .pieview-info .preview-text.disabled{text-decoration:underline solid #979797;color:#979797;cursor:not-allowed}:host .pieview-info .preview-text.disabled>span{cursor:not-allowed}:host .execute-btn{overflow:auto;margin:-5px 0 30px 0}:host .execute-btn>span{line-height:41px}:host .execute-btn a{float:inline-start}:host .execute-btn a button{width:auto}:host .execute-btn.portal-btn{margin:20px 0}:host calcite-loader{display:inline-block;margin:0 0 0 10px}";
const ReportGeneratorStyle0 = reportGeneratorCss;

const ReportGenerator = /*@__PURE__*/ proxyCustomElement(class ReportGenerator extends HTMLElement {
    constructor() {
        super();
        this.__registerHost();
        this.__attachShadow();
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
    static get style() { return ReportGeneratorStyle0; }
}, [1, "report-generator", {
        "langObj": [8, "lang-obj"],
        "visibleConf": [8, "visible-conf"],
        "templateItemId": [1, "template-item-id"],
        "featureCount": [32],
        "supportShowCredits": [32],
        "printTemplates": [32],
        "creditsInfo": [32],
        "creditStatus": [32],
        "testModeJobObj": [32],
        "isTestModePrinting": [32],
        "isPrinting": [32],
        "translator": [32]
    }]);
function defineCustomElement() {
    if (typeof customElements === "undefined") {
        return;
    }
    const components = ["report-generator"];
    components.forEach(tagName => { switch (tagName) {
        case "report-generator":
            if (!customElements.get(tagName)) {
                customElements.define(tagName, ReportGenerator);
            }
            break;
    } });
}

export { ReportGenerator as R, defineCustomElement as d };

//# sourceMappingURL=report-generator2.js.map