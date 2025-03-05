import { Host, h } from "@stencil/core";
import { TranslateService } from "../../../services/translate.service";
import { UtilService } from "../../../services/util.service";
export class ReportDetailTable {
    constructor() {
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
    static get is() { return "detail-table"; }
    static get encapsulation() { return "shadow"; }
    static get originalStyleUrls() {
        return {
            "$": ["detail-table.scss"]
        };
    }
    static get styleUrls() {
        return {
            "$": ["detail-table.css"]
        };
    }
    static get properties() {
        return {
            "job": {
                "type": "any",
                "mutable": false,
                "complexType": {
                    "original": "any",
                    "resolved": "any",
                    "references": {}
                },
                "required": false,
                "optional": false,
                "docs": {
                    "tags": [],
                    "text": ""
                },
                "attribute": "job",
                "reflect": false
            }
        };
    }
    static get states() {
        return {
            "errorMsg": {}
        };
    }
    static get elementRef() { return "host"; }
}
//# sourceMappingURL=detail-table.js.map
