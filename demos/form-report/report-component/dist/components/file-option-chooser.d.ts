import type { Components, JSX } from "../types/components";

interface FileOptionChooser extends Components.FileOptionChooser, HTMLElement {}
export const FileOptionChooser: {
    prototype: FileOptionChooser;
    new (): FileOptionChooser;
};
/**
 * Used to define this component and all nested components recursively.
 */
export const defineCustomElement: () => void;
