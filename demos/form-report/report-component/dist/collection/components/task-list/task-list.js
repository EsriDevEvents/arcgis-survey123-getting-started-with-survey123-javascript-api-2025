import { Host, h, Fragment } from "@stencil/core";
import { ReportService } from "../../services/report.service";
import { TranslateService } from "../../services/translate.service";
import { StateService } from "../../services/state.service";
import { UtilService } from "../../services/util.service";
export class ReportTaskList {
    constructor() {
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
    static get is() { return "task-list"; }
    static get encapsulation() { return "shadow"; }
    static get originalStyleUrls() {
        return {
            "$": ["task-list.scss"]
        };
    }
    static get styleUrls() {
        return {
            "$": ["task-list.css"]
        };
    }
    static get properties() {
        return {
            "jobs": {
                "type": "unknown",
                "mutable": false,
                "complexType": {
                    "original": "any[]",
                    "resolved": "any[]",
                    "references": {}
                },
                "required": false,
                "optional": false,
                "docs": {
                    "tags": [],
                    "text": ""
                }
            }
        };
    }
    static get states() {
        return {
            "langReport": {},
            "langCommon": {},
            "langTasks": {},
            "state": {}
        };
    }
    static get events() {
        return [{
                "method": "goBackClicked",
                "name": "goBackClicked",
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
}
//# sourceMappingURL=task-list.js.map
