'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

const index = require('./index-1f4276ed.js');

const reportBaseCss = ":host{display:block}";
const ReportBaseStyle0 = reportBaseCss;

const ReportBase = class {
    constructor(hostRef) {
        index.registerInstance(this, hostRef);
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
        return (index.h(index.Host, { key: '156797c59566026e73440a3643805c342fa86fde' }, index.h("slot", { key: '0114beaaac043dcb2bbcc4a12105279cd8c8fecd' })));
    }
};
ReportBase.style = ReportBaseStyle0;

exports.report_base = ReportBase;

//# sourceMappingURL=report-base.cjs.entry.js.map