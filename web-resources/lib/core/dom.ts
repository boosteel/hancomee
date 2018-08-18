

export namespace DOM {

    let doc = document;

    export function closest(target: any,
                             handler: (e: Element, index: number) => boolean,
                             limit: Element = null): HTMLElement {
        let index = 0;
        do {
            if (handler(target, index++)) return <HTMLElement>target;
        } while ((target = target.parentElement) && target !== limit);

        return <any>target;
    }


    /*
     *  body에 스크롤이 설정된 경우도 있다.
     *  이와 같은 상황을 방지하기 위해 offset 계산에서 body를 빼야 한다.
     *  안 그러면 스크롤이 내려갈수록 body의 scrollTop값이 빠지면서,
     *  element의 offset.top값이 점점 작아진다.
     */
    export function offset(e: HTMLElement, parent?: HTMLElement, extend?: boolean): { left: number, top: number, width: number, height: number, right: number, bottom: number }
    export function offset(e: HTMLElement, parent?: HTMLElement): { left: number, top: number }
    export function offset(e: HTMLElement, parent = document.body, extend = false) {
        let l = 0, t = 0, target = e;
        do {
            t += target.offsetTop - target.scrollTop;
            l += target.offsetLeft - target.scrollLeft;
        } while ((target = <HTMLElement>target.offsetParent) && target !== parent);

        let result = {left: l, top: t};

        if (extend === true) {
            let w = e.offsetWidth, h = e.offsetHeight;
            result['width'] = w;
            result['height'] = h;
            result['right'] = w + l;
            result['bottom'] = t + h;
        }

        return result;
    }

    export function isAssignableFrom(target: Element, parent: Element) {
        do {
            if (target === parent) return true;
        } while (target = target.parentElement);
        return false;
    }

    export function selector(selector: string, parent: Element = <any>document) {
        return toArray(parent.querySelectorAll(selector));
    }


    // NodeList등을 array로!!
    export function toArray(elements: HTMLElement | { [index: number]: any }, result = []) {
        let len = elements['length'];
        if (typeof len === 'number') {
            for (let i = 0; i < len; i++) {
                result.push(<HTMLElement>elements[i]);
            }
        } else result.push(<HTMLElement>elements);
        return result;
    }


    // obj는 인터폴레이터용
    export function stringToDOM(str: string, obj?: {}) {
        let v, div = document.createElement('div');

        if (obj) {
            str = str.replace(/{{(.+?)}}/g, (_, p) => {
                if ((v = obj[p]) != null) {
                    if (typeof v === 'function') return v.call(obj);
                    return v;
                }
                return '';
            });
        }

        div.innerHTML = str;
        return toArray(div.children);
    }


    export function hasClass(element: Element, name: string | string[]) {
        let
            className = element.className.split(c_r),
            names = Array.isArray(name) ? name : [name];
        return names.every((v) => className.indexOf(v) !== -1);
    }


    /*
     *  isAdd가 null이면 toggleClass로 작동한다.
     */
    let c_r = /\s+/,
        uuid = 1;


    /*
     *  2018-01-20
     *  원래는 <div> 하나의 객체를 만들어서 재활용하는 형태로 사용했었다.
     *  하지만 그렇게 할 경우 ie에서 버그가 생긴다.
     */
    export let createHTML = (function () {

        var r = /^<([^\s>]+)/i;

        function get(parent, html, tag) {
            var index;
            switch (tag) {
                case 'option' :
                    index = 2;
                    parent.innerHTML = '<select>' + html + '</select>';
                    break;
                case 'thead' :
                case 'tbody' :
                case 'tfoot' :
                case 'colgroup' :
                case 'caption' :
                    index = 2;
                    parent.innerHTML = '<table>' + html + '</table>';
                    break;
                case 'col' :
                    index = 3;
                    parent.innerHTML = '<table><colgroup>' + html + '</colgroup></table>';
                    break;
                case 'tr' :
                    index = 3;
                    parent.innerHTML = '<table><tbody>' + html + '</tbody></table>';
                    break;
                case 'td' :
                case 'th' :
                    index = 4;
                    parent.innerHTML = '<table><tbody><tr>' + html + '</tr></tbody></table>';
                    break;
                default:
                    parent.innerHTML = html;
                    return parent.firstElementChild;
            }

            while (index-- > 0) parent = parent.firstElementChild;
            return parent;
        }

        return function (html): HTMLElement {
            html = html.trim();
            return get(document.createElement('div'), html, r.exec(html)[1]);
        }

    })();

    /*
     *  isAdd가 null로 들어오면 toggle로 동작한다.
     */
    export function className(element: Element, handler: (array: string[], element: HTMLElement) => string[]): string[]
    export function className(element: Element, value: string | string[], isAdd: boolean): HTMLElement
    export function className(element: Element, value: string | string[]): HTMLElement
    export function className(element, value, isAdd?) {

        if(element == null) return element;

        let className = element.className.trim(),
            array = className ? className.split(c_r) : [],
            result: string[];

        if (typeof value === 'function') {
            result = value.call(element, array, element);
        } else {
            let values = Array.isArray(value) ? value : [value];

            // ① ['a', 'u']  ==> ['!a', 'b']  ====>  ['u', 'b'];
            if (isAdd == null) result = __toggleClass(array, values);
            else if (isAdd === true) result = __addClass(array, values);
            else result = __removeClass(array, values);
        }
        element.className = result.join(' ');
        return element;
    }

    function __addClass(array, target) {
        var i = 0, l = target.length;
        for (; i < l; i++) {
            array.indexOf(target[i]) === -1 && array.push(target[i]);
        }
        return array;
    }

    function __removeClass(array, target) {
        var i = 0, l = array.length, result = [], pos = 0;
        for (; i < l; i++) {
            target.indexOf(array[i]) === -1 && (result[pos++] = array[i])
        }
        return result;
    }

    function __toggleClass(array: string[], values: string[]) {
        let l = values.length, i = 0, pos = -1, result = [], v, removal;
        for (; i < l; i++) {
            if (removal = (v = values[i])[0] === '!') {
                if ((pos = array.indexOf(v.slice(1))) !== -1) array.splice(pos, 1);
            } else {
                if ((pos = array.indexOf(v)) === -1) result.push(v);
            }
        }
        return array.concat(result);
    }

    export function eachAttrs<T extends Element>(ele: T, handler: (this: T, attrName: string, attrValue: string) => boolean|void) {
        let {attributes, attributes: {length}} = ele;
        while(length-- > 0)
            if(handler.call(ele, attributes[length].name, attributes[length].value) === false) return;
    }

    export let attrMap = (function (r_data, r_up, fn) {
        let rename = (s: string) => s.replace(r_data, '').replace(r_up, fn);

        return function (element: Element) {
            let {attributes} = element, {length} = attributes, attr: Attr, result = {};
            while (length-- > 0) {
                attr = attributes[length];
                result[rename(attr.name)] = attr.value;
            }
            return result;
        }

    })(/^data-/, /-([^-])/g, (_, i) => i.toUpperCase())
}
