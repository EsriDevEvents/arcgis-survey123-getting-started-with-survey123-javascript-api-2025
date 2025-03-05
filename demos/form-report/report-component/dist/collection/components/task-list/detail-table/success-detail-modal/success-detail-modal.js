import { Host, h } from "@stencil/core";
import { TranslateService } from "../../../../services/translate.service";
export class SuccessDetailModal {
    constructor() {
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
    static get is() { return "success-detail-modal"; }
    static get encapsulation() { return "shadow"; }
    static get originalStyleUrls() {
        return {
            "$": ["success-detail-modal.scss"]
        };
    }
    static get styleUrls() {
        return {
            "$": ["success-detail-modal.css"]
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
    static get elementRef() { return "modal"; }
}
//# sourceMappingURL=success-detail-modal.js.map
