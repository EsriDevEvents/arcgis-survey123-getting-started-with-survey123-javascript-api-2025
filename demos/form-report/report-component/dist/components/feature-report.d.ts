import type { Components, JSX } from "../types/components";

interface FeatureReport extends Components.FeatureReport, HTMLElement {}
export const FeatureReport: {
    prototype: FeatureReport;
    new (): FeatureReport;
};
/**
 * Used to define this component and all nested components recursively.
 */
export const defineCustomElement: () => void;
