import { proxyCustomElement, HTMLElement, h, Host } from '@stencil/core/internal/client';
import { T as TranslateService } from './translate.service.js';

const successDetailModalCss = ":host{display:block}:host .error-table-outter{width:100%;overflow:auto}:host .table{width:100%;max-width:100%;margin-bottom:20px;border-spacing:0;border-collapse:collapse}:host .table>thead>tr>th,:host .table>tbody>tr>th,:host .table>tfoot>tr>th,:host .table>thead>tr>td,:host .table>tbody>tr>td,:host .table>tfoot>tr>td{padding:8px;line-height:1.42857143;vertical-align:top;border-top:1px solid #dddddd}:host .table-bordered>thead>tr>th,:host .table-bordered>tbody>tr>th,:host .table-bordered>tfoot>tr>th,:host .table-bordered>thead>tr>td,:host .table-bordered>tbody>tr>td,:host .table-bordered>tfoot>tr>td{border:1px solid #dddddd}:host .table>thead>tr>th{vertical-align:bottom;border-bottom:2px solid #dddddd}:host .table-bordered{border:1px solid #ddd}:host .error-table{margin-bottom:0;table-layout:fixed}:host .error-table .objectId-td{width:120px;max-width:254px;overflow:hidden;word-wrap:break-word}:host .error-table .message{max-width:560px;overflow:auto;word-wrap:break-word}";
const SuccessDetailModalStyle0 = successDetailModalCss;

const SuccessDetailModal = /*@__PURE__*/ proxyCustomElement(class SuccessDetailModal extends HTMLElement {
    constructor() {
        super();
        this.__registerHost();
        this.__attachShadow();
        this.job = undefined;
        this.open = undefined;
    }
    componentWillLoad() {
        return Promise.resolve(true)
            // .then(() => {
            //   return TranslateService.getService().getTranslate();
            // })
            .then(() => {
            const res = TranslateService.getService().getTranslateSync();
            const langTasks = res.customPrint.recentTasks;
            this.langTasks = langTasks;
            this.langCommon = res.common;
        });
    }
    render() {
        return (h(Host, { key: 'ae3fe28b2e65fa5c1cecb4c67012ae40461c54d6' }, h("calcite-modal", { key: '01ba839a077cd65e65bcb428b07f52ef0a5a9d19', open: this.open, onCalciteModalClose: () => { this.open = false; }, "aria-labelledby": "modal-title", id: "example-modal" }, h("div", { key: 'd4707e7fd8bcb766ecd11dbc528911be2b3efa2a', slot: "header", id: "modal-title" }, this.langTasks.detailSucceededOIDs, this.job.resultInfo && this.job.resultInfo.succeededObjectIds && this.job.resultInfo.succeededObjectIds.length ? ' (' + this.job.resultInfo.succeededObjectIds.length + ') ' : ''), h("div", { key: '15db7a7c34fec0cc4b6dd05348a8fa3227e23e18', slot: "content" }, h("div", { key: '473645a8391ac27ac19569361263c9dd98eeacd0', class: "error-table-outter", style: { maxHeight: `${this.errorModalMaxHeight}` } }, this.job && this.job.resultInfo && this.job.resultInfo.succeededObjectIds && this.job.resultInfo.succeededObjectIds.length ?
            h("table", { class: "table table-striped table-bordered error-table" }, h("tbody", null, h("tr", null, h("td", null, h("div", { class: "message", style: { maxWidth: '720px' } }, this.job.resultInfo.succeededObjectIds)))))
            : ''))), h("slot", { key: '4f706644c22334fb432ac77dc7944f8d9606f56b' })));
    }
    get modal() { return this; }
    static get style() { return SuccessDetailModalStyle0; }
}, [1, "success-detail-modal", {
        "job": [8],
        "open": [4]
    }]);
function defineCustomElement() {
    if (typeof customElements === "undefined") {
        return;
    }
    const components = ["success-detail-modal"];
    components.forEach(tagName => { switch (tagName) {
        case "success-detail-modal":
            if (!customElements.get(tagName)) {
                customElements.define(tagName, SuccessDetailModal);
            }
            break;
    } });
}

export { SuccessDetailModal as S, defineCustomElement as d };

//# sourceMappingURL=success-detail-modal2.js.map