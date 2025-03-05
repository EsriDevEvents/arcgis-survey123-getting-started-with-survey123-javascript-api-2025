import { Host, h } from "@stencil/core";
import { TranslateService } from "../../services/translate.service";
import { getUserContent } from "@esri/arcgis-rest-portal";
import { UtilService } from "../../services/util.service";
import { ReportService } from "../../services/report.service";
import { StateService } from "../../services/state.service";
export class ReportSettings {
    constructor() {
        this.reportService = ReportService.getService();
        this.state = StateService.getService();
        this.mergeFiles = undefined;
        this.outputFormat = 'word';
        this.conflictBehavior = 'rename';
        this.fileName = undefined;
        this.visibleElems = [];
        this.translator = undefined;
        this.langReport = undefined;
        this.helperObj = undefined;
        this.featureCount = undefined;
        this.printTemplates = [];
    }
    onFileNameChange() {
        this.fileNameChangeHandler({
            target: {
                value: this.fileName
            }
        });
    }
    componentWillLoad() {
        return Promise.resolve(true)
            // .then(() => {
            //   return TranslateService.getService().getTranslate();
            // })
            .then(() => {
            const res = TranslateService.getService().getTranslateSync();
            this.translator = res;
            this.langReport = res === null || res === void 0 ? void 0 : res.customPrint;
            this.state.subscribe('locale-data-changed', (data) => {
                this.translator = data;
                this.langReport = data === null || data === void 0 ? void 0 : data.customPrint;
            });
            // this.langCommon = res.common;
            this.printTemplates = this.reportService.getHelperObj('printTemplates') || [];
            this.state.subscribe('print-templates-updated', (data) => {
                this.printTemplates = data || [];
            });
            this.helperObj = this.reportService.getHelperObj();
            this.featureCount = this.reportService.getHelperObj('featureCount') || 0;
            this.state.subscribe('portal-info-update', () => {
                this.featureCount = this.reportService.getHelperObj('featureCount') || 0;
            });
            this.state.subscribe('feature-count-updated', () => {
                this.featureCount = this.reportService.getHelperObj('featureCount') || 0;
            });
            return this.getUserFolders();
        }).catch((err) => {
            this.reportService.showError(err);
        });
    }
    /**
     * merge mode change: 'none' | 'nextPage' | 'continuous'
     * @param evt
     */
    fileOptChangeHandler(evt) {
        const cachedParam = this.reportService.getParamCache();
        if (evt.detail !== 'split') {
            cachedParam.mergeFiles = evt.detail;
        }
        else {
            delete cachedParam.mergeFiles;
        }
        this.fileOptionChange.emit(evt.detail);
    }
    /**
     * file name change handler
     * @param evt
     */
    fileNameChangeHandler(evt) {
        this.fileName = evt.target.value;
        const outputReportName = this.fileName;
        // Use outputReportName as outputPackageName if it doesn't have any variables and outputPackageName is not specified by user
        // https://devtopia.esri.com/Beijing-R-D-Center/feature-report/issues/252
        if (outputReportName) {
            const placeholders = this.extractPlaceholders(outputReportName);
            if (!(placeholders && placeholders.length)) {
                this.reportService.setParamCache({
                    outputPackageName: outputReportName
                });
            }
        }
        this.reportService.setParamCache({
            outputReportName: outputReportName
        });
        this.fileNameChange.emit(this.fileName);
    }
    /**
     * selected folder changed
     * @param evt
     */
    selectedFolderChangeHandler() {
        const uploadInfo = this.reportService.getParamCache('uploadInfo') || {
            type: 'arcgis', // 'ArcGIS Online',
            parameters: {},
            conflictBehavior: 'rename'
        };
        uploadInfo.parameters.folderId = this.selectedFolder.id === 'all' ? '' : this.selectedFolder.id;
        this.reportService.setParamCache({
            uploadInfo: uploadInfo
        });
        this.selectedFolderChange.emit(this.selectedFolder);
    }
    /**
     * selected format handlder
     * @param evt
     */
    outputFormatChangeHandler(evt) {
        this.outputFormat = evt.target.value;
        this.reportService.setParamCache({
            outputFormat: this.outputFormat
        });
        this.selectedFileFormatChange.emit(this.outputFormat);
    }
    /**
     * get user folders
     * @returns
     */
    getUserFolders() {
        var _a, _b;
        const utilService = UtilService.getService();
        const userName = (_a = utilService.getUser()) === null || _a === void 0 ? void 0 : _a.username;
        const rootFolderStr = (_b = this.langReport) === null || _b === void 0 ? void 0 : _b.saveToAGOFolderRoot.replace('${$username}', userName);
        const params = Object.assign({ owner: userName }, utilService.getBaseRequestOptions());
        return getUserContent(params).then((res) => {
            this.folders = [];
            const folders = [];
            // add root folder
            folders.push({
                username: userName,
                id: 'all',
                value: 'all',
                title: rootFolderStr, // todo: use i18n string
                label: rootFolderStr,
                created: null
            });
            if (res && res.folders && res.folders.length) {
                res.folders.forEach((folder) => {
                    folder['label'] = folder.title;
                    folder['value'] = folder.id;
                });
                this.folders = folders.concat(res.folders);
            }
            else {
                this.folders = folders;
            }
            // if the folder name is the same as the survey title, set it as the default folder
            // this.selectedFolder = this.folders.find((fd) => {
            //   return fd.title === 'Survey-' + this.survey.title;
            // }) || this.folders[0];
            this.selectedFolder = this.folders[0];
            return this.folders;
        });
    }
    // remove placeholders in output file name expression
    extractPlaceholders(exp) {
        exp = exp || '';
        const matches = exp.match(/\$[^{$]*?{[^}]*?.*?}/g), returnedMatches = [];
        if (matches) {
            matches.forEach((match) => {
                // if not duplicate, push it
                if (returnedMatches.indexOf(match) === -1) {
                    returnedMatches.push(match);
                }
            });
        }
        return returnedMatches;
    }
    /**
     * confilict behavior changed.
     * @param evt
     */
    changeConflictBehavior(evt) {
        this.conflictBehavior = evt.target.value;
        const uploadInfo = this.reportService.getParamCache('uploadInfo') || {
            type: 'arcgis',
            parameters: {},
            conflictBehavior: 'rename'
        };
        uploadInfo.conflictBehavior = this.conflictBehavior;
        this.reportService.setParamCache({
            uploadInfo: uploadInfo
        });
    }
    render() {
        var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r, _s, _t, _u, _v, _w, _x, _y, _z, _0, _1, _2, _3, _4, _5;
        return (h(Host, { key: 'f7533ed880148f57d8d02b32f1c098b7a50aaf0c' }, h("div", { key: '2a9949c62bbb802797eb7f959769290f665d5d58', class: "heading" }, (_b = (_a = this.translator) === null || _a === void 0 ? void 0 : _a.customPrint) === null || _b === void 0 ? void 0 : _b.resultSettingsLabel1), this.visibleElems.indexOf('fileOptions') < 0 ?
            null : h("file-option-chooser", { fileOption: this.mergeFiles, onFileOptionChange: (evt) => { this.fileOptChangeHandler(evt); } }), this.visibleElems.indexOf('reportName') < 0 ?
            null :
            h("calcite-label", null, (_d = (_c = this.translator) === null || _c === void 0 ? void 0 : _c.customPrint) === null || _d === void 0 ? void 0 :
                _d.saveToAGOItemName, h("calcite-input-text", { placeholder: (_f = (_e = this.translator) === null || _e === void 0 ? void 0 : _e.customPrint) === null || _f === void 0 ? void 0 : _f.saveToAGOItemName, value: this.fileName, onCalciteInputTextChange: (evt) => this.fileNameChangeHandler(evt) })), this.visibleElems.indexOf('saveToAGSAccount') < 0 ? null :
            h("calcite-label", null, h("div", { class: "folder-label" }, h("span", null, (_h = (_g = this.translator) === null || _g === void 0 ? void 0 : _g.customPrint) === null || _h === void 0 ? void 0 : _h.saveToAGOFolder), h("calcite-dropdown", { width: "l", scale: "m", "close-on-select-disabled": true, type: "click", "width-scale": "l" }, h("calcite-button", { slot: "trigger", "icon-start": "gear", appearance: "transparent" }), h("calcite-dropdown-group", null, h("div", { class: "conflict-name-setting" }, h("calcite-radio-button-group", { name: "conflict-name-options", layout: "vertical" }, h("calcite-label", { layout: "inline" }, (_k = (_j = this.translator) === null || _j === void 0 ? void 0 : _j.customPrint) === null || _k === void 0 ? void 0 :
                _k.nameConflictOptLabel, h("calcite-icon", { id: "info-icon", icon: "question", scale: "s" }, " "), h("calcite-tooltip", { label: (_m = (_l = this.translator) === null || _l === void 0 ? void 0 : _l.customPrint) === null || _m === void 0 ? void 0 : _m.nameConflictOptLabel, "reference-element": "info-icon" }, h("span", null, (_p = (_o = this.translator) === null || _o === void 0 ? void 0 : _o.customPrint) === null || _p === void 0 ? void 0 : _p.nameConflictOptLabel))), h("calcite-label", { layout: "inline" }, h("calcite-radio-button", { value: "rename", checked: this.conflictBehavior == 'rename', onCalciteRadioButtonChange: (evt) => this.changeConflictBehavior(evt) }), (_r = (_q = this.translator) === null || _q === void 0 ? void 0 : _q.customPrint) === null || _r === void 0 ? void 0 :
                _r.nameConflictOptRename), h("calcite-label", { layout: "inline" }, h("calcite-radio-button", { value: "replace", checked: this.conflictBehavior == 'replace', onCalciteRadioButtonChange: (evt) => this.changeConflictBehavior(evt) }), (_t = (_s = this.translator) === null || _s === void 0 ? void 0 : _s.customPrint) === null || _t === void 0 ? void 0 :
                _t.nameConflictOptReplace), h("calcite-label", { layout: "inline" }, h("calcite-radio-button", { value: "fail", checked: this.conflictBehavior == 'fail', onCalciteRadioButtonChange: (evt) => this.changeConflictBehavior(evt) }), (_v = (_u = this.translator) === null || _u === void 0 ? void 0 : _u.customPrint) === null || _v === void 0 ? void 0 :
                _v.nameConflictOptSkip)))))), h("calcite-tooltip", { label: this.helperObj.canCreateItem === false ? this.langReport.saveToAGONoCreatePrivilegeTip : '', "reference-element": "folder-selector" }, h("span", null, this.helperObj.canCreateItem === false ? this.langReport.saveToAGONoCreatePrivilegeTip : '')), h("calcite-combobox", { id: "folder-selector", disabled: this.helperObj.canCreateItem === false, placeholder: (_x = (_w = this.translator) === null || _w === void 0 ? void 0 : _w.customPrint) === null || _x === void 0 ? void 0 : _x.saveToAGOFolder, "selection-mode": "single-persist", clearDisabled: "true", maxItems: "7", value: this.selectedFolder, onCalciteComboboxChange: () => { this.selectedFolderChangeHandler(); } }, (this.folders || []).map((folder) => {
                var _a;
                return h("calcite-combobox-item", { value: folder.value, "text-label": folder.label, selected: folder.value === ((_a = this.selectedFolder) === null || _a === void 0 ? void 0 : _a.id) });
            }))), this.visibleElems.indexOf('outputFormat') < 0 ? null :
            h("calcite-label", null, (_z = (_y = this.translator) === null || _y === void 0 ? void 0 : _y.customPrint) === null || _z === void 0 ? void 0 :
                _z.outputFormat, h("calcite-combobox", { placeholder: (_1 = (_0 = this.translator) === null || _0 === void 0 ? void 0 : _0.customPrint) === null || _1 === void 0 ? void 0 : _1.outputFormat, "selection-mode": "single-persist", clearDisabled: "true", value: this.outputFormat, onCalciteComboboxChange: (evt) => this.outputFormatChangeHandler(evt) }, h("calcite-combobox-item", { value: 'docx', selected: this.outputFormat === 'docx', "text-label": (_3 = (_2 = this.translator) === null || _2 === void 0 ? void 0 : _2.customPrint) === null || _3 === void 0 ? void 0 : _3.outputFormatDocx }), h("calcite-combobox-item", { value: 'pdf', selected: this.outputFormat === 'pdf', "text-label": (_5 = (_4 = this.translator) === null || _4 === void 0 ? void 0 : _4.customPrint) === null || _5 === void 0 ? void 0 : _5.outputFormatPdf }))), h("slot", { key: '0ea7f1954b4d990870bce17a6f6ab3d9904242df' })));
    }
    static get is() { return "report-settings"; }
    static get encapsulation() { return "shadow"; }
    static get originalStyleUrls() {
        return {
            "$": ["report-settings.scss"]
        };
    }
    static get styleUrls() {
        return {
            "$": ["report-settings.css"]
        };
    }
    static get properties() {
        return {
            "mergeFiles": {
                "type": "string",
                "mutable": false,
                "complexType": {
                    "original": "'none' | 'nextPage' | 'continuous'",
                    "resolved": "\"continuous\" | \"nextPage\" | \"none\"",
                    "references": {}
                },
                "required": false,
                "optional": false,
                "docs": {
                    "tags": [],
                    "text": ""
                },
                "attribute": "merge-files",
                "reflect": false
            },
            "outputFormat": {
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
                "attribute": "output-format",
                "reflect": false,
                "defaultValue": "'word'"
            },
            "conflictBehavior": {
                "type": "string",
                "mutable": false,
                "complexType": {
                    "original": "'rename' | 'replace' | 'fail'",
                    "resolved": "\"fail\" | \"rename\" | \"replace\"",
                    "references": {}
                },
                "required": false,
                "optional": false,
                "docs": {
                    "tags": [],
                    "text": ""
                },
                "attribute": "conflict-behavior",
                "reflect": false,
                "defaultValue": "'rename'"
            },
            "fileName": {
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
                "attribute": "file-name",
                "reflect": false
            },
            "visibleElems": {
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
                },
                "defaultValue": "[]"
            }
        };
    }
    static get states() {
        return {
            "translator": {},
            "langReport": {},
            "helperObj": {},
            "featureCount": {},
            "printTemplates": {}
        };
    }
    static get events() {
        return [{
                "method": "fileOptionChange",
                "name": "fileOptionChange",
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
            }, {
                "method": "fileNameChange",
                "name": "fileNameChange",
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
            }, {
                "method": "selectedFolderChange",
                "name": "selectedFolderChange",
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
            }, {
                "method": "selectedFileFormatChange",
                "name": "selectedFileFormatChange",
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
    static get watchers() {
        return [{
                "propName": "fileName",
                "methodName": "onFileNameChange"
            }];
    }
}
//# sourceMappingURL=report-settings.js.map
