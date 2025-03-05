import { proxyCustomElement, HTMLElement, createEvent, h, Host } from '@stencil/core/internal/client';
import { P as PropsService } from './props.service.js';
import { R as ReportService } from './report.service.js';
import { S as StateService } from './state.service.js';
import { T as TranslateService } from './translate.service.js';

const templateChooserCss = ":host{display:block;padding:0 0.75rem}:host calcite-notice{margin-top:6px}:host .heading{margin-inline:0px;margin-block:1.25rem 1rem;font-size:var(--calcite-font-size-0);line-height:1.25rem;font-weight:var(--calcite-font-weight-medium)}";
const TemplateChooserStyle0 = templateChooserCss;

const TemplateChooser = /*@__PURE__*/ proxyCustomElement(class TemplateChooser extends HTMLElement {
    constructor() {
        super();
        this.__registerHost();
        this.__attachShadow();
        this.selectedTemplateChange = createEvent(this, "selectedTemplateChange", 7);
        this.reportService = ReportService.getService();
        this.stateService = StateService.getService();
        this.langObj = undefined;
        this.selectedTemplateId = undefined;
        this.templateIds = undefined;
        this.templates = [];
        this.translator = undefined;
    }
    selectedTemplateIdChanged() {
        this.reportService.setParamCache({
            templateItemId: this.selectedTemplateId
        });
    }
    templateIdsChanged() {
        this.init();
    }
    componentWillLoad() {
        this.reportService.setParamCache({
            templateItemId: this.selectedTemplateId
        });
        return Promise.resolve(true)
            // .then(() => {
            //   return TranslateService.getService().getTranslate();
            // })
            .then(() => {
            const res = TranslateService.getService().getTranslateSync();
            this.translator = res;
            this.stateService.subscribe('locale-data-changed', (data) => {
                this.translator = data;
            });
            return this.init();
        });
    }
    init() {
        const globalProps = PropsService;
        const reportService = ReportService.getService();
        return Promise.resolve(true).then(() => {
            if (this.templateIds === undefined) {
                return reportService.getReportTemplates(globalProps.surveyItemId);
            }
            else {
                return reportService.getReportTemplates(globalProps.surveyItemId, { templateIds: this.templateIds });
            }
        })
            .then((templates) => {
            this.templates = templates;
            this.stateService.notifyDataChanged('print-templates-updated', { value: templates });
            this.reportService.setHelperObj({
                printTemplates: templates
            });
            // use the first one as default, if the selected template id is not provided
            if (!this.selectedTemplateId && templates.length) {
                this.selectedTemplateId = templates[0].id;
                this.reportService.setParamCache({
                    templateItemId: this.selectedTemplateId
                });
                this.selectedTemplateChange.emit(this.selectedTemplateId);
            }
            return true;
        }).catch((err) => {
            this.reportService.showError(err);
        });
    }
    /**
     *
     * @param evt
     */
    selectedTemplateChangeHandler(evt) {
        this.reportService.setParamCache({
            templateItemId: evt.target.value
        });
        this.selectedTemplateChange.emit(evt.target.value);
    }
    render() {
        var _a, _b, _c;
        return (h(Host, { key: '7f3ef2c784e04f8a1a0d1861200d4c794ed50fb7' }, h("div", { key: '5e54734af22f84f41e1f5a6c87773e6c0a302869', class: "heading" }, (_a = this.translator) === null || _a === void 0 ? void 0 : _a.customPrint.chooseTemplateLabel1), h("calcite-combobox", { key: '7eb5e61f8d97e61b6421ac73a6a814842e5e11a0', placeholder: (_b = this.translator) === null || _b === void 0 ? void 0 : _b.customPrint.chooseTemplateLabel1, "selection-mode": "single-persist", clearDisabled: "true", value: this.selectedTemplateId, onCalciteComboboxChange: (evt) => { this.selectedTemplateChangeHandler(evt); } }, (this.templates || []).map((template) => {
            return h("calcite-combobox-item", { value: template.id, "text-label": template.title, selected: template.id === this.selectedTemplateId });
        })), (this.templates || []).length > 0 ?
            null :
            h("calcite-notice", { open: true, kind: "danger", scale: "s", width: "auto" }, h("div", { slot: "message" }, (_c = this.translator) === null || _c === void 0 ? void 0 : _c.customPrint.chooseTemplateNoOneYet1)), h("slot", { key: '2cea7b7e4e0d4591c35e8466f4295af2b6119c66' })));
    }
    get element() { return this; }
    static get watchers() { return {
        "selectedTemplateId": ["selectedTemplateIdChanged"],
        "templateIds": ["templateIdsChanged"]
    }; }
    static get style() { return TemplateChooserStyle0; }
}, [1, "template-chooser", {
        "langObj": [8, "lang-obj"],
        "selectedTemplateId": [8, "selected-template-id"],
        "templateIds": [1, "template-ids"],
        "templates": [32],
        "translator": [32]
    }, undefined, {
        "selectedTemplateId": ["selectedTemplateIdChanged"],
        "templateIds": ["templateIdsChanged"]
    }]);
function defineCustomElement() {
    if (typeof customElements === "undefined") {
        return;
    }
    const components = ["template-chooser"];
    components.forEach(tagName => { switch (tagName) {
        case "template-chooser":
            if (!customElements.get(tagName)) {
                customElements.define(tagName, TemplateChooser);
            }
            break;
    } });
}

export { TemplateChooser as T, defineCustomElement as d };

//# sourceMappingURL=template-chooser2.js.map