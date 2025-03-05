import type { Components, JSX } from "../types/components";

interface TemplateChooser extends Components.TemplateChooser, HTMLElement {}
export const TemplateChooser: {
    prototype: TemplateChooser;
    new (): TemplateChooser;
};
/**
 * Used to define this component and all nested components recursively.
 */
export const defineCustomElement: () => void;
