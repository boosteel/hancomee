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

        if (!r_compile_test.test(str)) return () => str;

        let i = 0, l = str.length,
            s = 0, e = 0,
            array = [], size = 0;

        while (i !== l) {
            if ((s = str.indexOf('{{', i)) !== -1) {

                let $v = str.substring(i, s);
                array[size++] = () => $v;

                e = str.indexOf('}}', s += 2);

                // _를 가지고 있을때만 Function 생성
                let
                    ss = str.substring(s, e),
                    $fn = ss.indexOf('_') === -1 ?
                        (obj) => obj == null ? '' : (typeof obj[ss] === 'function' ? obj[ss]() : obj[ss]) :
                        new Function('_', 'return _ == null ? "" : (' + ss + ');');
                array[size++] = $fn;

                i = e + 2;
            } else {
                let $v = str.substring(i, l);
                array[size++] = () => $v;
                i = l;
            }
        }

        return function (obj) {
            let i = 0, result = [];
            while (i < size) {
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
            while (l-- > 0) frag.insertBefore(html[l], frag.firstChild);
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
            if (e.id) {
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
     *  2018-09-01
     *  나의 @Template 프레임워크를 대체할 새로운 개발 패러다임이 탄생했다.
     *
     *  @Template는 HTMLElement와 객체를 1:1로 맵핑하는 패러다임이었다.
     *  매우 훌륭한 프레임워크지만, 계속 사용하다보니 유지보수할때 코드읽기가 불편한 점이 있었다.
     *  특히 template html이 여기저기 조각난채로 배치되어있다보니 최종 DOM tree에 대한 이미징이 부족했다.
     *
     *  이를 개선한 것이 바로 이 html프레임워크다.
     *  html 프레임워크는 엘리먼트를 DOM이 아닌 문자열로 다룬다.
     *  html template는 조각난채로 여기저기 배회할 필요가 없다.
     *  사용방법은 아래 코드를 참조하자.
     *
     */
    let r_replace_name = /:(:)?([^>]+)>$/,
        r_eraser = /\s+::?[^>]+>/g;

    /*
     *  템플릿 가운데 치환자로 변환할 위치를 설정하는 클래스
     *  하위 엘리먼트부터 상위로 올라가므로 시작 index는 점점 작은 숫자가 들어온다고 보면 된다.
     */
    class ParseIndex {

        values: { start: number, end: number, name: string }[] = []


        setVal(s: number, end: number, name: string) {
            let {values, values: {length}} = this, i = 0, v,
                nVal = [], nI = 0;

            while (length-- > 0) {
                v = values[length];
                if (s < v.start && v.end < end) void 0
                else nVal[nI++] = v;
            }

            nVal.push({start: s, end: end, name: name});
            this.values = nVal;

            return this;
        }

        replace(html: string) {
            let list = this.values.sort((a, b) => a.start - b.start),
                v,
                pos = 0, l = list.length, i = 0, result = [], index = 0;
            for (; i < l; i++) {
                v = list[i];
                result[index++] = html.substring(pos, v.start);
                result[index++] = v.name == null ? '' : '{{' + v.name + '}}';
                pos = v.end;
            }

            if (html.length > pos)
                result[index++] = html.substring(pos);

            return result.join('');
        }
    }


    /*
     *  html 문자열을 파싱한다.
     *
     *  ① 여는 태그를 순회하며 위치정보와 메타정보를 스택에 저장한다.
     *  ② 닫는 태그가 나오면 스택에 저장된 것들을 차례로 꺼내어
     *     파싱 로직을 실행한다.
     *
     *  간단한 접근법이지만, html문서를 파싱하는데 매우 강력한 기법이다.
     *
     */
    export function htmlParser(html: string): [iCompile, { [index: string]: iCompile }] {
        let
            parseIndex = new ParseIndex(),
            result: { [index: string]: iCompile } = {},
            pos = 0,
            tagNames = [], startPos = [], lines = [], index = 0;

        while ((pos = html.indexOf('<', pos)) !== -1) {

            let l = html.indexOf('>', pos) + 1;      // <...>

            // ① 시작 태그
            if (html[pos + 1] !== '/') {
                let t = pos + 1;


                // tagName 읽어들이고, 스택에 쌓기
                while (t < l && html[++t] !== '/' && html[t] !== ' ' && html[t] !== '>') ;
                tagNames[index] = html.substring(pos + 1, t);

                lines[index] = html.substring(pos, l);
                startPos[index] = pos;

                index++;
            }
            // ② 끝 태그
            else {
                let t = pos + 2,
                    tagName;

                // tagName을 이용해 스택 꺼내기
                while (t < l && html[++t] !== ' ' && html[t] !== '>') ;
                tagName = html.substring(pos + 2, t);

                /*
                 *  아래 코드는 한가지 중요한 로직을 행간에 담고 있다.
                 *
                 *  닫는 태그가 없는 엘리먼트가 있다.
                 *  이것들은 스택에 쌓여있다가, 닫는 태그가 출현하면 그 태그명을 가진 스택이 나올때까지
                 *  루프를 돌리는 와중에 스택에서 해소되어진다.
                 */
                while (index-- > 0) {
                    let
                        /*
                         *  own은 현재 출현한 닫는 태그가 현재 순번의 스택과 같은 것인지 알려주는 플래그다.
                         *  아니라면 닫기 태그가 없는 태그이므로, endIndex를 다시 계산한다.
                         */
                        own = tagNames[index] === tagName,
                        startIndex = startPos[index],
                        endIndex = own ? l : html.indexOf('>', startIndex) + 1,
                        line = lines[index],

                        match = r_replace_name.exec(line);

                    //
                    if (match) {
                        let [, save, name] = match;
                        if (save) result[name] = compile(html.substring(startIndex, endIndex).replace(r_eraser, '>'));
                        parseIndex.setVal(startIndex, endIndex, name);
                    }

                    if (own) break;
                }
            }

            // 끝부분 확인
            pos = l;
        }

        // 변수 표현식에서 쉽게 표기하기 위해 배열로 내보낸다.
        /*
         *  let [create, {val1, val2}] = htmlParse()
         */
        return [compile(parseIndex.replace(html)), result];
    }


}