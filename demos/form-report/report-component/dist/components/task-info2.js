import { proxyCustomElement, HTMLElement, createEvent, h, Host, Fragment } from '@stencil/core/internal/client';
import { T as TranslateService } from './translate.service.js';
import { U as UtilService } from './util.service.js';
import { R as ReportService } from './report.service.js';
import { S as StateService } from './state.service.js';
import { d as defineCustomElement$4 } from './detail-table2.js';
import { d as defineCustomElement$3 } from './error-detail-modal2.js';
import { d as defineCustomElement$2 } from './report-icon2.js';
import { d as defineCustomElement$1 } from './success-detail-modal2.js';

const taskInfoCss = ":host{--calcite-dropdown-width:260px;display:block}:host *{-webkit-box-sizing:border-box;-moz-box-sizing:border-box;box-sizing:border-box}:host p{padding-top:0;margin:0 0 10px}:host .root{border-radius:2px}:host .root .header{font-weight:600;display:flex;align-items:center}:host .root .header p{word-break:break-word}:host .root .header calcite-icon{margin:0 4px;top:4px;position:relative}:host .root .job-info{position:relative;padding:10px;border-radius:2px}:host .root .job-info.hasDetail{border-bottom-left-radius:0;border-bottom-right-radius:0}:host .root .job-info .status-icon{position:absolute;top:14px;left:10px}:host .root .job-info .detail{width:100%;padding-left:24px}:host .root .job-info .detail .header{padding-right:40px;display:block;word-break:break-word}:host .root .job-info .detail .header ::ng-deep i{display:inline;position:relative;top:3px}:host .root .job-info .detail .icon-area{position:absolute;top:10px;right:10px}:host .root .job-info .detail .icon-area a{width:16px;text-align:center;display:inline-block;margin:0 5px;color:var(--calcite-color-text-2)}:host .root .job-info .detail .icon-area a:last-child{margin-right:0}:host .root .job-info .detail .icon-area a.isloading{cursor:default}:host .root .job-info .detail .icon-area a.isloading i{cursor:default}:host .root .job-info .detail .icon-area a.disabled{cursor:not-allowed}:host .root .job-info .detail .icon-area a.disabled i{cursor:not-allowed}:host .root .job-info .detail .icon-area a.disabled i ::ng-deep svg path{fill-opacity:0.6}:host .root .job-info .detail .icon-area i{cursor:pointer}:host .root .job-info .detail .icon-area i.download-icon::ng-deep .spinner .icon-spin{margin-left:0;margin-right:0}:host .root .job-info .detail .icon-area i.download-icon.spinner{position:relative;top:-2px}:host .root .job-info .detail .icon-area i ::ng-deep i{line-height:0}:host .root .job-info .detail .icon-area .menu-item{display:flex;justify-content:space-between;align-items:center;width:224px;margin-left:-12px}:host .root .job-info .detail .icon-area .menu-item>a{width:calc(100% - 60px);text-align:left;display:inline-block;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}:host .root .job-info .detail .icon-area .menu-item>span{right:10px}:host .root .job-info .detail .middle-line{overflow:hidden}:host .root .job-info .detail .middle-line .records{width:42%;float:inline-start}:host .root .job-info .detail .middle-line .startTime{width:55%;float:inline-end;text-align:right}:host .root .job-info .detail .status{display:flex;justify-content:space-between;margin-bottom:0px}:host .root .job-info .detail .status>span{width:58%;display:inline-block}:host .root .job-info .detail .status a.job-detail-link{width:35%;margin-left:5%;cursor:pointer;text-decoration:underline;text-align:right;display:inline-flex;justify-content:flex-end;align-items:center}:host .root .job-info .detail .status a.job-detail-link.job-detail-pending{cursor:default;text-decoration:none}:host .root .job-info .detail .status a.job-detail-link.job-detail-pending i.icon-spin{margin-left:2px}:host .root .job-info .detail .status a.job-detail-link.job-detail-pending i.icon-spin .spinner{position:relative;top:-7px}:host .root .job-info .detail .confirm-delete-anchor,:host .root .job-info .detail .cancel-delete-anchor{cursor:pointer;text-decoration:underline}:host .root .job-info .detail .cancel-delete-anchor{margin-left:20px}:host .root .job-detail{border-top:none;border-top-left-radius:0;border-top-right-radius:0;position:relative;border-radius:2px}:host .root:hover .job-info .detail .icon-area{display:block}:host .root ::ng-deep .modal-body{padding:0}:host-context([dir=rtl]) .job-info .status-icon{left:unset !important;right:10px}:host-context([dir=rtl]) .detail{padding-right:24px;padding-left:unset !important}:host-context([dir=rtl]) .detail .header{padding-right:unset !important;padding-left:40px}:host-context([dir=rtl]) .detail .icon-area{left:10px;right:auto !important}:host-context([dir=rtl]) .detail .icon-area a:last-child{margin-left:0;margin-right:5px}:host-context([dir=rtl]) .detail .middle-line .startTime{text-align:left}:host-context([dir=rtl]) .detail .status a.job-detail-link{margin-right:5%;margin-left:unset !important}:host-context([dir=rtl]) .detail .status a.job-detail-link.job-detail-pending i.icon-spin{margin-left:unset !important;margin-right:2px}:host-context([dir=rtl]) .detail .cancel-delete-anchor{margin-left:auto !important;margin-right:20px}";
const TaskInfoStyle0 = taskInfoCss;

const ReportTaskInfo = /*@__PURE__*/ proxyCustomElement(class ReportTaskInfo extends HTMLElement {
    constructor() {
        super();
        this.__registerHost();
        this.__attachShadow();
        this.jobRemoved = createEvent(this, "jobRemoved", 7);
        this.isRTL = false;
        this.maxFailedOIDLength = 120;
        this.utils = UtilService.getService();
        this.reportService = ReportService.getService();
        this.stateService = StateService.getService();
        this.job = undefined;
        this.showDetail = undefined;
        this.detailedStatus = undefined;
        this.detailedStatusEle = undefined;
        this.isWaitingToConfirmRemove = undefined;
        this.isRemoving = undefined;
        this.isCanceling = undefined;
    }
    // todo: should show basic info first, then get the detail
    componentWillLoad() {
        var _a;
        this.jobId = (_a = this.job) === null || _a === void 0 ? void 0 : _a.jobId;
        return Promise.resolve(true)
            // .then(() => {
            //   return TranslateService.getService().getTranslate();
            // })
            .then(() => {
            const res = TranslateService.getService().getTranslateSync();
            const langTasks = res === null || res === void 0 ? void 0 : res.customPrint.recentTasks;
            this.langCommon = res === null || res === void 0 ? void 0 : res.common;
            this.langTasks = langTasks;
            this.statusI18nConfig = {
                esriJobWaiting: langTasks.jobStatusWaiting,
                esriJobSubmitted: langTasks.jobStatusSubmitted,
                esriJobExecuting: langTasks.jobStatusExecuting,
                esriJobSucceeded: langTasks.jobStatusSucceeded,
                esriJobFailed: langTasks.jobStatusFailed,
                pdfConverting: langTasks.pdfConverting,
                pdfConverted: langTasks.pdfConverted,
                dfConvertFailed: langTasks.dfConvertFailed
            };
            this.stateService.subscribe('job-updated', (data) => {
                var _a, _b;
                if ((data === null || data === void 0 ? void 0 : data.jobId) === ((_a = this.job) === null || _a === void 0 ? void 0 : _a.jobId)) {
                    this.job = Object.assign({}, data);
                    this.jobId = (_b = this.job) === null || _b === void 0 ? void 0 : _b.jobId;
                    this.updateJobStatusString();
                }
            });
            return true;
        }).then(() => {
            // do not add "return" here, otherwise the component will not render until status request finished.
            this.reportService.checkJobDetails(this.job).then(() => {
                var _a, _b;
                this.jobId = (_a = this.job) === null || _a === void 0 ? void 0 : _a.jobId;
                this.detailedStatus = (_b = this.job.jobStatusInfo) === null || _b === void 0 ? void 0 : _b.detailedStatus;
                this.updateJobStatusString();
                return this.job;
            });
        });
    }
    getPercentage(p) {
        const utilService = UtilService.getService();
        return utilService.getPercentage(this.job, p);
    }
    updateJobStatusString() {
        var _a;
        this.detailedStatus = (_a = this.job.jobStatusInfo) === null || _a === void 0 ? void 0 : _a.detailedStatus;
        const i18nMapping = {
            preparing: 'jobStatusPrinting',
            'printing,printed,printFailed': 'jobStatusPrinting',
            'pdfConverting,pdfConverted,pdfConvertFailed': 'jobStatusConverting',
            'merging': 'jobStatusMerging',
            'packaging,packaged,packageFailed': 'jobStatusPackaging',
            'uploading,uploadFailed': 'jobStatusUploading'
        };
        const matchedKey = Object.keys(i18nMapping).find((key) => {
            return key.split(',').indexOf(this.detailedStatus) >= 0;
        });
        const i18nStr = this.langTasks[i18nMapping[matchedKey]] || '';
        if (!this.job.jobStatus) {
            this.detailedStatusEle = '';
        }
        if (['esriJobWaiting', 'esriJobSubmitted', 'esriJobExecuting'].indexOf(this.job.jobStatus) > -1) {
            if (this.job.jobStatus == 'esriJobExecuting' && this.job.jobStatusInfo && this.detailedStatus) {
                const progress = this.detailedStatus === 'preparing' ? 0 : null;
                const progressPercent = this.getPercentage(progress);
                this.detailedStatusEle = h("span", null, i18nStr.replace('${$completedPercent}', `${progressPercent}`));
            }
        }
        else {
            if (this.job.jobStatus == 'esriJobExecuting' && (!this.job.jobStatusInfo || !this.detailedStatus)) {
                this.detailedStatusEle = h("span", null, this.langTasks.jobStatusPrinting);
            }
            else {
                this.detailedStatusEle = h("span", null, this.statusI18nConfig[this.job.jobStatus]);
            }
        }
    }
    getDuration(start, end, cancelled) {
        const hourUnit = this.langCommon.timeUnitHour;
        const miniUnit = this.langCommon.timeUnitMinute;
        const secUnit = this.langCommon.timeUnitSecond;
        let duration = '';
        if (!end && cancelled) {
            end = cancelled;
        }
        const miliSecond = end - start;
        if (miliSecond > 0) {
            const seconds = Math.round(miliSecond / 1000);
            const hours = Math.floor(seconds / 3600);
            const minus = Math.floor((seconds % 3600) / 60);
            const sec = seconds % 60;
            if (hours > 0) {
                duration += hours + hourUnit + ' ';
            }
            if (minus > 0 || hours > 0) {
                duration += minus + miniUnit + ' ';
            }
            duration += sec + secUnit;
        }
        return duration;
    }
    showDetailHandler() {
        var _a, _b;
        if (!((_a = this.job.resultInfo) === null || _a === void 0 ? void 0 : _a.resultFiles) && !((_b = this.job.resultInfo) === null || _b === void 0 ? void 0 : _b.details)) {
            this.showDetail = 'pending';
            this.reportService.checkJobStatus(this.job.jobId).then((statusObj) => {
                // this.state.trigger('report-updateJobDetail', statusObj);
                // this.updateFailedOIDlength(statusObj);
                this.job = statusObj;
                this.jobId = this.job.jobId;
                this.showDetail = 'done';
                // this.showDetail();
            });
        }
        else {
            // this.updateFailedOIDlength(this.job);
            this.showDetail = 'done';
            // this.showDetail();
        }
    }
    hideDetail() {
        this.showDetail = '';
    }
    /**
     * execute removing job
     * @param job
     */
    executeRemoveJob(job) {
        // if (job._tempRuntime) {
        //   delete this.isWaitingToConfirmRemove;
        // }
        // job._tempRuntime = job._tempRuntime || {};
        this.isWaitingToConfirmRemove = false;
        this.isRemoving = true;
        // https://devtopia.esri.com/Beijing-R-D-Center/feature-report/issues/239#issuecomment-3550777
        this.reportService.removeJob(job.jobId).then((res) => {
            var _a, _b, _c;
            if (!res || !res.success) {
                console.log('Remove job failed', (res.error && res.error.details && res.error.details.length) ? res.error.details.join('.') : '');
                this.reportService.showError({}, { errorStr: (_a = res.error) === null || _a === void 0 ? void 0 : _a.message, detail: (_b = res.error) === null || _b === void 0 ? void 0 : _b.detail, showDetails: !!((_c = res.error) === null || _c === void 0 ? void 0 : _c.detail) });
                // this.alertService.setOption({
                //   alertType: 'danger',
                //   html: (res.error && res.error.message) ? res.error.message : 'Failed to remove the task.',
                //   detail: (res.error && res.error.details && res.error.details.length) ? res.error.details.join('<br>') : ''
                // }).show();
            }
            else {
                // this.state.trigger('report-remove-job', job);
                // todo: tell the parent component to remove this job
                // this.reportService.removeJobFromList(job);
                this.jobRemoved.emit(job);
                this.isWaitingToConfirmRemove = false;
            }
            this.isRemoving = false;
        }).catch(() => {
            // toto: use string to replace the hard coded 'Failed to remove the task.' in 3.16
            // this.customReportService.showError(res, {errorStr: 'Failed to remove the task.', showDetails: true});
            // this.alertService.setOption({
            //   alertType: 'danger',
            //   html: 'Failed to remove the task.',
            //   detail: (res && res.error && res.error.message) ? res.error.message : ''
            // }).show();      
            this.isRemoving = false;
        });
    }
    /**
     * cancel removing job
     * @param job
     */
    cancelRemoveJob() {
        this.isWaitingToConfirmRemove = false;
    }
    /**
     * remove job
     * @param job
     */
    startRemoveJob() {
        this.isWaitingToConfirmRemove = true;
    }
    startCancelJob(job) {
        this.isCanceling = true;
        // https://devtopia.esri.com/Beijing-R-D-Center/feature-report/issues/239#issuecomment-3550777
        this.reportService.cancelJob(job.jobId).then((res) => {
            var _a, _b, _c;
            if (!res || !res.success) {
                console.log('Cancel job failed');
                this.reportService.showError({}, { errorStr: (_a = res.error) === null || _a === void 0 ? void 0 : _a.message, detail: (_b = res.error) === null || _b === void 0 ? void 0 : _b.detail, showDetails: !!((_c = res.error) === null || _c === void 0 ? void 0 : _c.detail) });
                // this.customReportService.showError(res, {errorStr: this.recentTasksString.cancelJobFailMsg, detail: ((res.error && res.error.details && res.error.details.length) ? res.error.details.join('<br>') : '')});
            }
            else {
                // success to cancel job
                // this.state.trigger('report-cancel-job', job);
                job.jobStatus = 'esriJobStatusCancelled';
                job = Object.assign({}, job);
            }
            delete job._tempRuntime.isCanceling;
        }).catch(() => {
            // this.customReportService.showError(res, {errorStr: this.recentTasksString.cancelJobFailMsg, showDetails: true});
            // this.alertService.setOption({
            //   alertType: 'danger',
            //   html: 'Failed to cancel the task.',
            //   detail: (res && res.error && res.error.message) ? res.error.message : ''
            // }).show();
            this.isCanceling = false;
        });
    }
    render() {
        return (h(Host, { key: 'b081ef135cdbec5d1c194b69887337fc9c5ea959' }, h("calcite-card", { key: '707b5cc07e84a124276c2ba29abb70f9a0106962', class: `root ${!this.job ? 'hidden' : ''} ` }, this.job ?
            h("div", { class: `job-info ${this.showDetail ? 'hasDetail' : ''}` }, h("i", { class: "status-icon" }, ['esriJobWaiting', 'esriJobSubmitted', 'esriJobExecuting'].indexOf(this.job.jobStatus) >= 0 ? h("calcite-icon", { scale: "s", icon: "hourglass-active", "text-label": this.statusI18nConfig[this.job.jobStatus] }) : '', this.job.jobStatus == 'esriJobSucceeded' ? h("report-icon", { icon: "success" }) : '', this.job.jobStatus == 'esriJobPartialSucceeded' ? h("report-icon", { icon: "success-caveat" }) : '', this.job.jobStatus == 'esriJobStatusCancelled' ? h("calcite-icon", { scale: "s", icon: "circle-disallowed", "text-label": this.langTasks.jobStatusCanceled }) : '', this.job.jobStatus == 'esriJobFailed' ? h("calcite-icon", { scale: "s", icon: "x-circle", "text-label": this.langTasks.jobStatusFailed }) : ''), h("div", { class: "detail" }, h("p", { class: "header" }, this.job.resultInfo ? this.job.resultInfo.title : '', this.job.inputInfo && this.job.inputInfo.parameters && this.job.inputInfo.parameters.outputFormat == 'pdf' ?
                h("calcite-icon", { scale: "s", icon: this.isRTL ? '' : 'file-pdf', "text-label": "" })
                : h("calcite-icon", { scale: "s", icon: this.isRTL ? '' : 'file-word', "text-label": "" })), !(this.isWaitingToConfirmRemove) ?
                h("p", { class: "middle-line" }, h("span", { class: "records" }, this.langTasks.records, this.job.resultInfo && this.job.resultInfo.totalCount ? this.job.resultInfo.totalCount : ''), h("span", { class: "startTime", title: this.utils.formatDateTime(this.job.submitted, 'datetime') }, this.langTasks.started, this.utils.formatDateTime(this.job.submitted, 'time'))) : '', !(this.isWaitingToConfirmRemove) ?
                h("p", { class: "status" }, ['esriJobWaiting', 'esriJobSubmitted', 'esriJobExecuting'].indexOf(this.job.jobStatus) > -1 ?
                    h("span", null, this.langTasks.status, " ", this.detailedStatusEle, " ")
                    :
                        h(Fragment, null, ['esriJobWaiting', 'esriJobSubmitted', 'esriJobExecuting'].indexOf(this.job.jobStatus) == -1 ?
                            h("span", null, this.langTasks.duration, " ", this.getDuration(this.job.submitted, this.job.completed, this.job.cancelled)) : ''), this.job.jobStatus == 'esriJobPartialSucceeded' || this.job.jobStatus == 'esriJobFailed' ?
                    h(Fragment, null, !this.showDetail ?
                        h("a", { class: "job-detail-link", onClick: () => this.showDetailHandler() }, this.langCommon.showDetails)
                        : '', this.showDetail == 'pending' ?
                        h("a", { class: "job-detail-link job-detail-pending" }, this.langCommon.loading, h("i", { class: "icon icon-spin disabled" }, h("calcite-loader", { label: "", inline: "true" }))) : '', this.showDetail == 'done' ?
                        h("a", { class: "job-detail-link", onClick: () => this.hideDetail() }, this.langCommon.hideDetails)
                        : '')
                    : '') :
                h(Fragment, null, this.isWaitingToConfirmRemove ?
                    h(Fragment, null, h("p", null, this.langTasks.removeJobConfirm), h("p", null, h("a", { class: "confirm-delete-anchor", onClick: () => this.executeRemoveJob(this.job) }, this.langCommon.yes), h("a", { class: "cancel-delete-anchor", onClick: () => this.cancelRemoveJob() }, this.langCommon.no))) : ''), !this.isWaitingToConfirmRemove ?
                h("div", { class: "icon-area dropdown" }, this.job.jobStatus == 'esriJobSucceeded' && this.job.urlExpired ?
                    h("a", null, h("calcite-icon", { scale: "s", icon: "download", "text-label": "", disabled: true, id: this.jobId + '-disabled-btn' }), h("calcite-tooltip", { label: this.langTasks.downloadDisabledTip, "reference-element": this.jobId + '-disabled-btn' }, h("span", null, this.langTasks.downloadDisabledTip))) : '', (this.job.jobStatus == 'esriJobSucceeded' || this.job.jobStatus == 'esriJobPartialSucceeded') && this.job.url && !this.job.urlExpired && !this.job.multipleFiles ?
                    h("a", { href: this.job.url, title: this.langCommon.download, download: true, target: this.job.inputInfo && this.job.inputInfo.parameters && this.job.inputInfo.parameters.outputFormat == 'pdf' ? '_blank' : '' }, h("i", { class: "download-icon" }, h("calcite-icon", { scale: "s", icon: "download", "text-label": "" })))
                    : '', (this.job.jobStatus == 'esriJobSucceeded' || this.job.jobStatus == 'esriJobPartialSucceeded') && this.job.multipleFiles && !this.job.urlExpired ?
                    h("a", { class: "dropdown-toggle" }, h("calcite-dropdown", { width: "m", placement: "bottom-end", type: "click" }, h("i", { slot: "trigger", class: "download-icon", "data-toggle": "dropdown", role: "button", "aria-haspopup": "true", "aria-expanded": "false" }, h("calcite-icon", { scale: "s", icon: "download", "text-label": "" })), this.job.resultInfo.resultFiles.map((file) => {
                        return h("calcite-dropdown-item", null, h("div", { class: "menu-item" }, h("a", { href: file.url, title: file.name }, h("span", { class: "left-text" }, file.name || '')), h("span", { class: "right-text" }, file.size || '')));
                    }))) : '', ['esriJobSubmitted', 'esriJobExecuting', 'esriJobWaiting'].indexOf(this.job.jobStatus) >= 0 && !(this.job.jobStatus == 'esriJobExecuting' && this.job.jobStatusInfo && this.detailedStatus && ['uploading', 'uploadFailed', 'uploadSucceeded', 'usageSent', 'usageSentFailed', 'skipCharging'].indexOf(this.detailedStatus) >= 0) ?
                    h("a", { class: this.isCanceling ? 'isloading' : '', title: (this.isCanceling) ? '' : `${this.langTasks.cancelJobTip}` }, !(this.isCanceling) ?
                        h("i", { class: "download-icon", onClick: () => this.startCancelJob(this.job) }, h("calcite-icon", { scale: "s", icon: "circle-stop", "text-label": "" }))
                        :
                            h("i", { class: "download-icon spinner" }, h("calcite-loader", { label: this.langTasks.jobStatusCanceled, inline: "true" })))
                    : '', ['esriJobSucceeded', 'esriJobPartialSucceeded', 'esriJobFailed', 'esriJobStatusCancelled'].indexOf(this.job.jobStatus) >= 0 ?
                    h("a", { class: this.isRemoving ? 'isloading' : '', title: (this.isRemoving) ? '' : `${this.langTasks.removeJobTip}` }, this.isRemoving, !this.isRemoving ?
                        h("i", { class: "download-icon", onClick: () => this.startRemoveJob() }, h("calcite-icon", { scale: "s", icon: "trash" }))
                        :
                            h("i", { class: "download-icon spinner" }, h("calcite-loader", { label: "", inline: "true" })))
                    : null) : '')) : '', this.job && this.showDetail == 'done' ?
            h("div", { class: "job-detail" }, h("detail-table", { job: this.job }))
            : ''), h("slot", { key: 'ed47d7ca4adb26331501bab1de55a56623d490f5' })));
    }
    get host() { return this; }
    static get style() { return TaskInfoStyle0; }
}, [1, "task-info", {
        "job": [8],
        "showDetail": [1, "show-detail"],
        "detailedStatus": [1, "detailed-status"],
        "detailedStatusEle": [1, "detailed-status-ele"],
        "isWaitingToConfirmRemove": [32],
        "isRemoving": [32],
        "isCanceling": [32]
    }]);
function defineCustomElement() {
    if (typeof customElements === "undefined") {
        return;
    }
    const components = ["task-info", "detail-table", "error-detail-modal", "report-icon", "success-detail-modal"];
    components.forEach(tagName => { switch (tagName) {
        case "task-info":
            if (!customElements.get(tagName)) {
                customElements.define(tagName, ReportTaskInfo);
            }
            break;
        case "detail-table":
            if (!customElements.get(tagName)) {
                defineCustomElement$4();
            }
            break;
        case "error-detail-modal":
            if (!customElements.get(tagName)) {
                defineCustomElement$3();
            }
            break;
        case "report-icon":
            if (!customElements.get(tagName)) {
                defineCustomElement$2();
            }
            break;
        case "success-detail-modal":
            if (!customElements.get(tagName)) {
                defineCustomElement$1();
            }
            break;
    } });
}

export { ReportTaskInfo as R, defineCustomElement as d };

//# sourceMappingURL=task-info2.js.map