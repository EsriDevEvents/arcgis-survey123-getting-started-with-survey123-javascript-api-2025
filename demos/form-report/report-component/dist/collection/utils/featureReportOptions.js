/**
 * Survey123 feature report options.
 */
export class Survey123FeatureReportOptions {
    /**
     * @internal
     * @param metadata
     */
    constructor(metadata) {
        const defaultValue = {
            url: 'https://survey123.arcgis.com/api/featureReport',
            itemId: null,
            token: null,
            portalUrl: 'https://www.arcgis.com',
            f: 'json'
        };
        Object.assign(this, defaultValue, metadata || {});
    }
}
//# sourceMappingURL=featureReportOptions.js.map
