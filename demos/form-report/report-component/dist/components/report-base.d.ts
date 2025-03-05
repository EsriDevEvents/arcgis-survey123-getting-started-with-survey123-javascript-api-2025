import type { Components, JSX } from "../types/components";

interface ReportBase extends Components.ReportBase, HTMLElement {}
export const ReportBase: {
    prototype: ReportBase;
    new (): ReportBase;
};
/**
 * Used to define this component and all nested components recursively.
 */
export const defineCustomElement: () => void;
