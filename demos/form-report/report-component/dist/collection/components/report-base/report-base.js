import { Host, h } from "@stencil/core";
export class ReportBase {
    constructor() {
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
    static get is() { return "report-base"; }
    static get encapsulation() { return "shadow"; }
    static get originalStyleUrls() {
        return {
            "$": ["report-base.scss"]
        };
    }
    static get styleUrls() {
        return {
            "$": ["report-base.css"]
        };
    }
    static get properties() {
        return {
            "featureLayerUrl": {
                "type": "string",
                "mutable": false,
                "complexType": {
                    "original": "string",
                    "resolved": "string",
                    "references": {}
                },
                "required": true,
                "optional": false,
                "docs": {
                    "tags": [],
                    "text": ""
                },
                "attribute": "feature-layer-url",
                "reflect": false
            },
            "token": {
                "type": "string",
                "mutable": false,
                "complexType": {
                    "original": "string",
                    "resolved": "string",
                    "references": {}
                },
                "required": true,
                "optional": false,
                "docs": {
                    "tags": [],
                    "text": ""
                },
                "attribute": "token",
                "reflect": false
            },
            "url": {
                "type": "string",
                "mutable": false,
                "complexType": {
                    "original": "string",
                    "resolved": "string",
                    "references": {}
                },
                "required": false,
                "optional": true,
                "docs": {
                    "tags": [],
                    "text": ""
                },
                "attribute": "url",
                "reflect": false
            },
            "username": {
                "type": "string",
                "mutable": false,
                "complexType": {
                    "original": "string",
                    "resolved": "string",
                    "references": {}
                },
                "required": false,
                "optional": true,
                "docs": {
                    "tags": [],
                    "text": ""
                },
                "attribute": "username",
                "reflect": false
            },
            "surveyItemId": {
                "type": "string",
                "mutable": false,
                "complexType": {
                    "original": "string",
                    "resolved": "string",
                    "references": {}
                },
                "required": false,
                "optional": true,
                "docs": {
                    "tags": [],
                    "text": ""
                },
                "attribute": "survey-item-id",
                "reflect": false
            },
            "portalUrl": {
                "type": "string",
                "mutable": false,
                "complexType": {
                    "original": "string",
                    "resolved": "string",
                    "references": {}
                },
                "required": false,
                "optional": true,
                "docs": {
                    "tags": [],
                    "text": ""
                },
                "attribute": "portal-url",
                "reflect": false
            },
            "f": {
                "type": "string",
                "mutable": false,
                "complexType": {
                    "original": "string",
                    "resolved": "string",
                    "references": {}
                },
                "required": false,
                "optional": true,
                "docs": {
                    "tags": [],
                    "text": ""
                },
                "attribute": "f",
                "reflect": false
            },
            "locale": {
                "type": "string",
                "mutable": false,
                "complexType": {
                    "original": "string",
                    "resolved": "string",
                    "references": {}
                },
                "required": false,
                "optional": true,
                "docs": {
                    "tags": [],
                    "text": ""
                },
                "attribute": "locale",
                "reflect": false
            }
        };
    }
}
//# sourceMappingURL=report-base.js.map
