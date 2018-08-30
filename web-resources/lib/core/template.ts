import {getFunctionName} from "./core";
import {DOM} from "./dom";
import {Arrays} from "./arrays";
import {HTML} from "./html";

type WatchAll = () => void
type Watch = (newVal, oldVal) => void

export interface Directive<T> {
    [index: string]: (ele: HTMLElement, attrs, obj: T) => WatchAll | { [index: string]: Watch } | void
}


function $snapshot(data, names: string[]) {
    let v;
    return names.reduce(function (result, name) {
        v = data[name];
        if (Array.isArray(v))
            result[name] = v.slice(); // 배열일 경우 스냅샷
        else
            result[name] = v;
        return result;
    }, {});
}

// 두개의 스냅샷 비교해서 수정된 프로퍼티 목록 뽑아내기
function $changeNames(snapshot, newSnapshot) {
    let p, result = [], o, n;
    for (p in newSnapshot) {
        o = snapshot[p];
        n = newSnapshot[p];
        // 둘 중 하나가 Array
        if (Array.isArray(o)) {
            if (!Array.isArray(n))
                result.push(p);
            else if (!Arrays.equals(o, n))
                result.push(p);
        }
        else if (o !== n)
            result.push(p);
    }
    return result;
};

export class Watcher<T> {

    private snapshot = {}

    private watchList: string[] = []
    private watchMap: { [index: string]: Watch[] } = {}
    private applyHandler: WatchAll[] = []

    private isApply = false;

    constructor(public obj: T) {
    }


    addWatch(v: WatchAll | { [index: string]: Watch } | void) {

        if (!v) return this;

        let {watchMap, applyHandler, watchList} = this, p;

        // applyHandler
        if (typeof v === 'function')
            applyHandler.indexOf(v) === -1 && applyHandler.push(v);

        // watchHandler
        else {
            let p;
            for (p in v) {
                watchList.indexOf(p) === -1 && watchList.push(p);
                (watchMap[p] || (watchMap[p] = [])).push(v[p]);
            }
        }

        return this;
    }


    apply()
    apply(props: string[])
    apply(prop: string)
    apply(p?) {

        if (this.isApply) return;

        this.isApply = true;

        let {obj, snapshot, watchMap} = this,
            newSnapshot = this.snapshot = $snapshot(obj, this.watchList);

        // property명이 들어올 경우 강제 apply!
        if (p) {
            if (typeof p === 'string') p = [p];
            p.forEach(name => {
                watchMap[name] && watchMap[name].forEach(f => f(null, null));
            });
        } else {

            // ① apply 핸들러
            this.applyHandler.forEach(h => h());

            // ② propery 핸들러
            $changeNames(snapshot, newSnapshot).forEach(name => {
                watchMap[name] && watchMap[name].forEach(f => f(newSnapshot[name], snapshot[name]));
            });
        }

        this.isApply = false;
    }
}

export interface Template {
    $template: HTMLElement

    apply(): this
}

export interface TemplateFactory<T extends Template> {
    new(...args: any[]): T
}

export function Template<T extends Template>()
export function Template<T extends Template>(name: string)
export function Template<T extends Template>(directives: Directive<T>)
export function Template<T extends Template>(name: string, directives: Directive<T>)
export function Template<T extends Template>(name?, directives?) {

    return (cons: TemplateFactory<T>) => {
        Template.build(cons, name, directives);
    }
}


export namespace Template {

    import unCamelCase = HTML.unCamelCase;
    let PRIVATE_KEY = "_____object_____";

    export let default_directive = {};


    //*********************** ▼ INNER CLASS ▼ ***********************//
    class TemplateObject {
        isInit = false;

        constructor(public element: HTMLElement, public watcher: Watcher<any>) {
        }

        apply() {
            this.isInit = true;
            this.watcher.apply();
        }
    }

    namespace TemplateObject {

        export function get(obj, selector: string, directive): TemplateObject {
            let r = obj[PRIVATE_KEY];

            /*
             *  여기서 처음으로 컴파일된다.
             */
            if (!r) {
                let watcher = new Watcher(obj),
                    element: HTMLElement;

                // HTML 템플릿 가지고 오기
                if (selector[0] === '=') selector = document.querySelector(selector.slice(1)).innerHTML.trim();
                if (selector[0] === '<') element = DOM.createHTML(selector);
                else element = <HTMLElement>document.querySelector(selector);

                r = obj[PRIVATE_KEY] = new TemplateObject(element, watcher);
                each(element, directive, watcher);
            }
            return r;
        }
    }
    //*********************** ▲ INNER CLASS ▲ ***********************//

    // 디렉티브 확장하기
    export function expendDirective<T extends Template>(cons: TemplateFactory<T>, directives: Directive<T>) {
        let consObj = cons[PRIVATE_KEY], dir = consObj ? consObj.directive : null, p;
        if (dir) {
            for (p in directives)
                dir[p] = directives[p];
        }
        return Template;
    }

    export function build<T extends Template>(cons: TemplateFactory<T>, selector: string): new() => T
    export function build<T extends Template>(cons: TemplateFactory<T>, directives: Directive<T>): new() => T
    export function build<T extends Template>(cons: TemplateFactory<T>, selector: string, directives: Directive<T>): new() => T
    export function build(cons, selector, directives?) {

        let consObj = cons[PRIVATE_KEY];
        if (consObj && consObj.cons === cons) return cons;

        /*
         *    ("name", {})
         *    ("name")
         *    ({})
         */
        // arguments
        if (typeof selector !== 'string') {
            if (selector) directives = selector;
            selector = getFunctionName(cons);
            selector = '=#' + selector[0].toLowerCase() + selector.slice(1) + '-template';
        }

        // 디렉티브 상속
        let
            {prototype, prototype: {apply}} = cons,
            dir = (consObj && consObj.directive) || default_directive,
            p, result = Object.create(dir);

        if (directives) for (p in directives) result[p] = directives[p];

        /*
         *
         */
        Object.defineProperty(prototype, '$template', {
            get: function () {
                let temple = TemplateObject.get(this, selector, result);
                temple.isInit || temple.apply();
                return temple.element;
            },
            set: function (v) {
            },
            configurable: false,
            enumerable: false
        });


        /*
         *
         */
        prototype.apply = function () {
            apply.apply(this);
            TemplateObject.get(this, selector, result).apply();
            return this;
        };

        cons[PRIVATE_KEY] = {directive: result, cons: cons};

    }


    function simpleEach(element: HTMLElement, handler: (ele: HTMLElement, attrs, data) => boolean | void, data) {
        if (element.nodeType !== 1) return;

        let
            attrs = DOM.attrMap(element),
            {children, attributes} = element,
            len = attributes.length;

        while (len-- > 0) {
            if (handler(element, attrs, data) === false) return;
        }

        len = children.length;

        while (len-- > 0) simpleEach(<HTMLElement>children[len], handler, data);
    }

    function directiveEach(element: HTMLElement, directive, watchMode: boolean, data?) {
        if (element.nodeType !== 1 || element.hasAttribute('data-template-compile')) return;

        let
            attrs = DOM.attrMap(element),
            func = directive[unCamelCase(element.tagName.toLowerCase())];

        // tag명이 일치하면 순회중지
        if (func) {
            if (watchMode) data.addWatch(func(element, attrs, data.obj));
            else func(element, null, data);
        }

        // 디렉티브 중 표기하면 건너띈다.
        if(element.hasAttribute('data-template-compile')) return;

        let
            {children, children: {length: len}} = element, p;

        for (p in attrs) {
            if (func = directive[p]) {
                if (watchMode) data.addWatch(func(element, attrs, data.obj));
                else func(element, attrs, data);
            }
        }

        while (len-- > 0)
            directiveEach(<HTMLElement>children[len], directive, watchMode, data);

        if (watchMode) return data;
    }


    /*
     *   element를 순회하면서 directive를 실행한다.
     */
    export function each<T>(element: HTMLElement, directive: (ele: HTMLElement, attrs, data?: T) => boolean | void, data?: T): HTMLElement
    export function each<T extends Template>(element: HTMLElement, directive: Directive<T>, watcher: Watcher<T>): Watcher<T>
    export function each<T>(element: HTMLElement, directive: Directive<T>, data?): void
    export function each(element: HTMLElement, directive, data?) {

        if (typeof directive === 'function') {
            simpleEach(element, directive, data);
            return element;
        }

        let watchMode = data instanceof Watcher,
            attrs = DOM.attrMap(element);

        // ① 디렉티브 순회 전
        if (typeof directive['$'] === 'function') {
            if (watchMode) data.addWatch(directive['$'](element, attrs, data.obj));
            else directive['$'](element, attrs, data);
        }


        // ② 디렉티브 순회
        let rv = directiveEach(element, directive, watchMode, data);

        // 컴파일 사실을 체크한다.
        element.setAttribute('data-template-compile', 'true');


        // ③ 디렉티브 순회 후
        if (typeof directive['$$'] === 'function') {
            if (watchMode) data.addWatch(directive['$$'](element, attrs, data.obj));
            else directive['$$'](element, attrs, data);
        }

        return rv;

    }

    export let snapshot = $snapshot;
    export let changeNames = $changeNames;
}

