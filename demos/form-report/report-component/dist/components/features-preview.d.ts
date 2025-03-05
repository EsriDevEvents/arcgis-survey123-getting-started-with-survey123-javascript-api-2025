import type { Components, JSX } from "../types/components";

interface FeaturesPreview extends Components.FeaturesPreview, HTMLElement {}
export const FeaturesPreview: {
    prototype: FeaturesPreview;
    new (): FeaturesPreview;
};
/**
 * Used to define this component and all nested components recursively.
 */
export const defineCustomElement: () => void;
