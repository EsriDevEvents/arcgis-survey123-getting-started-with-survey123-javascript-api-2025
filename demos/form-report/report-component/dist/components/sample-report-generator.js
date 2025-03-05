import { proxyCustomElement, HTMLElement, h, Host } from '@stencil/core/internal/client';

const sampleReportGeneratorCss = ":host{display:block;padding:0 0.75rem}";
const SampleReportGeneratorStyle0 = sampleReportGeneratorCss;

const SampleReportGenerator$1 = /*@__PURE__*/ proxyCustomElement(class SampleReportGenerator extends HTMLElement {
    constructor() {
        super();
        this.__registerHost();
        this.__attachShadow();
    }
    render() {
        return (h(Host, { key: '8aa7b3a04e7d9ab0bb01c3f34e93ab391d5e5a1b' }, h("slot", { key: '20b8640479a14bbe982cd80304de04e95950bfcc' })));
    }
    static get style() { return SampleReportGeneratorStyle0; }
}, [1, "sample-report-generator"]);
function defineCustomElement$1() {
    if (typeof customElements === "undefined") {
        return;
    }
    const components = ["sample-report-generator"];
    components.forEach(tagName => { switch (tagName) {
        case "sample-report-generator":
            if (!customElements.get(tagName)) {
                customElements.define(tagName, SampleReportGenerator$1);
            }
            break;
    } });
}

const SampleReportGenerator = SampleReportGenerator$1;
const defineCustomElement = defineCustomElement$1;

export { SampleReportGenerator, defineCustomElement };

//# sourceMappingURL=sample-report-generator.js.map