export namespace Strings {
    export let unCamelCase = (function (r_data, r_up, fn) {
        return (s: string) => s.replace(r_data, '').replace(r_up, fn);
    })(/^data-/, /-([^-])/g, (_, i) => i.toUpperCase());


    let r = /{{(.*?)}}/g;

    export function replaceHTML(str: string, obj) {
        return str.replace(r, (_, p) => {
            return obj[p] == null ? '' : obj[p];
        })
    }
}