import { proxyCustomElement, HTMLElement, h, Host } from '@stencil/core/internal/client';

const reportBaseCss = ":host{display:block}";
const ReportBaseStyle0 = reportBaseCss;

const ReportBase$1 = /*@__PURE__*/ proxyCustomElement(class ReportBase extends HTMLElement {
    constructor() {
        super();
        this.__registerHost();
        this.__attachShadow();
        this.featureLayerUrl = undefined;
        this.token = undefined;
        this.url = undefined;
        this.username = undefined;
        this.surveyItemId = undefined;
        this.portalUrl = undefined;
        this.f = undefined;
        this.locale = undefined;
    }
    /**
     * @internal
     * @param metadata
     */
    // constructor(metadata?: any) {
    //   const defaultValue = {
    //     url: 'https://survey123.arcgis.com/api/featureReport',
    //     itemId: null,
    //     token: null,
    //     portalUrl: 'https://www.arcgis.com',
    //     f: 'json'
    //   };
    //   Object.assign(this, defaultValue, metadata || {});
    // }
    render() {
        return (h(Host, { key: '156797c59566026e73440a3643805c342fa86fde' }, h("slot", { key: '0114beaaac043dcb2bbcc4a12105279cd8c8fecd' })));
    }
    static get style() { return ReportBaseStyle0; }
}, [1, "report-base", {
        "featureLayerUrl": [1, "feature-layer-url"],
        "token": [1],
        "url": [1],
        "username": [1],
        "surveyItemId": [1, "survey-item-id"],
        "portalUrl": [1, "portal-url"],
        "f": [1],
        "locale": [1]
    }]);
function defineCustomElement$1() {
    if (typeof customElements === "undefined") {
        return;
    }
    const components = ["report-base"];
    components.forEach(tagName => { switch (tagName) {
        case "report-base":
            if (!customElements.get(tagName)) {
                customElements.define(tagName, ReportBase$1);
            }
            break;
    } });
}

const ReportBase = ReportBase$1;
const defineCustomElement = defineCustomElement$1;

export { ReportBase, defineCustomElement };

//# sourceMappingURL=report-base.js.map