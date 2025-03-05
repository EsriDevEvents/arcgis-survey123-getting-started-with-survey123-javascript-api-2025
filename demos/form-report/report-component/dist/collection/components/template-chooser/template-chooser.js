import { Host, h } from "@stencil/core";
import { PropsService } from "../../services/props.service";
import { ReportService } from "../../services/report.service";
// import { TranslateService } from '../../services/translate.service';
import { StateService } from "../../services/state.service";
import { TranslateService } from "../../services/translate.service";
export class TemplateChooser {
    constructor() {
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
    static get is() { return "template-chooser"; }
    static get encapsulation() { return "shadow"; }
    static get originalStyleUrls() {
        return {
            "$": ["template-chooser.scss"]
        };
    }
    static get styleUrls() {
        return {
            "$": ["template-chooser.css"]
        };
    }
    static get properties() {
        return {
            "langObj": {
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
                "attribute": "lang-obj",
                "reflect": false
            },
            "selectedTemplateId": {
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
                "attribute": "selected-template-id",
                "reflect": false
            },
            "templateIds": {
                "type": "string",
                "mutable": false,
                "complexType": {
                    "original": "string",
                    "resolved": "string",
                    "references": {}
                },
                "required": false,
                "optional": false,
                "docs": {
                    "tags": [],
                    "text": ""
                },
                "attribute": "template-ids",
                "reflect": false
            }
        };
    }
    static get states() {
        return {
            "templates": {},
            "translator": {}
        };
    }
    static get events() {
        return [{
                "method": "selectedTemplateChange",
                "name": "selectedTemplateChange",
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
    static get elementRef() { return "element"; }
    static get watchers() {
        return [{
                "propName": "selectedTemplateId",
                "methodName": "selectedTemplateIdChanged"
            }, {
                "propName": "templateIds",
                "methodName": "templateIdsChanged"
            }];
    }
}
//# sourceMappingURL=template-chooser.js.map
