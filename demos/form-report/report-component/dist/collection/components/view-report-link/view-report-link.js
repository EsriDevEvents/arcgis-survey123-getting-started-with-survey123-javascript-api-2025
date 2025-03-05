/**
 * Deprecated!
 */
import { Host, h, Fragment } from "@stencil/core";
import { TranslateService } from "../../services/translate.service";
import { StateService } from "../../services/state.service";
export class ViewReportLink {
    constructor() {
        this.stateService = StateService.getService();
        this.checkingList = undefined;
        this.langTasks = undefined;
    }
    componentWillLoad() {
        return Promise.resolve(true)
            // .then(() => {
            //   return TranslateService.getService().getTranslate();
            // })
            .then(() => {
            const res = TranslateService.getService().getTranslateSync();
            const langTasks = res === null || res === void 0 ? void 0 : res.customPrint.recentTasks;
            this.stateService.subscribe('locale-data-changed', (data) => {
                this.langTasks = data === null || data === void 0 ? void 0 : data.customPrint.recentTasks;
                ;
            });
            this.langTasks = langTasks;
        });
    }
    linkClicked() {
        this.viewReportLinkClicked.emit();
    }
    render() {
        var _a, _b;
        return (h(Host, { key: '84acb167f634868a7dba80e66e62458151e4bdb6' }, h("div", { key: '566676ac9fd0ef7bfcf8bcf829bdd0916a306cc4', class: "banner" }, h("calcite-action", { key: 'baab894f7887474d9739291bc1a64212c18fa272', onClick: () => this.linkClicked(), icon: "chevrons-right", "text-enabled": true }, h("span", { key: 'fc3fedb377530bd8dd2b49d87d5b8aad84eb86c1' }, (_a = this.langTasks) === null || _a === void 0 ? void 0 : _a.label), ((_b = this.checkingList) === null || _b === void 0 ? void 0 : _b.length) ?
            h(Fragment, null, h("div", { class: "task-num", id: 'task-num' }, h("span", null, `${this.checkingList.length || ''}`)), h("calcite-tooltip", { label: this.langTasks.panelNumberTip, "reference-element": "task-num" }, h("span", null, this.langTasks.panelNumberTip)))
            : null)), h("slot", { key: 'dc2b8d91cf5e3eed7e7df4870ec604c5d0ebee6c' })));
    }
    static get is() { return "view-report-link"; }
    static get encapsulation() { return "shadow"; }
    static get originalStyleUrls() {
        return {
            "$": ["view-report-link.scss"]
        };
    }
    static get styleUrls() {
        return {
            "$": ["view-report-link.css"]
        };
    }
    static get properties() {
        return {
            "checkingList": {
                "type": "unknown",
                "mutable": false,
                "complexType": {
                    "original": "string[]",
                    "resolved": "string[]",
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
            "langTasks": {}
        };
    }
    static get events() {
        return [{
                "method": "viewReportLinkClicked",
                "name": "viewReportLinkClicked",
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
//# sourceMappingURL=view-report-link.js.map
