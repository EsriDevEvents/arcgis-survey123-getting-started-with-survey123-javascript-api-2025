import { proxyCustomElement, HTMLElement, createEvent, h, Host, Fragment } from '@stencil/core/internal/client';
import { T as TranslateService } from './translate.service.js';
import { S as StateService } from './state.service.js';

const viewReportLinkCss = ":host{padding:0 0.75rem}:host div.banner{display:block;cursor:pointer;line-height:60px}:host .task-num{display:inline-block;height:16px;text-align:center;border-radius:16px;border-color:#31872E;background-color:#31872E;margin-left:4px;color:#ffffff;line-height:16px !important;transition:all 0.25s cubic-bezier(0.18, 0.89, 0.32, 1.28)}:host .task-num span{position:relative;line-height:1 !important;color:#ffffff;padding:1px 4px}:host .task-num.active{-webkit-transform:scale(1.2);transform:scale(1.2)}:host-context([dir=rtl]) .task-num{margin-left:unset !important;margin-right:4px}";
const ViewReportLinkStyle0 = viewReportLinkCss;

const ViewReportLink$1 = /*@__PURE__*/ proxyCustomElement(class ViewReportLink extends HTMLElement {
    constructor() {
        super();
        this.__registerHost();
        this.__attachShadow();
        this.viewReportLinkClicked = createEvent(this, "viewReportLinkClicked", 7);
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
    static get style() { return ViewReportLinkStyle0; }
}, [1, "view-report-link", {
        "checkingList": [16],
        "langTasks": [32]
    }]);
function defineCustomElement$1() {
    if (typeof customElements === "undefined") {
        return;
    }
    const components = ["view-report-link"];
    components.forEach(tagName => { switch (tagName) {
        case "view-report-link":
            if (!customElements.get(tagName)) {
                customElements.define(tagName, ViewReportLink$1);
            }
            break;
    } });
}

const ViewReportLink = ViewReportLink$1;
const defineCustomElement = defineCustomElement$1;

export { ViewReportLink, defineCustomElement };

//# sourceMappingURL=view-report-link.js.map