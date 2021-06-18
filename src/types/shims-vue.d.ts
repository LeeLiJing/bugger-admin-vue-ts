declare module '*.vue' {
    import { DefineComponent } from 'vue';
    const component: DefineComponent<{}, {}, any>;
    export default component;
}

declare module 'nprogress' {
    export function configure(options: any): void;

    export function start(): void;

    export function done(): void;
}

declare module 'store' {
    export function set(key: string, value: any): void;

    export function get(key: string): any;

    export function remove(key: string): void;

    export function clearAll(): void;

    export function each(callback: Function): void;
}

declare module 'cl-admin-crud-vue3' {
    import type { ClContextMenu } from 'cl-admin-crud-vue3/types';
    import type { Plugin } from 'vue';

    const ContextMenu: ClContextMenu;
    const Crud: Plugin;

    export { ContextMenu, Crud };
    export * from 'cl-admin-crud-vue3';
}
