import type { Components, JSX } from "../types/components";

interface ReportGenerator extends Components.ReportGenerator, HTMLElement {}
export const ReportGenerator: {
    prototype: ReportGenerator;
    new (): ReportGenerator;
};
/**
 * Used to define this component and all nested components recursively.
 */
export const defineCustomElement: () => void;
