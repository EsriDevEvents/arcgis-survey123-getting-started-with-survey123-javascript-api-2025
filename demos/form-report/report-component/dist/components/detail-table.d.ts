import type { Components, JSX } from "../types/components";

interface DetailTable extends Components.DetailTable, HTMLElement {}
export const DetailTable: {
    prototype: DetailTable;
    new (): DetailTable;
};
/**
 * Used to define this component and all nested components recursively.
 */
export const defineCustomElement: () => void;
