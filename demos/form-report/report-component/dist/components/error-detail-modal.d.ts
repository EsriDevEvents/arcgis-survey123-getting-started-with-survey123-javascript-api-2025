import type { Components, JSX } from "../types/components";

interface ErrorDetailModal extends Components.ErrorDetailModal, HTMLElement {}
export const ErrorDetailModal: {
    prototype: ErrorDetailModal;
    new (): ErrorDetailModal;
};
/**
 * Used to define this component and all nested components recursively.
 */
export const defineCustomElement: () => void;
