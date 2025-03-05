import { proxyCustomElement, HTMLElement, h, Host } from '@stencil/core/internal/client';

const creditEstimatorCss = ":host{display:block}";
const CreditEstimatorStyle0 = creditEstimatorCss;

const CreditEstimator$1 = /*@__PURE__*/ proxyCustomElement(class CreditEstimator extends HTMLElement {
    constructor() {
        super();
        this.__registerHost();
        this.__attachShadow();
    }
    render() {
        return (h(Host, { key: '8dd32e95bac32ab9c12ae6eaee29ea03a0547ba1' }, h("slot", { key: '1602cc856944e18bb5a785b41757112fc3d48aae' })));
    }
    static get style() { return CreditEstimatorStyle0; }
}, [1, "credit-estimator"]);
function defineCustomElement$1() {
    if (typeof customElements === "undefined") {
        return;
    }
    const components = ["credit-estimator"];
    components.forEach(tagName => { switch (tagName) {
        case "credit-estimator":
            if (!customElements.get(tagName)) {
                customElements.define(tagName, CreditEstimator$1);
            }
            break;
    } });
}

const CreditEstimator = CreditEstimator$1;
const defineCustomElement = defineCustomElement$1;

export { CreditEstimator, defineCustomElement };

//# sourceMappingURL=credit-estimator.js.map