import type { Components, JSX } from "../types/components";

interface SampleReportGenerator extends Components.SampleReportGenerator, HTMLElement {}
export const SampleReportGenerator: {
    prototype: SampleReportGenerator;
    new (): SampleReportGenerator;
};
/**
 * Used to define this component and all nested components recursively.
 */
export const defineCustomElement: () => void;
