'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

const index = require('./index-1f4276ed.js');
const translate_service = require('./translate.service-6de902ba.js');
const state_service = require('./state.service-2ec8cd7e.js');

const viewReportLinkCss = ":host{padding:0 0.75rem}:host div.banner{display:block;cursor:pointer;line-height:60px}:host .task-num{display:inline-block;height:16px;text-align:center;border-radius:16px;border-color:#31872E;background-color:#31872E;margin-left:4px;color:#ffffff;line-height:16px !important;transition:all 0.25s cubic-bezier(0.18, 0.89, 0.32, 1.28)}:host .task-num span{position:relative;line-height:1 !important;color:#ffffff;padding:1px 4px}:host .task-num.active{-webkit-transform:scale(1.2);transform:scale(1.2)}:host-context([dir=rtl]) .task-num{margin-left:unset !important;margin-right:4px}";
const ViewReportLinkStyle0 = viewReportLinkCss;

const ViewReportLink = class {
    constructor(hostRef) {
        index.registerInstance(this, hostRef);
        this.viewReportLinkClicked = index.createEvent(this, "viewReportLinkClicked", 7);
        this.stateService = state_service.StateService.getService();
        this.checkingList = undefined;
        this.langTasks = undefined;
    }
    componentWillLoad() {
        return Promise.resolve(true)
            // .then(() => {
            //   return TranslateService.getService().getTranslate();
            // })
            .then(() => {
            const res = translate_service.TranslateService.getService().getTranslateSync();
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
        return (index.h(index.Host, { key: '84acb167f634868a7dba80e66e62458151e4bdb6' }, index.h("div", { key: '566676ac9fd0ef7bfcf8bcf829bdd0916a306cc4', class: "banner" }, index.h("calcite-action", { key: 'baab894f7887474d9739291bc1a64212c18fa272', onClick: () => this.linkClicked(), icon: "chevrons-right", "text-enabled": true }, index.h("span", { key: 'fc3fedb377530bd8dd2b49d87d5b8aad84eb86c1' }, (_a = this.langTasks) === null || _a === void 0 ? void 0 : _a.label), ((_b = this.checkingList) === null || _b === void 0 ? void 0 : _b.length) ?
            index.h(index.Fragment, null, index.h("div", { class: "task-num", id: 'task-num' }, index.h("span", null, `${this.checkingList.length || ''}`)), index.h("calcite-tooltip", { label: this.langTasks.panelNumberTip, "reference-element": "task-num" }, index.h("span", null, this.langTasks.panelNumberTip)))
            : null)), index.h("slot", { key: 'dc2b8d91cf5e3eed7e7df4870ec604c5d0ebee6c' })));
    }
};
ViewReportLink.style = ViewReportLinkStyle0;

exports.view_report_link = ViewReportLink;

//# sourceMappingURL=view-report-link.cjs.entry.js.map