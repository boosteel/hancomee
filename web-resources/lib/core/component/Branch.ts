import {HTML} from "../html";

export namespace Branch {

    import compile = HTML.compile;
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
}