import { Host, h, getAssetPath } from "@stencil/core";
import { UtilService } from "../../../services/util.service";
export class ReportIcon {
    constructor() {
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
    static get is() { return "report-icon"; }
    static get encapsulation() { return "shadow"; }
    static get originalStyleUrls() {
        return {
            "$": ["report-icon.scss"]
        };
    }
    static get styleUrls() {
        return {
            "$": ["report-icon.css"]
        };
    }
    static get properties() {
        return {
            "icon": {
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
                "attribute": "icon",
                "reflect": false
            },
            "size": {
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
                "attribute": "size",
                "reflect": false
            }
        };
    }
    static get states() {
        return {
            "pathData": {}
        };
    }
}
//# sourceMappingURL=report-icon.js.map
