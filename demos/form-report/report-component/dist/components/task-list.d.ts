import type { Components, JSX } from "../types/components";

interface TaskList extends Components.TaskList, HTMLElement {}
export const TaskList: {
    prototype: TaskList;
    new (): TaskList;
};
/**
 * Used to define this component and all nested components recursively.
 */
export const defineCustomElement: () => void;
