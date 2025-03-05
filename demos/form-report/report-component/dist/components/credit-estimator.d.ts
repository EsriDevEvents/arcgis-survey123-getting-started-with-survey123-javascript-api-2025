import type { Components, JSX } from "../types/components";

interface CreditEstimator extends Components.CreditEstimator, HTMLElement {}
export const CreditEstimator: {
    prototype: CreditEstimator;
    new (): CreditEstimator;
};
/**
 * Used to define this component and all nested components recursively.
 */
export const defineCustomElement: () => void;
