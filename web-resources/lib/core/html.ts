import {StringBuffer} from "./support/StringBuffer";
import "../../lib/core/component/toggle";
import {Formats} from "./format";
import {_date, _dateFormat, _datetime} from "./_func/datetime";
import {Access} from "./access";
import read = Access.read;
import {_forEach} from "./_func/array";
import {_newApply} from "./_func/newApply";
import number = Formats.number;
import fileSize = Formats.fileSize;
import primitive = Access.primitive;
import {r_number} from "./_regexp/number";

let dummy = {},
    r = /{{(.*?)}}/g,
    r_compile_var = /{{[^{}]+}}/,
    r_filter_split = / \| | : /,
    r_script = /script/i,
    r_template = /template/i,
    defaultFilter = {
        number: number,
        date: _dateFormat,
        filesize: fileSize
    };

function $setText(ele: HTMLElement, val) {

    if(val !== void 0) {
        let c = ele.getAttribute('data-type'),
            i, fn, p = c, arg;

        if (c) {
            if ((i = c.indexOf(':')) !== -1) {
                p = c.substring(0, i);
                arg = primitive(c.substring(i + 1, c.length));
            }
            if (fn = defaultFilter[p]) {
                ele.textContent = fn(val, arg);
                return ele;
            }
        }

        ele.textContent = val == null ? '' : val;
    }

    return ele;
}

export class EleMap {

    keys: string[]
    length: number

    constructor(context: HTMLElement, attrName: string) {
        let
            els = context.querySelectorAll('[' + attrName + ']'),
            keys = this.keys = [];

        _forEach(els, (e, i) => {
            keys[i] = e.getAttribute(attrName);
            this[i] = e;
        });
        this.length = keys.length;
    }

    setText(obj = dummy, directive = dummy) {
        let {length: l, keys} = this, i = 0, key;
        for (; i < l; i++) {
            if (directive[key = keys[i]]) directive[key](this[i], obj[key], obj);
            else $setText(this[i], read(key, obj));
        }

        return this;
    }


    each(h, obj?, map = dummy) {

        let {length: l, keys} = this, i = 0, k;

        for (; i < l; i++) {
            k = keys[i];
            if (map[k]) map[k](this[i], obj);
            else h(this[i], keys[i], obj);
        }

        return this;
    }
}

export namespace EleMap {
    export function textHandler(e: HTMLElement, name: string, obj) {
        HTML.setText(e, read(name, obj));
    }
}

export namespace HTML {

    export let unCamelCase = (function (r_data, r_up, fn) {
        return (s: string) => s.replace(r_data, '').replace(r_up, fn);
    })(/^data-/, /-([^-])/g, (_, i) => i.toUpperCase());


    /*
     *  =로 시작하는 문자열의 경우 특정 엘리먼트의 innerHTML 문자열로 치환된다.
     */
    function pipe(str: string) {
        if (str[0] === '=') {
            if (str[1] === '#') str = document.getElementById(str.substring(2)).innerText
            else str = document.querySelector(str.substring(1))['innerText']
        }
        return str;
    }

    // 정방향
    function cEach(children: ArrayLike<Node>, n: number) {
        let l = children.length, i= 0, pos = 1;
        for(;i<l;i++) {
            if(children[i].nodeType === 1) {
                if(pos++ === n) return children[i];
            }
        }
        return null;
    }
    // 역방향
    function cEachReverse(children: ArrayLike<Node>, n: number) {
        let l = children.length, pos = 1;
        while(l-- > 0) {
            if(children[l].nodeType === 1) {
                if(pos++ === n) return children[l];
            }
        }
        return null;
    }
    // nth-child(?) 찾기
    /*
     *  젓같은 ie에서는 fragment에 children이 없다. 따라서 childNodes로 한다..
     */
    export function nthChildren(context: Element, nth: number) {
        if(nth < 0) return cEachReverse(context.childNodes, nth * -1);
        else return cEach(context.childNodes, nth === 0 ? 1 : nth);
    }

    export function select(context, selector: string) {
        let sChar = selector[0],
            l = selector.length - 1;

        if(sChar === '!') {
            let r = context.querySelector(selector.substring(1));
            r.parentNode.removeChild(r);
            return r;
        }
        else if (sChar === '=') {
            return createFragment(selector.substring(1));
        }
        // ① 'select[]'  ==> querySelectorAll()
        else if (selector[l] === ']' && selector[l - 1] === '[') {
            return context.querySelectorAll(selector.substring(0, l - 1))
        }
        // 특수문자
        else if (sChar === ':') {
            /*
             *  퍽킹 ie에서는 fragment에서 firsElementChild를 지원하지 않는다.
             */
            let s = selector.slice(1);

            if(r_number.test(s))
                return nthChildren(context, parseInt(s));

            switch (s) {
                case 'first-child':
                    return nthChildren(context, 1);
                case 'last-child':
                    return nthChildren(context, -1);
                case 'childs':
                    return context.children;
                case 'self':
                    return context;
            }
        }
        // ② 'select{attrName}' ==>  {attrName: ele, attrName: ele}
        else if (sChar === '{' && selector[l] === '}') {
            return new EleMap(context, selector.substring(1, l));
        }
        // ③ querySelector()
        else {
             return context.querySelector(selector);
        }
    }
    
    export function _Q(ele, selector: string) {
        return ele.querySelector(selector);
    }

    export function selectAll<T>(ele, arg: any[]): T
    export function selectAll(ele, arg: any[]): any[]
    export function selectAll<T>(ele, arg: any[], handler: (...args: any[]) => T): T
    export function selectAll(ele, arg, handler?) {
        let
            element = typeof ele === 'string' ?
                (ele.indexOf('<') === -1 ? document.querySelector(ele) : createFragment(ele)) :
                ele,
            args = [element], index = 1, i = 0, l = arg.length, str;

        for (; i < l; i++) {
            str = arg[i];

            // (1) 문자열일 경우
            if (typeof str === 'string') {
                args[index++] = select(element, str);
            }
            // (2) 함수일 경우, ele와 바로 앞의 arg를 넣어준다.
            else if(typeof str === 'function')
                args[index++] = str(ele, args[index]);
            // (2) 문자열이 아닐 경우 그대로 결과값
            else {
                args[index++] = str;
            }
        }
        return handler ? handler.apply(element, args) : args;
    };


    export function byId(s: string): HTMLElement {
        return document.getElementById(s);
    }

    export function replaceHTML(str: string, obj) {
        return str.replace(r, (_, p) => {
            return obj[p] == null ? '' : obj[p];
        })
    }

    export function compile(str: string, filter = defaultFilter) {

        str = pipe(str);

        if (!r_compile_var.test(str)) return () => str;

        let i = 0, l = str.length,
            s = 0, e = 0,
            array = [], size = 0;

        while (i !== l) {
            if ((s = str.indexOf('{{', i)) !== -1) {

                let $v = str.substring(i, s);

                // 일반 문자열
                array[size++] = () => $v;

                e = str.indexOf('}}', s += 2);

                // {{exp}}
                let ss = str.substring(s, e);

                // 직접 컨텍스트 사용이 없을 경우 ::ex) _.name()
                if (ss.indexOf('_.') === -1) {
                    let [str, filter, arg] = ss.split(r_filter_split);
                    ss = str ? '_.' + str : '_';

                    if (arg) {
                        ss = '$.' + filter + '(' + ss + ', ' + arg + ')';
                    }
                    else if (filter) {
                        ss = '$.' + filter + '(' + ss + ')';
                    }
                }

                array[size++] = new Function('_', '$', 'return _ == null ? "" : (' + ss + ');');

                i = e + 2;
            } else {
                let $v = str.substring(i, l);
                array[size++] = () => $v;
                i = l;
            }
        }

        return function (obj, filter2?) {
            let i = 0, result = [];
            while (i < size) {
                result[i] = array[i++](obj, filter2 || filter);
            }
            return result.join('');
        }
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

    export function createFragment(ele: Element): DocumentFragment
    export function createFragment(children: HTMLCollection): DocumentFragment
    export function createFragment(html: string): DocumentFragment
    export function createFragment(html): DocumentFragment {
        let frag = document.createDocumentFragment();

        if (typeof html === 'string') {
            html = pipe(html);
            create(html, (v) => frag.appendChild(v));
        }
        else if (typeof html.nodeType === 'number') {
            frag.appendChild(html);
        }
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
    let r_replace_name = /:(:)?([^>\s"']+)>$/,
        r_eraser = /\s+::?[^>\s]+>/g;

    /*
     *  템플릿 가운데 치환자로 변환할 위치를 설정하는 클래스
     *  하위 엘리먼트부터 상위로 올라가므로 시작 index는 점점 작은 숫자가 들어온다고 보면 된다.
     */
    class ParseIndex {

        private values: { start: number, end: number, name: string }[] = []
        result = {}

        constructor(private html: string, private compileFilter?) {
        }

        // 저장되지 않는 단순 마커(:value)를 위한 추가메서드
        private remove(s: number, e: number) {
            let {values, values: {length: l}} = this, i = 0,
                newValues = [], ni = 0;

            for (; i < l; i++) {
                // 매치된건 없앤다.
                if (values[i].start > s && values[i].end < e) void 0
                else newValues[ni++] = values[i];
            }
            this.values = newValues;
        }

        // 저장되는 마커(::value)를 위한 메서드
        private loop(s: number, e: number) {
            let {html, values, values: {length: l}} = this,
                buf = new StringBuffer(),
                pos = s, i = 0,
                newValues = [], ni = 0;

            for (; i < l; i++) {

                // 매치된건 없앤다.
                if (values[i].start > s && values[i].end < e) {
                    buf.append(html.substring(pos, values[i].start))
                        .append('{{').append(values[i].name).append('}}');
                    pos = values[i].end;
                }
                else {
                    newValues[ni++] = values[i];
                }
            }

            if (pos < e) buf.append(html.substring(pos, e));

            this.values = newValues;

            return buf.toString().replace(r_eraser, '>');
        }

        // new
        setV(s: number, e: number, name: string, save: boolean) {
            if (save) this.result[name] = compile(this.loop(s, e), this.compileFilter);
            else this.remove(s, e);
            this.values.push({start: s, end: e, name: name});
            return this;
        }

        // new
        getResult() {
            return [compile(this.loop(0, this.html.length), this.compileFilter), this.result];
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


    type BindHandler<T> = (com: iCompile, map: iCompileMap) => T

    export function htmlParser<T>(html: string, handler: BindHandler<T>, compileFilter?): T
    export function htmlParser(html: string, compileFilter?): [iCompile, iCompileMap]
    export function htmlParser(html: string, handler?, compileFilter?) {
        let
            parseIndex = new ParseIndex(html, typeof handler === 'function' ? compileFilter : handler),
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
                        parseIndex.setV(startIndex, endIndex, name, !!save);
                    }

                    if (own) break;
                }
            }

            // 끝부분 확인
            pos = l;
        }

        // 변수 표현식에서 쉽게 표기하기 위해 배열로 내보낸다.
        /*
         *  let [newInstance, {val1, val2}] = htmlParse()
         */
        let [$c, result] = parseIndex.getResult();
        parseIndex = null;
        return typeof handler === 'function' ? handler($c, result) : [$c, result];
    }


    /*
     *  복제 생산해야 하는 템플릿을 편리하게 이용하게 해주는 로직
     *  select() 함수의 context만 미리 만들어둔다고 생각하면 된다.
     */
    interface Factory<T> {
        $select: string[]

        new(...args: any[]): T
    }

    type SD = string | DocumentFragment

    // 팩토리 함수에서 생성자 arguments를 미리 정의할 수 있도록
    export function createTemplate<T, A, B, C, D, E>(html: SD, clazz: Factory<T>): (a: A, b: B, c: C, d: D, e: E) => T
    export function createTemplate<T, A, B, C, D>(html: SD, clazz: Factory<T>): (a: A, b: B, c: C, d: D) => T
    export function createTemplate<T, A, B, C>(html: SD, clazz: Factory<T>): (a: A, b: B, c: C) => T
    export function createTemplate<T, A, B>(html: SD, clazz: Factory<T>): (a: A, b: B) => T
    export function createTemplate<T, A>(html: SD, clazz: Factory<T>): (a: A) => T
    export function createTemplate<T>(html: SD, clazz: Factory<T>): () => T
    export function createTemplate(html, clazz) {
        let frag = typeof html === 'string' ? createFragment(html) : html;
        return function (...args: any[]) {
            let {$select} = clazz, l = $select.length, i = 0,
                clone = frag.cloneNode(true), pos = args.length;

            for (; i < l; i++) {
                args[pos++] = select(clone, $select[i]);
            }
            return _newApply(clazz, args);
        }
    }


    export function createElement(str: string): HTMLElement {
        let div = document.createElement('div'),
            child;
        div.innerHTML = str;
        child = div.firstElementChild;
        return div.removeChild(child);
    }

    export function pick(ele: HTMLElement | DocumentFragment, selector: string): HTMLElement {
        let e = ele.querySelector(selector),
            p = e.parentElement;
        p && p.removeChild(e);
        return <any>e;
    }


    export function reduceFragment<T>(values: ArrayLike<T>, handler: (t: T, index: number) => Element): DocumentFragment {
        let frag = document.createDocumentFragment(),
            i = 0, l = values.length, v;

        while (i < l) {
            if (v = handler(values[i], i++))
                frag.appendChild(v);
        }

        return frag;
    }

    export function innerHTML(ele: HTMLElement, html: string) {
        let clone = <HTMLElement>ele.cloneNode(false);
        clone.innerHTML = html;
        ele.parentNode.replaceChild(clone, ele);
        return clone;
    }

    export let setText = $setText;

}