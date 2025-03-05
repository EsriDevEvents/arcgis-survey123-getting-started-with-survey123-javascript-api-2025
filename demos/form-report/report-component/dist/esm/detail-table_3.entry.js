import { r as registerInstance, h, H as Host, a as getElement, g as getAssetPath, c as createEvent, F as Fragment } from './index-15add20a.js';
import { T as TranslateService } from './translate.service-72bb6f5d.js';
import { U as UtilService } from './util.service-95ba91e5.js';
import { R as ReportService } from './report.service-c3cee168.js';
import { S as StateService } from './state.service-a118a4aa.js';

const detailTableCss = ":host{display:block}:host calcite-table{width:100%}:host calcite-table-cell .max-tow-lines{word-wrap:break-word;overflow:hidden;text-overflow:ellipsis;display:-webkit-box;-webkit-box-orient:vertical;-webkit-line-clamp:2;max-height:40px;margin-bottom:5px}:host calcite-table-cell .more-details{margin-bottom:0px;text-decoration:underline;cursor:pointer}:host table{width:100%;margin-bottom:0px}:host table tr{border-top:1px solid #EFF0F5}:host table tr:nth-child(2n+1){background-color:#F9FBFE}:host table tr td{border:none;padding:6px 5px}:host table tr td>div{word-wrap:break-word}:host table tr td .max-tow-lines{word-wrap:break-word;overflow:hidden;text-overflow:ellipsis;display:-webkit-box;-webkit-box-orient:vertical;-webkit-line-clamp:2;max-height:40px;margin-bottom:5px}:host table tr td .more-details{margin-bottom:0px;cursor:pointer}:host table tr td:first-child{padding-left:30px;max-width:120px;vertical-align:top}:host table tr td a{cursor:pointer;text-decoration:underline}:host-context([dir=rtl]) table tr td:first-child{padding-right:30px;padding-left:unset !important}";
const DetailTableStyle0 = detailTableCss;

const ReportDetailTable = class {
    constructor(hostRef) {
        registerInstance(this, hostRef);
        this.job = undefined;
        this.errorMsg = undefined;
    }
    componentWillLoad() {
        const utilService = UtilService.getService();
        this.errorMsg = utilService.parseMarkdown(this.job.messages && this.job.messages.length ? this.job.messages.join('<br>') : '');
        return Promise.resolve(true)
            // .then(() => {
            //   return TranslateService.getService().getTranslate();
            // })
            .then(() => {
            var _a;
            const res = TranslateService.getService().getTranslateSync();
            const langTasks = (_a = res === null || res === void 0 ? void 0 : res.customPrint) === null || _a === void 0 ? void 0 : _a.recentTasks;
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
        });
    }
    getPercentage(p) {
        const utilService = UtilService.getService();
        return utilService.getPercentage(this.job, p);
    }
    /**
     * open the error detailed modal
     */
    errorDetailModalOpen() {
        var _a;
        const modal = (_a = this.host.shadowRoot) === null || _a === void 0 ? void 0 : _a.querySelector('.error-modal');
        modal.open = true;
    }
    /**
     * open the success detailed modal
     */
    succeedDetailModalOpen() {
        var _a;
        const modal = (_a = this.host.shadowRoot) === null || _a === void 0 ? void 0 : _a.querySelector('.success-modal');
        modal.open = true;
    }
    render() {
        return (h(Host, { key: '793814a918a803c0d38341450e369dce9ab63dee' }, h("calcite-table", { key: '079fab8aa1e4ae3f8fabc86cac081f0ea3b5d063', caption: "job details", striped: true }, h("calcite-table-row", { key: 'dc681f041274bc9d806885c95cbb5515c5214520' }, h("calcite-table-cell", { key: '27d51f0392542859dd1a3bb9087a1cb9602ecb5b' }, this.langTasks.detailJobID), h("calcite-table-cell", { key: 'ea8c844cefe02794f98d59ce306309bfcb09af97' }, this.job.jobId)), h("calcite-table-row", { key: '624de8596c065cee660065e81ac394190ed1c3af' }, h("calcite-table-cell", { key: '03abeea4269ef764429126abc72ada966409dc84' }, this.langTasks.detailStatus), h("calcite-table-cell", { key: '2e09e7f696a9b06a6c0b129e23c972ca165d5efb' }, h("div", { key: '3eb12fa114170e551bbb34cd3173a2dfe70ae89b' }, h("span", { key: '6519b2c268c6711d808580ff28a754f8324f491a' }, this.statusI18nConfig[this.job.jobStatus]), this.job.jobStatus == 'esriJobPartialSucceeded' && this.job.resultInfo.totalCount ?
            h("span", null, this.langTasks.jobStatusPartialSucceeded.replace('${$completedPercent}', `${this.getPercentage(1 - this.job.resultInfo.failedObjectIds.length / this.job.resultInfo.totalCount)}`)) : ''))), h("calcite-table-row", { key: 'b88ad596a3faa322e199a06ba5c81d392a68cb26' }, h("calcite-table-cell", { key: 'cff3c12af400d0d56b97eee26ae6c62ba4297c97' }, this.langTasks.detailStatusMsg), h("calcite-table-cell", { key: '7aa53b2f8950c58e8e7ea437ce19306f4e5efe6f' }, h("div", { key: 'a40d72ca0c00b7069e9f257c08ca1c6b33fc97fd', innerHTML: this.errorMsg, title: this.errorMsg }))), h("calcite-table-row", { key: 'f0128bf112b9583606b6c7e37077372e14a7504e' }, h("calcite-table-cell", { key: '60c32b9a1b5c8afe9b545f504d2435276a652479' }, this.langTasks.detailFailedOIDs, " ", (this.job.resultInfo && this.job.resultInfo.failedObjectIds && this.job.resultInfo.failedObjectIds.length ? ' (' + this.job.resultInfo.failedObjectIds.length + ') ' : '')), h("calcite-table-cell", { key: '3b9641affd8a60f44e626fd269eb59be43b8d5dd' }, this.job.resultInfo && this.job.resultInfo.failedObjectIds && this.job.resultInfo.failedObjectIds.length ?
            h("div", null, h("p", { class: "max-tow-lines", title: this.job.resultInfo.failedObjectIds.join(',') }, this.job.resultInfo.failedObjectIds.join(',')), this.job.resultInfo.details && this.job.resultInfo.details.length ?
                h("p", { class: "more-details" }, h("a", { onClick: () => this.errorDetailModalOpen() }, this.langTasks.detailMoreDetails)) : '')
            : '')), h("calcite-table-row", { key: '1541ad8f6290adea97b5725eb7e5e6a260ca1867' }, h("calcite-table-cell", { key: 'a8e403c7030e9320372336ff99cc1ab5ac86d1d5' }, this.langTasks.detailSucceededOIDs, " ", this.job.resultInfo && this.job.resultInfo.succeededObjectIds && this.job.resultInfo.succeededObjectIds.length ? this.job.resultInfo.succeededObjectIds.length : ''), h("calcite-table-cell", { key: '5aabd258902f4b6a6f0ca7e5d8c25b67c2a81049' }, this.job.resultInfo && this.job.resultInfo.succeededObjectIds && this.job.resultInfo.succeededObjectIds.length ?
            h("div", null, h("p", { class: "max-tow-lines", title: this.job.resultInfo.succeededObjectIds.join(',') }, this.job.resultInfo.succeededObjectIds.join(',')), h("p", { class: "more-details" }, h("a", { onClick: () => this.succeedDetailModalOpen() }, this.langTasks.detailMoreDetails))) : ''))), h("error-detail-modal", { key: 'e206fadb79ea76932da05b48b4910c759465626e', class: "error-modal", job: this.job }), h("success-detail-modal", { key: '2d40fe7cda776b6a5ff63148a55a7c1b6feeb4e2', class: "success-modal", job: this.job }), h("slot", { key: '7a4282727b8de61474110961712ba1a22cb4caff' })));
    }
    get host() { return getElement(this); }
};
ReportDetailTable.style = DetailTableStyle0;

const reportIconCss = ":host{display:block}";
const ReportIconStyle0 = reportIconCss;

const ReportIcon = class {
    constructor(hostRef) {
        registerInstance(this, hostRef);
        this.icon = undefined;
        this.size = undefined;
        this.pathData = undefined;
    }
    componentWillLoad() {
        this.fetchIcon().then((res) => {
            this.pathData = res;
        });
    }
    fetchIcon() {
        const utils = UtilService.getService();
        return Promise.resolve(true)
            .then(() => {
            if (utils.getSvgCache(this.icon)) {
                return utils.getSvgCache(this.icon);
            }
            return fetch(getAssetPath(`./assets/icons/${this.icon}.svg`))
                .then((resp) => {
                if (!resp.ok) {
                    throw new Error("could not get the icon file:");
                }
                return resp.text();
            });
        }).then((str) => {
            utils.setSvgCache(this.icon, str);
            const div = document.createElement('div');
            div.innerHTML = str;
            if (this.size) {
                div.querySelector('svg').setAttribute('width', this.size);
                div.querySelector('svg').setAttribute('height', this.size);
            }
            return div.innerHTML;
        });
    }
    render() {
        return (h(Host, { key: 'bfda6b93ffc35d676f665226e95b4cb92dc45089' }, h("i", { key: '3f0f5a2e470f746a6af14fac54108c4366f33cc5', innerHTML: this.pathData }), h("slot", { key: '8c22b8b576cdc451d11cd323fef745bdc7757ce8' })));
    }
};
ReportIcon.style = ReportIconStyle0;

const taskInfoCss = ":host{--calcite-dropdown-width:260px;display:block}:host *{-webkit-box-sizing:border-box;-moz-box-sizing:border-box;box-sizing:border-box}:host p{padding-top:0;margin:0 0 10px}:host .root{border-radius:2px}:host .root .header{font-weight:600;display:flex;align-items:center}:host .root .header p{word-break:break-word}:host .root .header calcite-icon{margin:0 4px;top:4px;position:relative}:host .root .job-info{position:relative;padding:10px;border-radius:2px}:host .root .job-info.hasDetail{border-bottom-left-radius:0;border-bottom-right-radius:0}:host .root .job-info .status-icon{position:absolute;top:14px;left:10px}:host .root .job-info .detail{width:100%;padding-left:24px}:host .root .job-info .detail .header{padding-right:40px;display:block;word-break:break-word}:host .root .job-info .detail .header ::ng-deep i{display:inline;position:relative;top:3px}:host .root .job-info .detail .icon-area{position:absolute;top:10px;right:10px}:host .root .job-info .detail .icon-area a{width:16px;text-align:center;display:inline-block;margin:0 5px;color:var(--calcite-color-text-2)}:host .root .job-info .detail .icon-area a:last-child{margin-right:0}:host .root .job-info .detail .icon-area a.isloading{cursor:default}:host .root .job-info .detail .icon-area a.isloading i{cursor:default}:host .root .job-info .detail .icon-area a.disabled{cursor:not-allowed}:host .root .job-info .detail .icon-area a.disabled i{cursor:not-allowed}:host .root .job-info .detail .icon-area a.disabled i ::ng-deep svg path{fill-opacity:0.6}:host .root .job-info .detail .icon-area i{cursor:pointer}:host .root .job-info .detail .icon-area i.download-icon::ng-deep .spinner .icon-spin{margin-left:0;margin-right:0}:host .root .job-info .detail .icon-area i.download-icon.spinner{position:relative;top:-2px}:host .root .job-info .detail .icon-area i ::ng-deep i{line-height:0}:host .root .job-info .detail .icon-area .menu-item{display:flex;justify-content:space-between;align-items:center;width:224px;margin-left:-12px}:host .root .job-info .detail .icon-area .menu-item>a{width:calc(100% - 60px);text-align:left;display:inline-block;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}:host .root .job-info .detail .icon-area .menu-item>span{right:10px}:host .root .job-info .detail .middle-line{overflow:hidden}:host .root .job-info .detail .middle-line .records{width:42%;float:inline-start}:host .root .job-info .detail .middle-line .startTime{width:55%;float:inline-end;text-align:right}:host .root .job-info .detail .status{display:flex;justify-content:space-between;margin-bottom:0px}:host .root .job-info .detail .status>span{width:58%;display:inline-block}:host .root .job-info .detail .status a.job-detail-link{width:35%;margin-left:5%;cursor:pointer;text-decoration:underline;text-align:right;display:inline-flex;justify-content:flex-end;align-items:center}:host .root .job-info .detail .status a.job-detail-link.job-detail-pending{cursor:default;text-decoration:none}:host .root .job-info .detail .status a.job-detail-link.job-detail-pending i.icon-spin{margin-left:2px}:host .root .job-info .detail .status a.job-detail-link.job-detail-pending i.icon-spin .spinner{position:relative;top:-7px}:host .root .job-info .detail .confirm-delete-anchor,:host .root .job-info .detail .cancel-delete-anchor{cursor:pointer;text-decoration:underline}:host .root .job-info .detail .cancel-delete-anchor{margin-left:20px}:host .root .job-detail{border-top:none;border-top-left-radius:0;border-top-right-radius:0;position:relative;border-radius:2px}:host .root:hover .job-info .detail .icon-area{display:block}:host .root ::ng-deep .modal-body{padding:0}:host-context([dir=rtl]) .job-info .status-icon{left:unset !important;right:10px}:host-context([dir=rtl]) .detail{padding-right:24px;padding-left:unset !important}:host-context([dir=rtl]) .detail .header{padding-right:unset !important;padding-left:40px}:host-context([dir=rtl]) .detail .icon-area{left:10px;right:auto !important}:host-context([dir=rtl]) .detail .icon-area a:last-child{margin-left:0;margin-right:5px}:host-context([dir=rtl]) .detail .middle-line .startTime{text-align:left}:host-context([dir=rtl]) .detail .status a.job-detail-link{margin-right:5%;margin-left:unset !important}:host-context([dir=rtl]) .detail .status a.job-detail-link.job-detail-pending i.icon-spin{margin-left:unset !important;margin-right:2px}:host-context([dir=rtl]) .detail .cancel-delete-anchor{margin-left:auto !important;margin-right:20px}";
const TaskInfoStyle0 = taskInfoCss;

const ReportTaskInfo = class {
    constructor(hostRef) {
        registerInstance(this, hostRef);
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
    get host() { return getElement(this); }
};
ReportTaskInfo.style = TaskInfoStyle0;

export { ReportDetailTable as detail_table, ReportIcon as report_icon, ReportTaskInfo as task_info };

//# sourceMappingURL=detail-table_3.entry.js.map