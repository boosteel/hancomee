import {__makeArray} from "./core";

export namespace HTML {
    export let unCamelCase = (function (r_data, r_up, fn) {
        return (s: string) => s.replace(r_data, '').replace(r_up, fn);
    })(/^data-/, /-([^-])/g, (_, i) => i.toUpperCase());


    let r = /{{(.*?)}}/g,
        r_compile_test = /{{[^{}]+}}/;

    export function replaceHTML(str: string, obj) {
        return str.replace(r, (_, p) => {
            return obj[p] == null ? '' : obj[p];
        })
    }


    export function compile(str: string) {

        if(!r_compile_test.test(str)) return () => str;

        let i = 0, l = str.length,
            s = 0, e = 0,
            array = [];

        while (i !== l) {
            if ((s = str.indexOf('{{', i)) !== -1) {

                let $v = str.substring(i, s);
                array.push(() => $v);

                e = str.indexOf('}}', s += 2);

                // _를 가지고 있을때만 Function 생성
                let
                    ss = str.substring(s, e),
                    $fn = ss.indexOf('_') === -1 ?
                        (obj) => obj[ss] == null ? '' : obj[ss] :
                        new Function('_', 'return ' + ss + ';');
                array.push($fn);

                i = e + 2;
            } else {
                let $v = str.substring(i, l);
                array.push(() => $v);
                i = l;
            }
        }

        l = array.length;

        return function (obj) {
            let i = 0, result = [];
            while (i < l) {
                result[i] = array[i++](obj);
            }
            return result.join('');
        }
    }


    let r_ease = /^\/+|\/+$/,
        r_split = /\//,
        template = '<li data-active="false">' +
            '<i data-child="{{!!_.childs}}">&gt;</i>' +
            '<a href="{{href}}">{{name}}</a>' +
            '{{_.childs ? "<ul>" + _.childs + "</ul>" : ""}}' +
            '</li>';

    function a(str: string, obj = {}) {
        let s = str.replace(r_ease, '').split(r_split),
            i = 0, l = s.length, v;
        for (; i < l; i++) {
            obj = (obj[(v = s[i])] || (obj[v] = {}))
        }
    }

    export function toObject(list: string, obj?)
    export function toObject(list: string[], obj?)
    export function toObject(list, obj = {}) {
        if (typeof list === 'string') a(list, obj);
        else {
            let l = list.length;
            while (l-- > 0) a(list[l], obj);
        }
        return obj;
    }

    function $createHTML($com, obj, name: string, url?) {
        if (obj == null) return '';
        let p, c, array = [];
        for (p in obj) {
            if (c = $createHTML($com, obj[p], p, (url ? url + '/' + p : p)))
                array.push(c);
        }
        return $com({href: url, name: name, childs: array.join('')});
    }

    export function createTree(values: string[], html = template, rootName = 'root') {
        let c = <HTMLElement>document.createElement('div');
        c.innerHTML = '<ul>' + $createHTML(compile(html), toObject(values), rootName, '') + '</ul>';
        c = <HTMLElement>c.firstElementChild;

        // <a> 엘리먼트들을 미리 땡겨놓는다.
        let anchors = <NodeListOf<HTMLAnchorElement>>c.querySelectorAll('a[href]'),
            ctrl = {
                element: c,
                active(path: string) {
                    let l = anchors.length, anchor: HTMLAnchorElement;
                    while (l-- > 0) {
                        anchor = anchors[l];
                        if (path.indexOf(anchor.getAttribute('href')) === 0) {
                            anchor.parentElement.setAttribute('data-active', 'true');
                        } else {
                            anchor.parentElement.setAttribute('data-active', 'false');
                        }
                    }
                },
                handler: <(path: string, e: MouseEvent) => any>null
            };

        c.addEventListener('click', (e) => {
            let target = <HTMLElement>e.target;
            if (target['href']) {
                ctrl.handler && ctrl.handler(target.getAttribute('href'), e);
                e.preventDefault();
            }
            else if (/i/i.test(target.tagName)) {
                let {parentElement: p} = target;
                p.setAttribute('data-active',
                    p.getAttribute('data-active') === 'true' ? 'false' : 'true');
            }
        })

        return ctrl;
    }


    function createChildren(html: string): HTMLElement[] {
        let div = document.createElement('div'),
            children: HTMLCollection, l: number, i = 0, pos = 0, c, array = [];

        div.innerHTML = html;
        children = div.children;
        l = children.length;

        while (i < l) {
            if ((c = children[i++]) && c.nodeType === 1) {
                array[pos++] = c;
            }
        }
        return array;
    }

    export function create(html: string, handler: (ele: HTMLElement, i: number) => void): void
    export function create(html: string): HTMLElement[]
    export function create(html: string, handler?) {
        let children = createChildren(html), l, i;

        if (typeof handler !== 'function') return children;

        if (l = children.length) {
            i = 0;
            while (i < l) handler(children[i], i++);
        }
    }

    export function createFragment(children: HTMLCollection): DocumentFragment
    export function createFragment(html: string): DocumentFragment
    export function createFragment(html): DocumentFragment {
        let frag = document.createDocumentFragment();

        if (typeof html === 'string')
            create(html, (v) => frag.appendChild(v));
        else {
            let l = html.length;
            while(l-- > 0) frag.insertBefore(html[l], frag.firstChild);
        }
        return frag;
    }

    export interface TemplateMap {
        com: { [index: string]: (obj) => string }
        doc: { [index: string]: DocumentFragment }
    }

    let r_script = /script/i,
        r_template = /template/i;

    export function templateMap(html: string): TemplateMap {
        let result: TemplateMap = {doc: {}, com: {}},
            array = createChildren(html), l = array.length, e;

        while (l-- > 0) {
            e = array[l];
            if(e.id) {
                if (r_script.test(e.tagName)) {
                    e.type.indexOf('html') !== -1 && (result.com[e.id] = compile(e.innerText));
                }
                if (r_template.test(e.tagName))
                    (result.doc[e.id] = createFragment(e.children));
            }
        }


        return result;
    }


    /*
     *   TO DO
     *   태그만 골라낸다.
     *   textNode부분은 더 작업해야 한다.
     */
    function htmlParser(html: string) {
        let
            pos = 0,
            lines = [], linesIndex = -1,
            stack = [], stackIndex = -1;

        while ((pos = html.indexOf('<', pos)) !== -1) {

            let l = html.indexOf('>', pos) + 1,
                line = html.substring(pos, l);      // <...>

            // ① 시작 태그
            if (html[pos + 1] !== '/') {
                let t = pos += 1,
                    tagName;

                // tagName 골라내기
                while (t < l && html[++t] !== '/' && html[t] !== ' ' && html[t] !== '>') ;
                tagName = lines[++linesIndex] = html.substring(pos, t);
                stack[++stackIndex] = line;
            }
            // ② 끝 태그
            else {
                let t = pos += 2,
                    tagName;

                // tagName 골라내기
                while (t < l && html[++t] !== ' ' && html[t] !== '>') ;
                tagName = html.substring(pos, t);


                while(linesIndex > -1 && lines[linesIndex] !== tagName) {
                    // 닫는 태그가 없는 엘리먼트들이 여기에 걸린다.
                    linesIndex--;
                    console.log('-' + stack[stackIndex--])
                }
                linesIndex--;
                console.log(stack[stackIndex--])
            }

            // 끝부분 확인
            pos = l;
        }

        return pos;
    }

}