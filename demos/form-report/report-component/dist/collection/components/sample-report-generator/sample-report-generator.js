import { Host, h } from "@stencil/core";
export class SampleReportGenerator {
    render() {
        return (h(Host, { key: '8aa7b3a04e7d9ab0bb01c3f34e93ab391d5e5a1b' }, h("slot", { key: '20b8640479a14bbe982cd80304de04e95950bfcc' })));
    }
    static get is() { return "sample-report-generator"; }
    static get encapsulation() { return "shadow"; }
    static get originalStyleUrls() {
        return {
            "$": ["sample-report-generator.css"]
        };
    }
    static get styleUrls() {
        return {
            "$": ["sample-report-generator.css"]
        };
    }
}
//# sourceMappingURL=sample-report-generator.js.map
