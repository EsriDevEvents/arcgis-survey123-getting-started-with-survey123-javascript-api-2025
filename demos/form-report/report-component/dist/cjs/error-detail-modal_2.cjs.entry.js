'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

const index = require('./index-1f4276ed.js');
const translate_service = require('./translate.service-6de902ba.js');
const util_service = require('./util.service-a11f2d49.js');

const errorDetailModalCss = ":host{display:block}:host .helper{width:0;height:0;overflow:hidden;visibility:hidden}:host .helper div{width:9999px}:host .helper span{padding:8px}:host .error-table-outter{width:100%;overflow:auto}:host .table{width:100%;max-width:100%;margin-bottom:20px;border-spacing:0;border-collapse:collapse}:host .table>thead>tr>th,:host .table>tbody>tr>th,:host .table>tfoot>tr>th,:host .table>thead>tr>td,:host .table>tbody>tr>td,:host .table>tfoot>tr>td{padding:8px;line-height:1.42857143;vertical-align:top;border-top:1px solid #dddddd}:host .table-bordered>thead>tr>th,:host .table-bordered>tbody>tr>th,:host .table-bordered>tfoot>tr>th,:host .table-bordered>thead>tr>td,:host .table-bordered>tbody>tr>td,:host .table-bordered>tfoot>tr>td{border:1px solid #dddddd}:host .table>thead>tr>th{vertical-align:bottom;border-bottom:2px solid #dddddd}:host .table-bordered{border:1px solid #ddd}:host .error-table{margin-bottom:0;table-layout:fixed}:host .error-table .objectId-td{width:120px;max-width:254px;overflow:hidden;word-wrap:break-word}:host .error-table .message{max-width:560px;overflow:auto;word-wrap:break-word}";
const ErrorDetailModalStyle0 = errorDetailModalCss;

const ErrorDetailModal = class {
    constructor(hostRef) {
        index.registerInstance(this, hostRef);
        this.job = undefined;
        this.open = undefined;
        this.maxFailedOIDLength = undefined;
    }
    componentWillLoad() {
        this.utilService = util_service.UtilService.getService();
        return Promise.resolve(true)
            .then(() => {
            return translate_service.TranslateService.getService().getTranslate();
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
        return (index.h(index.Host, { key: '81b21c37ba79081bd7ea428728ba5282a28370d1' }, index.h("div", { key: '7466c40d62a608ab8b78f41fb2aa47c766c8be55', class: "helper" }, index.h("div", { key: 'e603e24f3ab2b099cf05221868c29bd4ad55edd6' }, index.h("span", { key: '1538f25833d40d862430b0067a877c6856f1ec4d', class: "helperSpan" }))), index.h("calcite-modal", { key: '4f9f0e140f7f2aa8987dc2597148d8285f85baad', open: this.open, "aria-labelledby": "modal-title", onCalciteModalClose: () => { this.open = false; }, id: "example-modal" }, index.h("div", { key: 'de54acb19422540bda3d1ac22765d9844afea002', slot: "header", id: "modal-title" }, this.langTasks.detailFailedOIDs, this.job.resultInfo && this.job.resultInfo.failedObjectIds && this.job.resultInfo.failedObjectIds.length ? ' (' + this.job.resultInfo.failedObjectIds.length + ') ' : ''), index.h("div", { key: '9469ea945350c608d1dbea86b82fa3afe26ddac7', slot: "content" }, index.h("div", { key: '2f739d25309cc144f1a85c2031fd6facd50485b3', class: "error-table-outter", style: { maxHeight: `${this.errorModalMaxHeight}`, overflow: 'auto' } }, this.job && this.job.failedInfo && this.job.failedInfo.length ?
            index.h("table", { class: "table table-striped table-bordered error-table" }, index.h("thead", null, index.h("tr", null, index.h("th", { class: "objectId-td", style: { width: `${this.maxFailedOIDLength + 16}px` } }, this.langTasks.detailFailedOIDs), index.h("th", null, this.langTasks.detailStatusMsg))), index.h("tbody", null, this.job.failedInfo.map((detail) => {
                return index.h("tr", null, index.h("td", null, index.h("div", { class: "objectId-td", style: { width: `${this.maxFailedOIDLength}px` } }, detail.objectIds)), index.h("td", null, index.h("div", { class: "message", innerHTML: this.utilService.parseMarkdown(detail.messages) })));
            })))
            : ''))), index.h("slot", { key: '67699058b0493e01f0d020a75264ace240666df8' })));
    }
    get modal() { return index.getElement(this); }
};
ErrorDetailModal.style = ErrorDetailModalStyle0;

const successDetailModalCss = ":host{display:block}:host .error-table-outter{width:100%;overflow:auto}:host .table{width:100%;max-width:100%;margin-bottom:20px;border-spacing:0;border-collapse:collapse}:host .table>thead>tr>th,:host .table>tbody>tr>th,:host .table>tfoot>tr>th,:host .table>thead>tr>td,:host .table>tbody>tr>td,:host .table>tfoot>tr>td{padding:8px;line-height:1.42857143;vertical-align:top;border-top:1px solid #dddddd}:host .table-bordered>thead>tr>th,:host .table-bordered>tbody>tr>th,:host .table-bordered>tfoot>tr>th,:host .table-bordered>thead>tr>td,:host .table-bordered>tbody>tr>td,:host .table-bordered>tfoot>tr>td{border:1px solid #dddddd}:host .table>thead>tr>th{vertical-align:bottom;border-bottom:2px solid #dddddd}:host .table-bordered{border:1px solid #ddd}:host .error-table{margin-bottom:0;table-layout:fixed}:host .error-table .objectId-td{width:120px;max-width:254px;overflow:hidden;word-wrap:break-word}:host .error-table .message{max-width:560px;overflow:auto;word-wrap:break-word}";
const SuccessDetailModalStyle0 = successDetailModalCss;

const SuccessDetailModal = class {
    constructor(hostRef) {
        index.registerInstance(this, hostRef);
        this.job = undefined;
        this.open = undefined;
    }
    componentWillLoad() {
        return Promise.resolve(true)
            // .then(() => {
            //   return TranslateService.getService().getTranslate();
            // })
            .then(() => {
            const res = translate_service.TranslateService.getService().getTranslateSync();
            const langTasks = res.customPrint.recentTasks;
            this.langTasks = langTasks;
            this.langCommon = res.common;
        });
    }
    render() {
        return (index.h(index.Host, { key: 'ae3fe28b2e65fa5c1cecb4c67012ae40461c54d6' }, index.h("calcite-modal", { key: '01ba839a077cd65e65bcb428b07f52ef0a5a9d19', open: this.open, onCalciteModalClose: () => { this.open = false; }, "aria-labelledby": "modal-title", id: "example-modal" }, index.h("div", { key: 'd4707e7fd8bcb766ecd11dbc528911be2b3efa2a', slot: "header", id: "modal-title" }, this.langTasks.detailSucceededOIDs, this.job.resultInfo && this.job.resultInfo.succeededObjectIds && this.job.resultInfo.succeededObjectIds.length ? ' (' + this.job.resultInfo.succeededObjectIds.length + ') ' : ''), index.h("div", { key: '15db7a7c34fec0cc4b6dd05348a8fa3227e23e18', slot: "content" }, index.h("div", { key: '473645a8391ac27ac19569361263c9dd98eeacd0', class: "error-table-outter", style: { maxHeight: `${this.errorModalMaxHeight}` } }, this.job && this.job.resultInfo && this.job.resultInfo.succeededObjectIds && this.job.resultInfo.succeededObjectIds.length ?
            index.h("table", { class: "table table-striped table-bordered error-table" }, index.h("tbody", null, index.h("tr", null, index.h("td", null, index.h("div", { class: "message", style: { maxWidth: '720px' } }, this.job.resultInfo.succeededObjectIds)))))
            : ''))), index.h("slot", { key: '4f706644c22334fb432ac77dc7944f8d9606f56b' })));
    }
    get modal() { return index.getElement(this); }
};
SuccessDetailModal.style = SuccessDetailModalStyle0;

exports.error_detail_modal = ErrorDetailModal;
exports.success_detail_modal = SuccessDetailModal;

//# sourceMappingURL=error-detail-modal_2.cjs.entry.js.map