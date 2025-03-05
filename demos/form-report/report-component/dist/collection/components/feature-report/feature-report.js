import { Fragment, Host, h } from "@stencil/core";
// import { ReportBase } from '../report-base/report-base';
import { PropsService } from "../../services/props.service";
import { EsriJobStatusType, ReportService } from "../../services/report.service";
import { UtilService } from "../../services/util.service";
import { TranslateService } from "../../services/translate.service";
import { StateService } from "../../services/state.service";
import { ArcGISIdentityManager, request } from "@esri/arcgis-rest-request";
export class FeatureReport {
    constructor() {
        this.stateService = StateService.getService();
        this.reportService = ReportService.getService();
        this.token = undefined;
        this.portalUrl = undefined;
        this.apiUrl = undefined;
        this.featureLayerUrl = undefined;
        this.surveyItemId = undefined;
        this.templateItemId = undefined;
        this.queryParameters = undefined;
        this.mergeFiles = undefined;
        this.outputFormat = undefined;
        this.outputReportName = undefined;
        this.outputPackageName = undefined;
        this.packageFiles = undefined;
        this.uploadInfo = undefined;
        this.webmapItemId = undefined;
        this.mapScale = undefined;
        this.locale = undefined;
        this.utcOffset = undefined;
        this.show = undefined;
        this.hide = undefined;
        this.inputFeatureTemplate = undefined;
        this.label = undefined;
        this.reportTemplateIds = undefined;
        this.clientId = undefined;
        this.requestSource = undefined;
        this.where = undefined;
        this.username = undefined;
        this.state = 'generate-report';
        this.visibleConf = [];
        this.checkingList = [];
        this.jobs = [];
        this.error = undefined;
        this.langTasks = undefined;
        this.langCommon = undefined;
        this.langCustomPrint = undefined;
        this.surveyItemInfo = undefined;
    }
    templateItemIdChanged(newVal) {
        PropsService.setProps({ templateItemId: newVal });
    }
    queryParametersChanged(newVal) {
        PropsService.setProps({
            queryParameters: newVal
        });
        return this.reportService.getFeatureCount().then(() => {
            this.stateService.notifyDataChanged('update-features-preview', { value: undefined }); // no not use {value: null} here.
        });
    }
    mergeFilesChanged(newVal) {
        PropsService.setProps({
            mergeFiles: newVal
        });
    }
    outputFormatChanged(newVal) {
        PropsService.setProps({ outputFormat: newVal });
        this.outputFormat = PropsService.outputFormat;
    }
    localeChanged(newVal) {
        this.localeChangeHandler(newVal);
        UtilService.getService().setDir();
    }
    showChanged(newValue) {
        // console.log(newValue, oldValue);
        PropsService.setProps({ show: newValue });
        this.visibleConf = this.generateVisibleElems();
        this.reportService.setHelperObj({
            visibleConf: this.visibleConf
        });
    }
    hideChanged(newVal) {
        PropsService.setProps({ hide: newVal });
        this.visibleConf = this.generateVisibleElems();
        this.reportService.setHelperObj({
            visibleConf: this.visibleConf
        });
    }
    inputFeatureTemplateChanged(newVal) {
        PropsService.setProps({ inputFeatureTemplate: newVal });
        this.stateService.notifyDataChanged('update-features-preview', { value: this.inputFeatureTemplate });
    }
    labelChanged(newVal) {
        PropsService.setProps({ label: newVal });
        return Promise.resolve(true)
            .then(() => {
            return TranslateService.getService().getTranslate();
        })
            .then((res) => {
            const langTasks = res.customPrint.recentTasks;
            this.langCustomPrint = res.customPrint;
            this.langTasks = langTasks;
            this.langCommon = res.common;
            this.stateService.notifyDataChanged('locale-data-changed', { value: res });
        });
    }
    reportTemplateIdsChanged(newVal) {
        PropsService.setProps({
            reportTemplateIds: newVal
        });
        // the select segment is hidden, update the report templates
        this.updateTemplateList();
    }
    requestSourceChanged(newVal) {
        PropsService.setProps({
            requestSource: newVal
        });
    }
    componentWillLoad() {
        PropsService.setProps(this);
        this.portalUrl = PropsService.portalUrl;
        this.outputFormat = PropsService.outputFormat;
        return Promise.resolve(true)
            .then(() => {
            return TranslateService.getService().getTranslate();
        })
            .then((res) => {
            const langTasks = res.customPrint.recentTasks;
            this.langCustomPrint = res.customPrint;
            this.langTasks = langTasks;
            this.langCommon = res.common;
            this.i18nStringUpdated.emit({ locale: PropsService.locale, i18n: this.langCommon });
            if (!this.isOAuthCallbackpage()) {
                if (!this.featureLayerUrl) {
                    this.error = { html: res.customPrint.missingRequiredParamsErr.replace('${$paramName}', `featureLayerUrl`) };
                    throw new Error('featureLayerUrl is required.');
                }
                if (!this.queryParameters) {
                    this.error = { html: res.customPrint.missingRequiredParamsErr.replace('${$paramName}', `queryParameters`) };
                    throw new Error('queryParameters is required.');
                }
            }
        })
            .then(() => {
            if (this.token) {
                this.init();
                return true;
            }
            else if (!this.token) {
                // the callback page navigated from the oauth page
                if (this.isOAuthCallbackpage()) {
                    /**
                     * the code is added from the oauth page navigation, as this is a web component, we can't use a dedicated oauth callback page, we have to use the original page,
                     * but if set the redirectUri as window.location.href here, the completeOAuth2 request will return invalid redirectUri error, because the url parameter has 'codes' and 'state'
                     * in fact, we didn't know what the correct redirectUri is, because it's not set by us, we are not the client id owner.
                     * so, maybe we should not call the ArcGISIdentityManager.beginOAuth2() here.
                     * Need a discussion with team.
                     */
                    const portalRest = `${this.portalUrl}/sharing/rest`;
                    const url = new URL(window.location.href);
                    const redirect_url = `${url.origin}${url.pathname}?portalUrl=${this.portalUrl}&isOAuthCallback=true`;
                    // #749, the redirect_url in completeOAuth2 and beginOAuth2 must be the same.
                    ArcGISIdentityManager.completeOAuth2({ portal: portalRest, popup: true, clientId: this.clientId, redirectUri: redirect_url });
                    return;
                }
                else {
                    // there is a bug in the platformSelf function inside of the @esri/arcgis-rest-request: the request: the "withCredentials" is from 
                    // platformSelf(this.clientId, 'https://localhost:3333/', this.portalUrl).then(response => {
                    const requestUrl = `${this.portalUrl}/sharing/rest/oauth2/platformSelf?f=json`;
                    const param = {
                        httpMethod: 'POST',
                        headers: {
                            "X-Esri-Auth-Client-Id": this.clientId,
                            "X-Esri-Auth-Redirect-Uri": window.location.href
                        },
                        params: {
                            f: 'json'
                        },
                        credentials: 'include'
                    };
                    return request(requestUrl, param).then((response) => {
                        if (response.expires_in) {
                            response.expires = new Date().valueOf() + response.expires_in * 1000 - 1000 * 5;
                            delete response.expires_in;
                        }
                        this._credentialGetted.emit(response);
                        this.token = response.token;
                        PropsService.setProps(this);
                        this.init();
                        return true;
                    }).catch(() => {
                        this.state = 'login';
                        // this.switchState('login');
                        // (document.querySelector('#login-modal') as any).open = true;
                        // return this.waitingUserLogin();
                    });
                }
            }
        }).catch((e) => {
            console.error(e);
        });
    }
    /**
     * init the component
     * before enter in this function, the token prop must be ready
     */
    init() {
        // init the constructor of the props service
        const utilService = UtilService.getService();
        this.stateService.subscribe('job-complete', (job) => {
            var _a;
            const idx = this.checkingList.indexOf(job.jobId);
            if (idx >= 0) {
                if (job.jobStatus === EsriJobStatusType.partialSucceeded || job.jobStatus === EsriJobStatusType.succeeded) {
                    if ((_a = job === null || job === void 0 ? void 0 : job.resultInfo) === null || _a === void 0 ? void 0 : _a.resultFiles) {
                        this.checkingList.splice(idx, 1);
                        this.checkingList = [].concat(this.checkingList);
                        this.reportService.downloadReport(job);
                    }
                }
            }
        });
        this.stateService.subscribe('show-error', (err) => {
            this.error = err;
        });
        return Promise.resolve(true)
            .then(() => {
            // PropsService.setProps(this);
            if (this.uploadInfo) {
                this.reportService.setParamCache({
                    uploadInfo: JSON.parse(this.uploadInfo)
                });
            }
            return true;
        })
            // .then(() => {
            //   return TranslateService.getService().getTranslate();
            // })
            // .then((res) => {
            //   const langTasks = res.customPrint.recentTasks;
            //   this.langTasks = langTasks;
            // })
            .then(() => {
            return utilService.getPortalInfo();
        }).then((portalInfo) => {
            /**
             * check canCreateItem privilege
             */
            const canCreateItem = portalInfo.user.privileges.includes('portal:user:createItem');
            this.reportService.setHelperObj({ canCreateItem: canCreateItem });
            this.userInfoGetted.emit(portalInfo.user);
            if (!this.locale) {
                const newLocale = PropsService.getLocale({
                    userInfo: portalInfo.user,
                    portalInfo: portalInfo
                });
                if (newLocale !== PropsService.locale) {
                    this.localeChangeHandler(newLocale);
                }
            }
            else {
                this.i18nStringUpdated.emit({ locale: this.locale, i18n: this.langCommon });
            }
            UtilService.getService().setDir();
            // show elements after user info is gotten, because the user name is needed for the report setting section.
            this.visibleConf = this.generateVisibleElems();
            this.reportService.setHelperObj({
                visibleConf: this.visibleConf
            });
            this.stateService.notifyDataChanged('portal-info-updated');
            if (PropsService.surveyItemId) {
                return utilService.getSurveyItemInfo(PropsService.surveyItemId);
            }
            // return true;
        })
            .catch((e) => {
            this.reportService.setHelperObj({ surveyIsInvalid: true });
            this.surveyItemInfo = {};
            this.reportService.manageError(e, 'surveyItemId');
        })
            .then((surveyItemInfo) => {
            this.surveyItemInfo = surveyItemInfo;
            this.reportService.setHelperObj({ surveyIsInvalid: false });
            this.reportService.initParamCache();
            return this.reportService.getFeatureCount();
        })
            .then(() => {
            this.stateService.notifyDataChanged('update-features-preview', { value: undefined });
            // if the template chooser component will hidden, get the templates
            // todo: seems we only need to choose the selected template?
            return this.updateTemplateList();
        })
            .catch((err) => {
            if (err.message && !err.html) {
                err.html = err.message;
            }
            this.error = err;
        });
    }
    /**
     * todo: when the component is embeded in an iframe, will hit the same-origin policy problem:
     * the beginOAuth2 is called in iframe, it will write some info(stateId) to localStorage, but the completeOAuth2 will called in a stanalone page, it cann't read the stateId.
     * @returns
     */
    startLogin() {
        const portalRest = `${this.portalUrl}/sharing/rest`;
        const url = new URL(window.location.href);
        const redirect_url = `${url.origin}${url.pathname}?portalUrl=${this.portalUrl}&isOAuthCallback=true`;
        return ArcGISIdentityManager.beginOAuth2({ portal: portalRest, popup: true, clientId: this.clientId, redirectUri: redirect_url }).then((idm) => {
            this.token = idm.token;
            PropsService.setProps(this);
            this.switchState('generate-report');
            this.init();
            this._credentialGetted.emit(idm.toCredential());
            return true;
        });
    }
    isOAuthCallbackpage() {
        const url = new URL(window.location.href);
        return (url.search + '').includes("isOAuthCallback=true");
    }
    /**
     * locale change handler
     * @param newLocale
     * @returns
     */
    localeChangeHandler(newLocale) {
        PropsService.setProps({ locale: newLocale });
        return Promise.resolve(true)
            .then(() => {
            return TranslateService.getService().getTranslate();
        })
            .then((res) => {
            const langTasks = res.customPrint.recentTasks;
            this.langCustomPrint = res.customPrint;
            this.langTasks = langTasks;
            this.langCommon = res.common;
            this.stateService.notifyDataChanged('locale-data-changed', { value: res });
            this.i18nStringUpdated.emit({ locale: newLocale, i18n: this.langCommon });
            return true;
        });
    }
    /**
     * get visible elements
     * @returns
     */
    generateVisibleElems() {
        var _a, _b;
        const elems = ['inputFeatures', 'selectTemplate', 'fileOptions', 'reportName', 'saveToAGSAccount', 'outputFormat', 'showCredits', 'recentReports'];
        let result = [];
        if ((_a = this.show) === null || _a === void 0 ? void 0 : _a.length) {
            result = this.show.split(',');
        }
        else if ((_b = this.hide) === null || _b === void 0 ? void 0 : _b.length) {
            const hides = this.hide.split(',');
            result = elems.filter((ele) => {
                return hides.indexOf(ele) < 0;
            });
        }
        else {
            result = elems;
        }
        if (result.indexOf('fileOptions') < 0 && result.indexOf('reportName') < 0 && result.indexOf('saveToAGSAccount') < 0 && result.indexOf('outputFormat') < 0) {
            //
        }
        else {
            result.push('reportSetting');
        }
        return [].concat(result);
    }
    switchState(state) {
        this.state = state;
    }
    /**
     * update template list
     * @returns
     */
    updateTemplateList() {
        return Promise.resolve(true).then(() => {
            if (this.visibleConf.indexOf('selectTemplate') < 0) {
                const param = this.reportTemplateIds === undefined ? {} : { templateIds: this.reportTemplateIds };
                return this.reportService.getReportTemplates(this.surveyItemId, param);
            }
        })
            .then((templates) => {
            if (templates) {
                this.reportService.setHelperObj({
                    printTemplates: templates
                });
                this.stateService.notifyDataChanged('print-templates-updated', { value: templates });
                // set the first template as the default template if the templateItemId is not provided.
                const paramStore = this.reportService.getParamCache();
                const templateItemId = paramStore.templateItemId || PropsService.templateItemId;
                if (!templateItemId && templates.length) {
                    const selectedTemplateId = templates[0].id;
                    this.reportService.setParamCache({
                        templateItemId: selectedTemplateId
                    });
                    // this.selectedTemplateChange.emit(this.selectedTemplateId);
                }
            }
        });
    }
    generateReportHander(evt) {
        const detail = evt.detail;
        this.jobs = detail.jobs;
        // this.checkingList.push()
        this.checkingList = [...this.checkingList, evt.detail.jobId];
        // if (this.visibleConf.indexOf('recentReports') >= 0) {
        this.state = 'report-list';
        // }
        // this.checkingList = [].concat(detail.checkingList || []);
    }
    render() {
        var _a, _b, _c, _d, _e;
        return (h(Host, { key: '372606ed791cd7d1ef7fb882c716ca76840a45f2' }, h("calcite-panel", { key: 'a7346f03688cfdb7440bf8e40363176fa1c8515b' }, h("div", { key: '652e818cf3cf99a5df2a0a19e0c141c96acd080d', style: { display: (this.state === 'generate-report' && this.token) ? 'block' : 'none' } }, this.visibleConf.indexOf('inputFeatures') < 0 ? '' : h("features-preview", { queryParameters: this.queryParameters, inputFeatureTemplate: this.inputFeatureTemplate }), this.visibleConf.indexOf('selectTemplate') < 0 || !this.surveyItemInfo ? '' : h("template-chooser", { selectedTemplateId: this.templateItemId, templateIds: this.reportTemplateIds }), this.visibleConf.indexOf('reportSetting') < 0 ? '' : h("report-settings", { visibleElems: this.visibleConf, mergeFiles: this.mergeFiles, outputFormat: this.outputFormat, fileName: this.outputReportName }), h("report-generator", { key: 'c5d2c57bd3086446b9317ef344c5ae86a9f11420', visibleConf: this.visibleConf, templateItemId: this.templateItemId, onReportCreated: (evt) => { this.generateReportHander(evt); } }), this.visibleConf.indexOf('recentReports') < 0 ?
            null :
            h("div", { class: "banner" }, h("calcite-action", { onClick: () => this.switchState('report-list'), icon: "chevrons-right", "text-enabled": true }, h("span", null, (_a = this.langTasks) === null || _a === void 0 ? void 0 : _a.label), ((_b = this.checkingList) === null || _b === void 0 ? void 0 : _b.length) ?
                h(Fragment, null, h("div", { class: "task-num", id: 'task-num' }, h("span", null, `${this.checkingList.length || ''}`)), h("calcite-tooltip", { label: this.langTasks.panelNumberTip, "reference-element": "task-num" }, h("span", null, this.langTasks.panelNumberTip)))
                : null))), this.token ?
            h("task-list", { style: { display: (this.state === 'report-list') ? 'block' : 'none' }, jobs: this.jobs, onGoBackClicked: () => { this.state = 'generate-report'; } })
            : '', this.error ?
            h("calcite-alert", { slot: "alerts", open: true, onCalciteAlertClose: () => { this.error = null; }, label: this.error.html, icon: true, kind: this.error.alertType || 'danger', placement: "top", scale: "s" }, h("div", { class: "error-message", slot: "message" }, this.error.html, this.error.detail ?
                h("p", { innerHTML: this.error.detail })
                : null))
            : null, this.state === 'login' && !PropsService.token ?
            h("calcite-modal", { "aria-labelledby": "modal-title", id: "login-modal", "outside-close-disabled": "true", scale: "s", "width-scale": "s", "close-button-disabled": "true", open: "true" }, h("div", { slot: "header", id: "modal-title" }, (_c = this.langCommon) === null || _c === void 0 ? void 0 : _c.signIn), h("div", { slot: "content" }, h("calcite-label", { style: { height: '100px' } }, h("p", null, (_d = this.langCommon) === null || _d === void 0 ? void 0 : _d.signInMsg), h("calcite-button", { id: "reportLoginBtn", kind: "brand", onClick: () => this.startLogin() }, (_e = this.langCommon) === null || _e === void 0 ? void 0 : _e.signIn))))
            : ''), h("slot", { key: '22b3f6908b27655eabd64ab0e452f706d4528752' })));
    }
    static get is() { return "feature-report"; }
    static get encapsulation() { return "shadow"; }
    static get originalStyleUrls() {
        return {
            "$": ["feature-report.scss"]
        };
    }
    static get styleUrls() {
        return {
            "$": ["feature-report.css"]
        };
    }
    static get properties() {
        return {
            "token": {
                "type": "string",
                "mutable": false,
                "complexType": {
                    "original": "string",
                    "resolved": "string",
                    "references": {}
                },
                "required": true,
                "optional": false,
                "docs": {
                    "tags": [],
                    "text": ""
                },
                "attribute": "token",
                "reflect": false
            },
            "portalUrl": {
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
                "attribute": "portal-url",
                "reflect": false
            },
            "apiUrl": {
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
                "attribute": "api-url",
                "reflect": false
            },
            "featureLayerUrl": {
                "type": "string",
                "mutable": false,
                "complexType": {
                    "original": "string",
                    "resolved": "string",
                    "references": {}
                },
                "required": true,
                "optional": false,
                "docs": {
                    "tags": [],
                    "text": ""
                },
                "attribute": "feature-layer-url",
                "reflect": false
            },
            "surveyItemId": {
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
                "attribute": "survey-item-id",
                "reflect": false
            },
            "templateItemId": {
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
                "attribute": "template-item-id",
                "reflect": false
            },
            "queryParameters": {
                "type": "string",
                "mutable": false,
                "complexType": {
                    "original": "string",
                    "resolved": "string",
                    "references": {}
                },
                "required": true,
                "optional": false,
                "docs": {
                    "tags": [],
                    "text": ""
                },
                "attribute": "query-parameters",
                "reflect": false
            },
            "mergeFiles": {
                "type": "string",
                "mutable": false,
                "complexType": {
                    "original": "'none' | 'nextPage' | 'continuous'",
                    "resolved": "\"continuous\" | \"nextPage\" | \"none\"",
                    "references": {}
                },
                "required": false,
                "optional": false,
                "docs": {
                    "tags": [],
                    "text": ""
                },
                "attribute": "merge-files",
                "reflect": false
            },
            "outputFormat": {
                "type": "string",
                "mutable": false,
                "complexType": {
                    "original": "string",
                    "resolved": "string",
                    "references": {}
                },
                "required": false,
                "optional": false,
                "docs": {
                    "tags": [],
                    "text": ""
                },
                "attribute": "output-format",
                "reflect": false
            },
            "outputReportName": {
                "type": "string",
                "mutable": false,
                "complexType": {
                    "original": "string",
                    "resolved": "string",
                    "references": {}
                },
                "required": false,
                "optional": false,
                "docs": {
                    "tags": [],
                    "text": ""
                },
                "attribute": "output-report-name",
                "reflect": false
            },
            "outputPackageName": {
                "type": "string",
                "mutable": false,
                "complexType": {
                    "original": "string",
                    "resolved": "string",
                    "references": {}
                },
                "required": false,
                "optional": false,
                "docs": {
                    "tags": [],
                    "text": ""
                },
                "attribute": "output-package-name",
                "reflect": false
            },
            "packageFiles": {
                "type": "any",
                "mutable": false,
                "complexType": {
                    "original": "boolean | string",
                    "resolved": "boolean | string",
                    "references": {}
                },
                "required": false,
                "optional": false,
                "docs": {
                    "tags": [],
                    "text": ""
                },
                "attribute": "package-files",
                "reflect": false
            },
            "uploadInfo": {
                "type": "string",
                "mutable": false,
                "complexType": {
                    "original": "string",
                    "resolved": "string",
                    "references": {}
                },
                "required": false,
                "optional": false,
                "docs": {
                    "tags": [],
                    "text": ""
                },
                "attribute": "upload-info",
                "reflect": false
            },
            "webmapItemId": {
                "type": "string",
                "mutable": false,
                "complexType": {
                    "original": "string",
                    "resolved": "string",
                    "references": {}
                },
                "required": false,
                "optional": false,
                "docs": {
                    "tags": [],
                    "text": ""
                },
                "attribute": "webmap-item-id",
                "reflect": false
            },
            "mapScale": {
                "type": "string",
                "mutable": false,
                "complexType": {
                    "original": "string",
                    "resolved": "string",
                    "references": {}
                },
                "required": false,
                "optional": false,
                "docs": {
                    "tags": [],
                    "text": ""
                },
                "attribute": "map-scale",
                "reflect": false
            },
            "locale": {
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
                "attribute": "locale",
                "reflect": false
            },
            "utcOffset": {
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
                "attribute": "utc-offset",
                "reflect": false
            },
            "show": {
                "type": "string",
                "mutable": false,
                "complexType": {
                    "original": "string",
                    "resolved": "string",
                    "references": {}
                },
                "required": false,
                "optional": false,
                "docs": {
                    "tags": [],
                    "text": "ui parameters"
                },
                "attribute": "show",
                "reflect": false
            },
            "hide": {
                "type": "string",
                "mutable": false,
                "complexType": {
                    "original": "string",
                    "resolved": "string",
                    "references": {}
                },
                "required": false,
                "optional": false,
                "docs": {
                    "tags": [],
                    "text": ""
                },
                "attribute": "hide",
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
                "optional": false,
                "docs": {
                    "tags": [],
                    "text": ""
                },
                "attribute": "input-feature-template",
                "reflect": false
            },
            "label": {
                "type": "string",
                "mutable": false,
                "complexType": {
                    "original": "string",
                    "resolved": "string",
                    "references": {}
                },
                "required": false,
                "optional": false,
                "docs": {
                    "tags": [],
                    "text": ""
                },
                "attribute": "label",
                "reflect": false
            },
            "reportTemplateIds": {
                "type": "string",
                "mutable": false,
                "complexType": {
                    "original": "string",
                    "resolved": "string",
                    "references": {}
                },
                "required": false,
                "optional": false,
                "docs": {
                    "tags": [],
                    "text": ""
                },
                "attribute": "report-template-ids",
                "reflect": false
            },
            "clientId": {
                "type": "string",
                "mutable": false,
                "complexType": {
                    "original": "string",
                    "resolved": "string",
                    "references": {}
                },
                "required": false,
                "optional": false,
                "docs": {
                    "tags": [],
                    "text": ""
                },
                "attribute": "client-id",
                "reflect": false
            },
            "requestSource": {
                "type": "string",
                "mutable": false,
                "complexType": {
                    "original": "string",
                    "resolved": "string",
                    "references": {}
                },
                "required": false,
                "optional": false,
                "docs": {
                    "tags": [],
                    "text": ""
                },
                "attribute": "request-source",
                "reflect": false
            }
        };
    }
    static get states() {
        return {
            "where": {},
            "username": {},
            "state": {},
            "visibleConf": {},
            "checkingList": {},
            "jobs": {},
            "error": {},
            "langTasks": {},
            "langCommon": {},
            "langCustomPrint": {},
            "surveyItemInfo": {}
        };
    }
    static get events() {
        return [{
                "method": "userInfoGetted",
                "name": "userInfoGetted",
                "bubbles": true,
                "cancelable": true,
                "composed": true,
                "docs": {
                    "tags": [],
                    "text": ""
                },
                "complexType": {
                    "original": "any",
                    "resolved": "any",
                    "references": {}
                }
            }, {
                "method": "i18nStringUpdated",
                "name": "i18nStringUpdated",
                "bubbles": true,
                "cancelable": true,
                "composed": true,
                "docs": {
                    "tags": [],
                    "text": ""
                },
                "complexType": {
                    "original": "any",
                    "resolved": "any",
                    "references": {}
                }
            }, {
                "method": "_credentialGetted",
                "name": "_credentialGetted",
                "bubbles": true,
                "cancelable": true,
                "composed": true,
                "docs": {
                    "tags": [],
                    "text": ""
                },
                "complexType": {
                    "original": "any",
                    "resolved": "any",
                    "references": {}
                }
            }];
    }
    static get watchers() {
        return [{
                "propName": "templateItemId",
                "methodName": "templateItemIdChanged"
            }, {
                "propName": "queryParameters",
                "methodName": "queryParametersChanged"
            }, {
                "propName": "mergeFiles",
                "methodName": "mergeFilesChanged"
            }, {
                "propName": "outputFormat",
                "methodName": "outputFormatChanged"
            }, {
                "propName": "locale",
                "methodName": "localeChanged"
            }, {
                "propName": "show",
                "methodName": "showChanged"
            }, {
                "propName": "hide",
                "methodName": "hideChanged"
            }, {
                "propName": "inputFeatureTemplate",
                "methodName": "inputFeatureTemplateChanged"
            }, {
                "propName": "label",
                "methodName": "labelChanged"
            }, {
                "propName": "reportTemplateIds",
                "methodName": "reportTemplateIdsChanged"
            }, {
                "propName": "requestSource",
                "methodName": "requestSourceChanged"
            }];
    }
}
//# sourceMappingURL=feature-report.js.map
