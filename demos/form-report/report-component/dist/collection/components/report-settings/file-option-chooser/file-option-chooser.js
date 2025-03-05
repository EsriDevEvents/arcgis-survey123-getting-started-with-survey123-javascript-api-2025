import { Host, h } from "@stencil/core";
import mergeContinuousIcon from "./assets/svg/Merge_Continuous.svg";
import splitIcon from "./assets/svg/Split.svg";
import mergeNextPageIcon from "./assets/svg/Merge_Next_Page.svg";
import { TranslateService } from "../../../services/translate.service";
import { StateService } from "../../../services/state.service";
export class FileOptionChooser {
    constructor() {
        this.state = StateService.getService();
        this.svgs = {
            mergeContinuousIcon: mergeContinuousIcon, // getAssetPath('./assets/svg/Merge_Continuous.svg'),
            splitIcon: splitIcon, // getAssetPath('./assets/svg/Split.svg'),
            mergeNextPageIcon: mergeNextPageIcon //getAssetPath('./assets/svg/Merge_Next_Page.svg')
        };
        this.fileOption = 'none';
        this.translator = undefined;
        this.langReport = undefined;
    }
    componentWillLoad() {
        return Promise.resolve(true)
            // .then(() => {
            //   TranslateService
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
        });
    }
    /**
     * selet item
     * @param type
     */
    selectItem(type) {
        var _a, _b, _c, _d, _e, _f;
        this.fileOption = type;
        this.fileOptionChange.emit(this.fileOption);
        this.ele.open = false;
        if (this.fileOption) {
            this.ele.value = {
                split: (_b = (_a = this.translator) === null || _a === void 0 ? void 0 : _a.customPrint) === null || _b === void 0 ? void 0 : _b.outputModeSplit,
                nextPage: (_d = (_c = this.translator) === null || _c === void 0 ? void 0 : _c.customPrint) === null || _d === void 0 ? void 0 : _d.outputModeMergeNextPage,
                continuous: (_f = (_e = this.translator) === null || _e === void 0 ? void 0 : _e.customPrint) === null || _f === void 0 ? void 0 : _f.outputModeMergeContinuous
            }[this.fileOption];
        }
        else {
            this.ele.value = null;
        }
        // this.ele.shadowRoot.querySelector('input').value = this.fileOption; // todo: convert to the label
    }
    render() {
        var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r, _s, _t, _u, _v, _w, _x, _y, _z, _0, _1, _2, _3;
        return (h(Host, { key: '1c26742930e8f921ae26c97c7bf9afa5d58c1f2a' }, h("calcite-label", { key: '12b805254555ea01ea68db2c049dd32df137136b' }, (_b = (_a = this.translator) === null || _a === void 0 ? void 0 : _a.customPrint) === null || _b === void 0 ? void 0 :
            _b.outputMode, h("calcite-combobox", { key: 'c29d8852ba58f1ae466f5fc097ba40f59aee408d', ref: (el) => (this.ele = el), clearDisabled: "true", placeholder: (_d = (_c = this.translator) === null || _c === void 0 ? void 0 : _c.customPrint) === null || _d === void 0 ? void 0 : _d.outputMode, "selection-mode": "single-persist" }, h("calcite-combobox-item", { key: '226a55f44e259615282c492e7d43c6c4e78ca2fb', value: (_f = (_e = this.translator) === null || _e === void 0 ? void 0 : _e.customPrint) === null || _f === void 0 ? void 0 : _f.outputModeSplit, style: { display: 'none' }, selected: this.fileOption === 'none', "text-label": (_h = (_g = this.translator) === null || _g === void 0 ? void 0 : _g.customPrint) === null || _h === void 0 ? void 0 : _h.outputModeSplit }), h("calcite-combobox-item", { key: '73473f849450aca5f66a9b7d83d69a147642ecb8', value: (_k = (_j = this.translator) === null || _j === void 0 ? void 0 : _j.customPrint) === null || _k === void 0 ? void 0 : _k.outputModeMergeNextPage, style: { display: 'none' }, selected: this.fileOption === 'nextPage', "text-label": (_m = (_l = this.translator) === null || _l === void 0 ? void 0 : _l.customPrint) === null || _m === void 0 ? void 0 : _m.outputModeMergeNextPage }), h("calcite-combobox-item", { key: '325b38a0d305fc15fc9688c7eff4e30c3272c302', value: (_p = (_o = this.translator) === null || _o === void 0 ? void 0 : _o.customPrint) === null || _p === void 0 ? void 0 : _p.outputModeMergeContinuous, style: { display: 'none' }, selected: this.fileOption === 'continuous', "text-label": (_r = (_q = this.translator) === null || _q === void 0 ? void 0 : _q.customPrint) === null || _r === void 0 ? void 0 : _r.outputModeMergeContinuous }), h("ul", { key: '776c0f34429003c7dccea8437c09713dd7f68df8', class: "dropdown-menu", role: "menu" }, h("li", { key: 'ea236d3d5ba66d4b6660aee663fa6b81d014aad3', onClick: () => { this.selectItem('none'); } }, h("div", { key: '54534da33e7178687aca95421915524fc329fa66', class: "file-option-item" }, h("img", { key: 'f3272ba0a162db52a03f735d0700a28dc9c48a16', class: "bubble__avatar-thumbnail", src: this.svgs.splitIcon }), h("div", { key: 'ad09563a54655c248f55ca1ba66115afee247526' }, h("p", { key: 'a0dc58a2837edce4abd6ed9b3209fb1250858a3e', class: 'title' }, (_t = (_s = this.translator) === null || _s === void 0 ? void 0 : _s.customPrint) === null || _t === void 0 ? void 0 : _t.outputModeSplit), h("p", { key: '64749691efe97ecc1f97c3972ba2daba551ccc2a', class: 'desc' }, (_v = (_u = this.translator) === null || _u === void 0 ? void 0 : _u.customPrint) === null || _v === void 0 ? void 0 : _v.outputModeSplitDesc)))), h("li", { key: '3f418d30c60415dce5a7d3487f0c4f2c45e072ae', onClick: () => { this.selectItem('nextPage'); } }, h("div", { key: 'b544b0da01e1b4079d363280a690acbd291407ce', class: "file-option-item" }, h("img", { key: 'ab546724b31df70632cf492582a5201aaa260a0f', class: "bubble__avatar-thumbnail", src: this.svgs.mergeNextPageIcon }), h("div", { key: '37aecfdce0997129138c500f2d46d66765dc5211' }, h("p", { key: '077181d78c3ba50e1b0c6397b24612d453b7c128', class: 'title' }, (_x = (_w = this.translator) === null || _w === void 0 ? void 0 : _w.customPrint) === null || _x === void 0 ? void 0 : _x.outputModeMergeNextPage), h("p", { key: '0a59c6da44aa3a06ce9f2223d91ca852b13f6254', class: 'desc' }, (_z = (_y = this.translator) === null || _y === void 0 ? void 0 : _y.customPrint) === null || _z === void 0 ? void 0 : _z.outputModeMergeNextPageDesc)))), h("li", { key: 'db03a571cf83d5b3969ac2aa10820225b4bd97b3', onClick: () => { this.selectItem('continuous'); } }, h("div", { key: '2270ea03d93e208b93b25054e314d13122623f96', class: "file-option-item" }, h("img", { key: '29237ccfaa811d163ce0901da58fde4a16c1a2a5', class: "bubble__avatar-thumbnail", src: this.svgs.mergeContinuousIcon }), h("div", { key: 'ca6b8f37c1bc4d6eeb41dfc7621a3b33f06234df' }, h("p", { key: 'f2950540e671646a85daf2bcacda3369881f69c2', class: 'title' }, (_1 = (_0 = this.translator) === null || _0 === void 0 ? void 0 : _0.customPrint) === null || _1 === void 0 ? void 0 : _1.outputModeMergeContinuous), h("p", { key: 'ff96f4046e1b279c0d7be267a60ba7309187da94', class: 'desc' }, (_3 = (_2 = this.translator) === null || _2 === void 0 ? void 0 : _2.customPrint) === null || _3 === void 0 ? void 0 : _3.outputModeMergeContinuousDesc))))))), h("slot", { key: '807339a6badfe684f25a88bd40f73469baeb2c15' })));
    }
    static get is() { return "file-option-chooser"; }
    static get encapsulation() { return "shadow"; }
    static get originalStyleUrls() {
        return {
            "$": ["file-option-chooser.scss"]
        };
    }
    static get styleUrls() {
        return {
            "$": ["file-option-chooser.css"]
        };
    }
    static get properties() {
        return {
            "fileOption": {
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
                "attribute": "file-option",
                "reflect": true,
                "defaultValue": "'none'"
            }
        };
    }
    static get states() {
        return {
            "translator": {},
            "langReport": {}
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
            }];
    }
}
//# sourceMappingURL=file-option-chooser.js.map
