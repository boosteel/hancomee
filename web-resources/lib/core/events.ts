/**
 * Created by hellofunc on 2017-02-28.
 */


import {NameMap} from "./collections/NameMap";
import {Arrays} from "./arrays";
import {__makeArray} from "./core";

type ISwitch = ko.types.event.Switch;


export class Events {

    isActive = false

    constructor(public target: EventTarget, public type: string, public handler) {
        this.on();
    }

    setTarget(t: EventTarget) {
        let {target, isActive} = this;
        if (t === target) return this;
        if (isActive) this.off();
        this.target = t;
        if (isActive) this.on();
        return this;
    }

    on() {
        if (!this.isActive) {
            this.target.addEventListener(this.type, this.handler);
            this.isActive = true;
        }
        return this;
    }

    off() {
        if (this.isActive) {
            this.target.removeEventListener(this.type, this.handler);
            this.isActive = false;
        }
        return this;
    }
}


export class EventsGroup {
    isActive = false;
    private map = new NameMap<Events>();

    register(event: Events)
    register(element: EventTarget, type: string, handler)
    register(element, type?, handler?): EventsGroup {
        if (typeof type === 'string')
            this.map.add(type, new Events(element, type.split(/\./)[0], handler));
        else this.map.add(element.type, element);
        return this;
    }

    on(): EventsGroup
    on(name: string): EventsGroup
    on(n?) {
        if (!this.isActive) {
            this.map.get(n).forEach(v => v.on());
            this.isActive = true;
        }
        return this;
    }

    off(): EventsGroup
    off(name: string): EventsGroup
    off(n?) {
        if (this.isActive) {
            this.map.get(n).forEach(v => v.off());
            this.isActive = false;
        }
        return this;
    }
}


export class TargetEvent {

    isActive = false;

    private events = []
    private target: EventTarget

    register(type: string, handler): TargetEvent {
        this.events.push({type: type, handler: handler});
        return this;
    }

    on(own: EventTarget) {
        let {target} = this;

        if (target) {
            if (target === own) return this;
            this.off();
        }

        this.events.forEach(v => own.addEventListener(v.type, v.handler));
        this.target = own;
        this.isActive = true;
        return this;
    }

    off() {
        let {target} = this;
        if (target) {
            this.events.forEach(v => target.removeEventListener(v.type, v.handler));
            this.isActive = false;
            this.target = null;
        }
        return this;
    }
}

export namespace Events {


    function closest(target: HTMLElement, selector: string, ele): HTMLElement {
        let list = target.querySelectorAll(selector), l = list.length;
        while (l-- > 0) if (list[l]['contains'](ele)) return <any>list[l];
        return null;
    }

    export function mine(target: HTMLElement, type: string, handler: (e) => any) {
        return new Events(target, type, function (e) {
            if (e.target === target) return handler.call(this, e);
        });
    }

    export function bind(target: HTMLElement, type: string, handler: (e) => any): Events
    export function bind(target: HTMLElement, type: string, selector: string, handler: (e, target: HTMLElement) => any): Events
    export function bind(target: HTMLElement, type: string, selector, handler?) {
        if (handler)
            return new Events(target, type, function (e) {
                let t = closest(target, selector, e.target);
                if (t) return handler.call(target, e, t);
            });
        else return new Events(target, type, selector);
    }

    export function map(target: HTMLElement, map: { [index: string]: any }) {
        let group = new EventsGroup(),
            p;
        for (p in map)
            typeof map[p] === 'function' && group.register(target, p, map[p].bind(map));
        return group;
    }

    /*
     *  키 입력에 따라 핸들러 호출
     */
    export let keyDown = (function () {

        class KeyEvents extends Events {
            constructor(element: EventTarget, public keys: number[], handler) {
                super(element, 'keyevent', handler);
                this.on();
            }

            on() {
                if (keyListener.indexOf(this) === -1) {
                    keyListener.push(this);
                    KEY_LISTEN.on();
                    this.isActive = true;
                }
                return this;
            }

            off() {
                let i = keyListener.indexOf(this);
                if (i !== -1) {
                    keyListener.splice(i, 1);
                    keyListener.length || KEY_LISTEN.off();
                    this.isActive = false;
                }
                return this;
            }
        }

        let keyListener: KeyEvents[] = [],

            /*
             *  ① document가 키 입력을 다 받는다.
             *  ② 등록된 element위에 마우스가 위치할때, 해당 키 입력에 따라 handler를 호출한다.
             */
            KEY_LISTEN = (function () {
                let keys = [];

                // 키 이벤트를 받는 그룹
                return new EventsGroup()
                    .register(document, 'keydown', (e: KeyboardEvent) => {
                        let {keyCode} = e,
                            hovers = <EventTarget[]>__makeArray(document.querySelectorAll(':hover'));

                        if (keys.indexOf(keyCode) === -1) keys.push(keyCode)

                        keyListener.forEach(v => {
                            if (hovers.indexOf(v.target) !== -1 && Arrays.equals(v.keys, keys))
                                v.handler()
                        });
                    })
                    .register(document, 'keyup', (e: KeyboardEvent) => {
                        let i = keys.indexOf(e.keyCode);
                        if (i !== -1) keys.splice(i, 1);
                    }).off();
            })();


        // on/off 컨트롤러를 반환한다.
        return function keyDown(element: EventTarget, keys: number[], handler) {
            return new KeyEvents(element, keys, handler);
        }
    })();


    // 해당 횟수만큼 이벤트를 리스닝한다.
    export function count(element: EventTarget, type: string, handler, count = 1) {
        if (count < 1) return;

        let dispatcher = function (...args) {
            count--;
            let rv = handler.apply(element, args);
            count < 1 && element.removeEventListener(type, dispatcher);
            return rv;
        }

        element.addEventListener(type, dispatcher);
    }

    export function listener(element: EventTarget, type: string, handler) {
        return new Events(element, type, handler);
    }


    export function listenGroup() {
        return new EventsGroup();
    }

    export function trigger(target: EventTarget, type: string, bubbles = true, cancelable = true) {
        if (typeof target[type] === 'function') target[type]();
        else {
            let e = document.createEvent('Events');
            e.initEvent(type, bubbles, cancelable);
            // 이미 진행중인 이벤트가 있다면 버블링 후에 동작하도록
            setTimeout(() => target.dispatchEvent(e), 0);
        }
    }

    export function custom(target: EventTarget, type: string, detail, bubbles = true, cancelable = true) {
        let e: CustomEvent = document.createEvent('CustomEvent');
        e.initCustomEvent(type, bubbles, cancelable, detail);
        setTimeout(() => target.dispatchEvent(e), 0);
    }


    type WORK_HANDLERS = (val: string, target: HTMLElement, e: Event) => any
    type WORK_HANDLER = (key: string, val: string, target: HTMLElement, e: Event) => any

    export function eventWorks(element: EventTarget,
                               type: string,
                               handlers: ({ [index: string]: WORK_HANDLERS }) | WORK_HANDLER,
                               attrName = 'data-handler') {

        let target: HTMLElement,
            vName = attrName + '-value',
            isFun = typeof handlers === 'function' ? handlers : null;

        return new Events(element, type, (e) => {
            target = <HTMLElement>e.target;
            while (target && target !== element) {
                if (target.hasAttribute(attrName)) {
                    let prop = target.getAttribute(attrName),
                        val = target.getAttribute(vName);
                    if (isFun) return isFun(prop, val, target, e);
                    else if (handlers[prop]) handlers[prop](target.getAttribute(vName), target, e);
                    return;
                }
                target = target.parentElement;
            }
        });

    }

}



