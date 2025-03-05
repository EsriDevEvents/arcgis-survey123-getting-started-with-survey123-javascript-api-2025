import { Host, h } from "@stencil/core";
import { TranslateService } from "../../../../services/translate.service";
import { UtilService } from "../../../../services/util.service";
export class ErrorDetailModal {
    constructor() {
        this.job = undefined;
        this.open = undefined;
        this.maxFailedOIDLength = undefined;
    }
    componentWillLoad() {
        this.utilService = UtilService.getService();
        return Promise.resolve(true)
            .then(() => {
            return TranslateService.getService().getTranslate();
        })
            .then((res) => {
            const langTasks = res.customPrint.recentTasks;
            this.langTasks = langTasks;
            this.langCommon = res.common;
            // this.updateFailedOIDlength(this.job);
        });
    }
    componentDidRender() {
        this.updateFailedOIDlength(this.job);
    }
    updateFailedOIDlength(job) {
        if (this.maxFailedOIDLength > 0) {
            return;
        }
        let len = 120;
        const helperDiv = this.modal.shadowRoot.querySelector('.helperSpan');
        if (job.failedInfo && job.failedInfo.length && helperDiv) {
            job.failedInfo.forEach((info) => {
                helperDiv.innerHTML = info.objectIds;
                if (helperDiv.offsetWidth > len) {
                    len = helperDiv.offsetWidth;
                }
            });
        }
        this.maxFailedOIDLength = len;
        return len;
    }
    render() {
        return (h(Host, { key: '81b21c37ba79081bd7ea428728ba5282a28370d1' }, h("div", { key: '7466c40d62a608ab8b78f41fb2aa47c766c8be55', class: "helper" }, h("div", { key: 'e603e24f3ab2b099cf05221868c29bd4ad55edd6' }, h("span", { key: '1538f25833d40d862430b0067a877c6856f1ec4d', class: "helperSpan" }))), h("calcite-modal", { key: '4f9f0e140f7f2aa8987dc2597148d8285f85baad', open: this.open, "aria-labelledby": "modal-title", onCalciteModalClose: () => { this.open = false; }, id: "example-modal" }, h("div", { key: 'de54acb19422540bda3d1ac22765d9844afea002', slot: "header", id: "modal-title" }, this.langTasks.detailFailedOIDs, this.job.resultInfo && this.job.resultInfo.failedObjectIds && this.job.resultInfo.failedObjectIds.length ? ' (' + this.job.resultInfo.failedObjectIds.length + ') ' : ''), h("div", { key: '9469ea945350c608d1dbea86b82fa3afe26ddac7', slot: "content" }, h("div", { key: '2f739d25309cc144f1a85c2031fd6facd50485b3', class: "error-table-outter", style: { maxHeight: `${this.errorModalMaxHeight}`, overflow: 'auto' } }, this.job && this.job.failedInfo && this.job.failedInfo.length ?
            h("table", { class: "table table-striped table-bordered error-table" }, h("thead", null, h("tr", null, h("th", { class: "objectId-td", style: { width: `${this.maxFailedOIDLength + 16}px` } }, this.langTasks.detailFailedOIDs), h("th", null, this.langTasks.detailStatusMsg))), h("tbody", null, this.job.failedInfo.map((detail) => {
                return h("tr", null, h("td", null, h("div", { class: "objectId-td", style: { width: `${this.maxFailedOIDLength}px` } }, detail.objectIds)), h("td", null, h("div", { class: "message", innerHTML: this.utilService.parseMarkdown(detail.messages) })));
            })))
            : ''))), h("slot", { key: '67699058b0493e01f0d020a75264ace240666df8' })));
    }
    static get is() { return "error-detail-modal"; }
    static get encapsulation() { return "shadow"; }
    static get originalStyleUrls() {
        return {
            "$": ["error-detail-modal.scss"]
        };
    }
    static get styleUrls() {
        return {
            "$": ["error-detail-modal.css"]
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
            },
            "open": {
                "type": "boolean",
                "mutable": false,
                "complexType": {
                    "original": "boolean",
                    "resolved": "boolean",
                    "references": {}
                },
                "required": false,
                "optional": false,
                "docs": {
                    "tags": [],
                    "text": ""
                },
                "attribute": "open",
                "reflect": false
            }
        };
    }
    static get states() {
        return {
            "maxFailedOIDLength": {}
        };
    }
    static get elementRef() { return "modal"; }
}
//# sourceMappingURL=error-detail-modal.js.map
