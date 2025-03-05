import { r as registerInstance, h, H as Host } from './index-15add20a.js';

const reportBaseCss = ":host{display:block}";
const ReportBaseStyle0 = reportBaseCss;

const ReportBase = class {
    constructor(hostRef) {
        registerInstance(this, hostRef);
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
};
ReportBase.style = ReportBaseStyle0;

export { ReportBase as report_base };

//# sourceMappingURL=report-base.entry.js.map