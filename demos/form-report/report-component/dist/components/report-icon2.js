import { proxyCustomElement, HTMLElement, getAssetPath, h, Host } from '@stencil/core/internal/client';
import { U as UtilService } from './util.service.js';

const reportIconCss = ":host{display:block}";
const ReportIconStyle0 = reportIconCss;

const ReportIcon = /*@__PURE__*/ proxyCustomElement(class ReportIcon extends HTMLElement {
    constructor() {
        super();
        this.__registerHost();
        this.__attachShadow();
        this.icon = undefined;
        this.size = undefined;
        this.pathData = undefined;
    }
    componentWillLoad() {
        this.fetchIcon().then((res) => {
            this.pathData = res;
        });
    }
    fetchIcon() {
        const utils = UtilService.getService();
        return Promise.resolve(true)
            .then(() => {
            if (utils.getSvgCache(this.icon)) {
                return utils.getSvgCache(this.icon);
            }
            return fetch(getAssetPath(`./assets/icons/${this.icon}.svg`))
                .then((resp) => {
                if (!resp.ok) {
                    throw new Error("could not get the icon file:");
                }
                return resp.text();
            });
        }).then((str) => {
            utils.setSvgCache(this.icon, str);
            const div = document.createElement('div');
            div.innerHTML = str;
            if (this.size) {
                div.querySelector('svg').setAttribute('width', this.size);
                div.querySelector('svg').setAttribute('height', this.size);
            }
            return div.innerHTML;
        });
    }
    render() {
        return (h(Host, { key: 'bfda6b93ffc35d676f665226e95b4cb92dc45089' }, h("i", { key: '3f0f5a2e470f746a6af14fac54108c4366f33cc5', innerHTML: this.pathData }), h("slot", { key: '8c22b8b576cdc451d11cd323fef745bdc7757ce8' })));
    }
    static get style() { return ReportIconStyle0; }
}, [1, "report-icon", {
        "icon": [8],
        "size": [8],
        "pathData": [32]
    }]);
function defineCustomElement() {
    if (typeof customElements === "undefined") {
        return;
    }
    const components = ["report-icon"];
    components.forEach(tagName => { switch (tagName) {
        case "report-icon":
            if (!customElements.get(tagName)) {
                customElements.define(tagName, ReportIcon);
            }
            break;
    } });
}

export { ReportIcon as R, defineCustomElement as d };

//# sourceMappingURL=report-icon2.js.map