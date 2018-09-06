export namespace Selector {

    export function select<T>(ele: DocumentFragment, handler: (this: DocumentFragment, ...arg: HTMLElement[]) => T, ...arg: (string|Element)[]): T
    export function select<T, P extends HTMLElement>(ele: HTMLElement, handler: (this: P, ...arg: HTMLElement[]) => T, ...arg: (string|Element)[]): T
    export function select<T>(ele: string, handler: (this: HTMLElement, ...arg: HTMLElement[]) => T, ...arg: (string|Element)[]): T
    export function select<T>(ele, handler, ...arg: string[]): T {
        let
            element = typeof ele === 'string' ? document.querySelector(ele) : ele,
            args = [], i = 0, l = arg.length;
        for (; i < l; i++) {
            args[i] = typeof arg[i] === 'string' ? element.querySelector(arg[i]) : arg[i];
        }
        return handler.apply(element, args);
    };


    export function byId(s: string): HTMLElement {
        return document.getElementById(s);
    }
}