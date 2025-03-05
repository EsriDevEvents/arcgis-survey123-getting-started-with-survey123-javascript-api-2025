import type { Components, JSX } from "../types/components";

interface TaskInfo extends Components.TaskInfo, HTMLElement {}
export const TaskInfo: {
    prototype: TaskInfo;
    new (): TaskInfo;
};
/**
 * Used to define this component and all nested components recursively.
 */
export const defineCustomElement: () => void;
