import { proxyCustomElement, HTMLElement, createEvent, h, Host } from '@stencil/core/internal/client';
import { T as TranslateService } from './translate.service.js';
import { S as StateService } from './state.service.js';

const mergeContinuousSvg = 'data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiPz4KPHN2ZyB3aWR0aD0iMzZweCIgaGVpZ2h0PSI0MnB4IiB2aWV3Qm94PSIwIDAgMzYgNDIiIHZlcnNpb249IjEuMSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4bWxuczp4bGluaz0iaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluayI+CiAgICA8dGl0bGU+TWVyZ2UgKGNvbnRpbnVvdXMpPC90aXRsZT4KICAgIDxnIGlkPSJEYXRhIiBzdHJva2U9Im5vbmUiIHN0cm9rZS13aWR0aD0iMSIgZmlsbD0ibm9uZSIgZmlsbC1ydWxlPSJldmVub2RkIj4KICAgICAgICA8ZyBpZD0iUmVwb3J0LUZpbGUtb3B0aW9ucyIgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoLTMyLjAwMDAwMCwgLTc2MC4wMDAwMDApIj4KICAgICAgICAgICAgPGcgaWQ9IkZlYXR1cmUtUmVwb3J0IiB0cmFuc2Zvcm09InRyYW5zbGF0ZSgwLjAwMDAwMCwgMTYwLjAwMDAwMCkiPgogICAgICAgICAgICAgICAgPGcgaWQ9Ik91dHB1dC1zZXR0aW5ncyIgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoMjAuMDAwMDAwLCAzNTUuMDAwMDAwKSI+CiAgICAgICAgICAgICAgICAgICAgPGcgaWQ9IkZpbGUtb3B0aW9ucyIgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoMC4wMDAwMDAsIDI5LjAwMDAwMCkiPgogICAgICAgICAgICAgICAgICAgICAgICA8ZyBpZD0iQ2hvaWMiIHRyYW5zZm9ybT0idHJhbnNsYXRlKDAuMDAwMDAwLCA2OS4wMDAwMDApIj4KICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxnIGlkPSJNZXJnZS0oY29udGludW91cykiIHRyYW5zZm9ybT0idHJhbnNsYXRlKDEyLjAwMDAwMCwgMTQ3LjAwMDAwMCkiPgogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxwYXRoIGQ9Ik0yNCwwIEwzNCwxMCBMMzQsNDIgTDIsNDIgTDIsMCBMMjQsMCBaIE0zLDEgTDMsNDEgTDMzLDQxIEwzMywxMSBMMjMsMTEgTDIzLDEgTDMsMSBaIE0zMi41ODYsMTAgTDI0LDEuNDE1IEwyNCwxMCBMMzIuNTg2LDEwIFoiIGlkPSJQYWdlIiBmaWxsPSIjREREREREIiBmaWxsLXJ1bGU9Im5vbnplcm8iPjwvcGF0aD4KICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8cGF0aCBkPSJNMzAsMzYgTDMwLDM3IEw2LDM3IEw2LDM2IEwzMCwzNiBaIE0zMCwzMiBMMzAsMzMgTDYsMzMgTDYsMzIgTDMwLDMyIFogTTI0LDI4IEwyNCwyOSBMNiwyOSBMNiwyOCBMMjQsMjggWiBNMzAsMjQgTDMwLDI1IEw2LDI1IEw2LDI0IEwzMCwyNCBaIE0zMCwyMCBMMzAsMjEgTDYsMjEgTDYsMjAgTDMwLDIwIFogTTYsMTQgTDksMTYuNSBMNiwxOSBMNiwxNCBaIE0zMCwxNiBMMzAsMTcgTDEwLDE3IEwxMCwxNiBMMzAsMTYgWiIgaWQ9IlJlcG9ydCIgZmlsbD0iI0MwODIwOCI+PC9wYXRoPgogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxwYXRoIGQ9Ik0zMCwxMiBMMzAsMTMgTDYsMTMgTDYsMTIgTDMwLDEyIFogTTIyLDggTDIyLDkgTDYsOSBMNiw4IEwyMiw4IFogTTIyLDQgTDIyLDUgTDYsNSBMNiw0IEwyMiw0IFoiIGlkPSJSZXBvcnQiIGZpbGw9IiNCQUJEQzkiPjwvcGF0aD4KICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvZz4KICAgICAgICAgICAgICAgICAgICAgICAgPC9nPgogICAgICAgICAgICAgICAgICAgIDwvZz4KICAgICAgICAgICAgICAgIDwvZz4KICAgICAgICAgICAgPC9nPgogICAgICAgIDwvZz4KICAgIDwvZz4KPC9zdmc+';

const splitSvg = 'data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiPz4KPHN2ZyB3aWR0aD0iMzZweCIgaGVpZ2h0PSI0MnB4IiB2aWV3Qm94PSIwIDAgMzYgNDIiIHZlcnNpb249IjEuMSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4bWxuczp4bGluaz0iaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluayI+CiAgICA8dGl0bGU+U3BsaXQ8L3RpdGxlPgogICAgPGcgaWQ9IkRhdGEiIHN0cm9rZT0ibm9uZSIgc3Ryb2tlLXdpZHRoPSIxIiBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPgogICAgICAgIDxnIGlkPSJSZXBvcnQtRmlsZS1vcHRpb25zIiB0cmFuc2Zvcm09InRyYW5zbGF0ZSgtMzAuMDAwMDAwLCAtNjIzLjAwMDAwMCkiPgogICAgICAgICAgICA8ZyBpZD0iRmVhdHVyZS1SZXBvcnQiIHRyYW5zZm9ybT0idHJhbnNsYXRlKDAuMDAwMDAwLCAxNjAuMDAwMDAwKSI+CiAgICAgICAgICAgICAgICA8ZyBpZD0iT3V0cHV0LXNldHRpbmdzIiB0cmFuc2Zvcm09InRyYW5zbGF0ZSgyMC4wMDAwMDAsIDM1NS4wMDAwMDApIj4KICAgICAgICAgICAgICAgICAgICA8ZyBpZD0iRmlsZS1vcHRpb25zIiB0cmFuc2Zvcm09InRyYW5zbGF0ZSgwLjAwMDAwMCwgMjkuMDAwMDAwKSI+CiAgICAgICAgICAgICAgICAgICAgICAgIDxnIGlkPSJDaG9pYyIgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoMC4wMDAwMDAsIDY5LjAwMDAwMCkiPgogICAgICAgICAgICAgICAgICAgICAgICAgICAgPGcgaWQ9IlNwbGl0IiB0cmFuc2Zvcm09InRyYW5zbGF0ZSgxMC4wMDAwMDAsIDEwLjAwMDAwMCkiPgogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxwYXRoIGQ9Ik0yNiwwIEwzNiwxMCBMMzYsMzYgTDI3LDM2IEwyNywzNSBMMzUsMzUgTDM1LDExIEwyNSwxMSBMMjUsMSBMMTAsMSBMMTAsNiBMOSw2IEw5LDAgTDI2LDAgWiBNMjYsMS40MTUgTDI2LDEwIEwzNC41ODYsMTAgTDI2LDEuNDE1IFogTTE3LDYgTDI3LDE2IEwyNyw0MiBMMCw0MiBMMCw2IEwxNyw2IFogTTEsNyBMMSw0MSBMMjYsNDEgTDI2LDE3IEwxNiwxNyBMMTYsNyBMMSw3IFogTTI1LjU4NiwxNiBMMTcsNy40MTUgTDE3LDE2IEwyNS41ODYsMTYgWiIgaWQ9IlNoYXBlIiBmaWxsPSIjRDhEOEQ4IiBmaWxsLXJ1bGU9Im5vbnplcm8iPjwvcGF0aD4KICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8cGF0aCBkPSJNMzIsMjggTDMyLDI5IEwyOCwyOSBMMjgsMjggTDMyLDI4IFogTTMyLDI0IEwzMiwyNSBMMjgsMjUgTDI4LDI0IEwzMiwyNCBaIE0zMiwyMCBMMzIsMjEgTDI4LDIxIEwyOCwyMCBMMzIsMjAgWiBNMzIsMTYgTDMyLDE3IEwyOCwxNyBMMjgsMTYgTDMyLDE2IFogTTMyLDEyIEwzMiwxMyBMMjUsMTMgTDI0LDEyIEwzMiwxMiBaIE0yNCw4IEwyNCw5IEwyMSw5IEwyMCw4IEwyNCw4IFogTTI0LDUgTDI0LDQgTDEzLDQgTDEzLDUgTDI0LDUgWiIgaWQ9IlNoYXBlIiBmaWxsPSIjQzA4MjA4Ij48L3BhdGg+CiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPHBhdGggZD0iTTIzLDM0IEwyMywzNSBMNCwzNSBMNCwzNCBMMjMsMzQgWiBNMjMsMzAgTDIzLDMxIEw0LDMxIEw0LDMwIEwyMywzMCBaIE0yMywyNiBMMjMsMjcgTDQsMjcgTDQsMjYgTDIzLDI2IFogTTE5LDIyIEwxOSwyMyBMNCwyMyBMNCwyMiBMMTksMjIgWiBNMjMsMTggTDIzLDE5IEw0LDE5IEw0LDE4IEwyMywxOCBaIE0xNSwxNCBMMTUsMTUgTDQsMTUgTDQsMTQgTDE1LDE0IFogTTE1LDEwIEwxNSwxMSBMNCwxMSBMNCwxMCBMMTUsMTAgWiIgaWQ9IlJlcG9ydCIgZmlsbD0iI0JBQkRDOSI+PC9wYXRoPgogICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9nPgogICAgICAgICAgICAgICAgICAgICAgICA8L2c+CiAgICAgICAgICAgICAgICAgICAgPC9nPgogICAgICAgICAgICAgICAgPC9nPgogICAgICAgICAgICA8L2c+CiAgICAgICAgPC9nPgogICAgPC9nPgo8L3N2Zz4=';

const mergeNextPageSvg = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzYiIGhlaWdodD0iNDIiIHZpZXdCb3g9IjAgMCAzNiA0MiIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZmlsbC1ydWxlPSJldmVub2RkIiBjbGlwLXJ1bGU9ImV2ZW5vZGQiIGQ9Ik0zNiAxOFYwSDM1VjE3SDVWMEg0VjE4SDM2Wk0zNiAzNEwyNiAyNEg0VjQySDVWMjVIMjVWMzVIMzVWNDJIMzZWMzRaTTI2IDM0VjI1LjQxNUwzNC41ODYgMzRIMjZaIiBmaWxsPSIjRDhEOEQ4Ii8+CjxwYXRoIGZpbGwtcnVsZT0iZXZlbm9kZCIgY2xpcC1ydWxlPSJldmVub2RkIiBkPSJNMjQgMjhIOFYyOUgyNFYyOFpNOCAzMkgyNFYzM0g4VjMyWk04IDM2SDMyVjM3SDhWMzZaIiBmaWxsPSIjQzA4MjA4Ii8+CjxwYXRoIGZpbGwtcnVsZT0iZXZlbm9kZCIgY2xpcC1ydWxlPSJldmVub2RkIiBkPSJNMjYgNEg4VjVIMjZWNFpNOCA4SDMyVjlIOFY4Wk04IDEySDMyVjEzSDhWMTJaIiBmaWxsPSIjQkFCREM5Ii8+CjxwYXRoIGZpbGwtcnVsZT0iZXZlbm9kZCIgY2xpcC1ydWxlPSJldmVub2RkIiBkPSJNNCAyMUwwIDE4VjI0TDQgMjFaIiBmaWxsPSIjNjY2NjY2Ii8+Cjwvc3ZnPgo=';

const fileOptionChooserCss = ":host{display:block}:host p{margin:0 0 10px}:host ul.dropdown-menu{width:100%;padding:0;margin:0;box-shadow:0 0 4px 0 rgba(0, 0, 0, 0.2);border-radius:0 0 2px 2px;overflow-y:auto;min-width:100%}:host ul.dropdown-menu li{cursor:pointer;outline:none;outline:none;padding:3px 10px;overflow:hidden}:host ul.dropdown-menu li .file-option-item{display:flex;align-items:center}:host ul.dropdown-menu li .file-option-item>div{padding:8px;width:calc(100% - 20px)}:host ul.dropdown-menu li .file-option-item .title{line-height:16px;margin-bottom:5px}:host ul.dropdown-menu li .file-option-item .desc{line-height:16px;white-space:break-spaces}:host ul.dropdown-menu li.multi-choice{line-height:40px;padding-top:1px}:host ul.dropdown-menu li.multi-choice .checkbox-survey123>label{width:100%}:host ul.dropdown-menu li label{cursor:inherit}:host ul.dropdown-menu li label span{line-height:32px;max-width:100%;overflow:hidden;text-overflow:ellipsis;display:inline-block}:host ul.dropdown-menu li label span:focus{outline:none}:host ul.dropdown-menu li:hover,:host ul.dropdown-menu li:focus{background-color:var(--calcite-color-foreground-2);color:var(--calcite-color-text-1);text-decoration-line:none;--tw-shadow:0 0 #0000;--tw-shadow-colored:0 0 #0000;box-shadow:var(--tw-ring-offset-shadow, 0 0 rgba(0, 0, 0, 0)), var(--tw-ring-shadow, 0 0 rgba(0, 0, 0, 0)), var(--tw-shadow)}:host ul.dropdown-menu li.active>a ::ng-deep svg path:nth-child(1),:host ul.dropdown-menu li>a:hover ::ng-deep svg path:nth-child(1),:host ul.dropdown-menu li>a:focus ::ng-deep svg path:nth-child(1){fill:#95ABB3}:host ul.dropdown-menu li.active>a ::ng-deep svg path:nth-child(2),:host ul.dropdown-menu li>a:hover ::ng-deep svg path:nth-child(2),:host ul.dropdown-menu li>a:focus ::ng-deep svg path:nth-child(2){fill:#703B00}:host ul.dropdown-menu li.active>a ::ng-deep svg path:nth-child(3),:host ul.dropdown-menu li>a:hover ::ng-deep svg path:nth-child(3),:host ul.dropdown-menu li>a:focus ::ng-deep svg path:nth-child(3){fill:#697D94}:host ul.dropdown-menu li.deactive{cursor:not-allowed}:host ul.dropdown-menu li:focus{outline:none}";
const FileOptionChooserStyle0 = fileOptionChooserCss;

const FileOptionChooser = /*@__PURE__*/ proxyCustomElement(class FileOptionChooser extends HTMLElement {
    constructor() {
        super();
        this.__registerHost();
        this.__attachShadow();
        this.fileOptionChange = createEvent(this, "fileOptionChange", 7);
        this.state = StateService.getService();
        this.svgs = {
            mergeContinuousIcon: mergeContinuousSvg, // getAssetPath('./assets/svg/Merge_Continuous.svg'),
            splitIcon: splitSvg, // getAssetPath('./assets/svg/Split.svg'),
            mergeNextPageIcon: mergeNextPageSvg //getAssetPath('./assets/svg/Merge_Next_Page.svg')
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
    static get style() { return FileOptionChooserStyle0; }
}, [1, "file-option-chooser", {
        "fileOption": [513, "file-option"],
        "translator": [32],
        "langReport": [32]
    }]);
function defineCustomElement() {
    if (typeof customElements === "undefined") {
        return;
    }
    const components = ["file-option-chooser"];
    components.forEach(tagName => { switch (tagName) {
        case "file-option-chooser":
            if (!customElements.get(tagName)) {
                customElements.define(tagName, FileOptionChooser);
            }
            break;
    } });
}

export { FileOptionChooser as F, defineCustomElement as d };

//# sourceMappingURL=file-option-chooser2.js.map