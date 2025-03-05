import type { Components, JSX } from "../types/components";

interface ReportIcon extends Components.ReportIcon, HTMLElement {}
export const ReportIcon: {
    prototype: ReportIcon;
    new (): ReportIcon;
};
/**
 * Used to define this component and all nested components recursively.
 */
export const defineCustomElement: () => void;
