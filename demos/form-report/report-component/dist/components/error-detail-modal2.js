import { proxyCustomElement, HTMLElement, h, Host } from '@stencil/core/internal/client';
import { T as TranslateService } from './translate.service.js';
import { U as UtilService } from './util.service.js';

const errorDetailModalCss = ":host{display:block}:host .helper{width:0;height:0;overflow:hidden;visibility:hidden}:host .helper div{width:9999px}:host .helper span{padding:8px}:host .error-table-outter{width:100%;overflow:auto}:host .table{width:100%;max-width:100%;margin-bottom:20px;border-spacing:0;border-collapse:collapse}:host .table>thead>tr>th,:host .table>tbody>tr>th,:host .table>tfoot>tr>th,:host .table>thead>tr>td,:host .table>tbody>tr>td,:host .table>tfoot>tr>td{padding:8px;line-height:1.42857143;vertical-align:top;border-top:1px solid #dddddd}:host .table-bordered>thead>tr>th,:host .table-bordered>tbody>tr>th,:host .table-bordered>tfoot>tr>th,:host .table-bordered>thead>tr>td,:host .table-bordered>tbody>tr>td,:host .table-bordered>tfoot>tr>td{border:1px solid #dddddd}:host .table>thead>tr>th{vertical-align:bottom;border-bottom:2px solid #dddddd}:host .table-bordered{border:1px solid #ddd}:host .error-table{margin-bottom:0;table-layout:fixed}:host .error-table .objectId-td{width:120px;max-width:254px;overflow:hidden;word-wrap:break-word}:host .error-table .message{max-width:560px;overflow:auto;word-wrap:break-word}";
const ErrorDetailModalStyle0 = errorDetailModalCss;

const ErrorDetailModal = /*@__PURE__*/ proxyCustomElement(class ErrorDetailModal extends HTMLElement {
    constructor() {
        super();
        this.__registerHost();
        this.__attachShadow();
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
    get modal() { return this; }
    static get style() { return ErrorDetailModalStyle0; }
}, [1, "error-detail-modal", {
        "job": [8],
        "open": [4],
        "maxFailedOIDLength": [32]
    }]);
function defineCustomElement() {
    if (typeof customElements === "undefined") {
        return;
    }
    const components = ["error-detail-modal"];
    components.forEach(tagName => { switch (tagName) {
        case "error-detail-modal":
            if (!customElements.get(tagName)) {
                customElements.define(tagName, ErrorDetailModal);
            }
            break;
    } });
}

export { ErrorDetailModal as E, defineCustomElement as d };

//# sourceMappingURL=error-detail-modal2.js.map