import type { Components, JSX } from "../types/components";

interface ReportSettings extends Components.ReportSettings, HTMLElement {}
export const ReportSettings: {
    prototype: ReportSettings;
    new (): ReportSettings;
};
/**
 * Used to define this component and all nested components recursively.
 */
export const defineCustomElement: () => void;
