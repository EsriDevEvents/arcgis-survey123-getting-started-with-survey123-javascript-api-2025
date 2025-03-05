import { proxyCustomElement, HTMLElement, createEvent, h, Host, Fragment } from '@stencil/core/internal/client';
import { R as ReportService } from './report.service.js';
import { T as TranslateService } from './translate.service.js';
import { S as StateService } from './state.service.js';
import { U as UtilService } from './util.service.js';
import { d as defineCustomElement$5 } from './detail-table2.js';
import { d as defineCustomElement$4 } from './error-detail-modal2.js';
import { d as defineCustomElement$3 } from './report-icon2.js';
import { d as defineCustomElement$2 } from './success-detail-modal2.js';
import { d as defineCustomElement$1 } from './task-info2.js';

const taskListCss = ":host{display:block}:host *{-webkit-box-sizing:border-box;-moz-box-sizing:border-box;box-sizing:border-box}:host *{font-size:14px}:host .banner{cursor:pointer;font-weight:700;line-height:60px}:host .banner a{cursor:pointer;float:inline-start;transform:rotateZ(180deg);top:16px}:host .banner span{float:inline-start;padding-left:10px}:host .no-tasks{margin-bottom:20px}:host .list{height:calc(100% - 60px);padding:0 0.75rem;overflow:auto;width:100%}:host .list ul{padding-left:0}:host .list ul li{list-style:none;margin-bottom:15px;border-radius:2px}:host .list p.job-date{color:#979797;line-height:40px;margin-bottom:0}:host-context([dir=rtl]) .banner a{transform:none !important}:host-context([dir=rtl]) .banner span{padding-right:10px;padding-left:unset !important}:host-context([dir=rtl]) list ul{padding-right:0;padding-left:unset !important}";
const TaskListStyle0 = taskListCss;

const ReportTaskList = /*@__PURE__*/ proxyCustomElement(class ReportTaskList extends HTMLElement {
    constructor() {
        super();
        this.__registerHost();
        this.__attachShadow();
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
    static get style() { return TaskListStyle0; }
}, [1, "task-list", {
        "jobs": [16],
        "langReport": [32],
        "langCommon": [32],
        "langTasks": [32],
        "state": [32]
    }]);
function defineCustomElement() {
    if (typeof customElements === "undefined") {
        return;
    }
    const components = ["task-list", "detail-table", "error-detail-modal", "report-icon", "success-detail-modal", "task-info"];
    components.forEach(tagName => { switch (tagName) {
        case "task-list":
            if (!customElements.get(tagName)) {
                customElements.define(tagName, ReportTaskList);
            }
            break;
        case "detail-table":
            if (!customElements.get(tagName)) {
                defineCustomElement$5();
            }
            break;
        case "error-detail-modal":
            if (!customElements.get(tagName)) {
                defineCustomElement$4();
            }
            break;
        case "report-icon":
            if (!customElements.get(tagName)) {
                defineCustomElement$3();
            }
            break;
        case "success-detail-modal":
            if (!customElements.get(tagName)) {
                defineCustomElement$2();
            }
            break;
        case "task-info":
            if (!customElements.get(tagName)) {
                defineCustomElement$1();
            }
            break;
    } });
}

export { ReportTaskList as R, defineCustomElement as d };

//# sourceMappingURL=task-list2.js.map