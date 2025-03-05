import type { Components, JSX } from "../types/components";

interface SuccessDetailModal extends Components.SuccessDetailModal, HTMLElement {}
export const SuccessDetailModal: {
    prototype: SuccessDetailModal;
    new (): SuccessDetailModal;
};
/**
 * Used to define this component and all nested components recursively.
 */
export const defineCustomElement: () => void;
