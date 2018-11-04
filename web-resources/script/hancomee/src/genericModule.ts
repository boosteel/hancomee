import {SPA} from "../../../lib/core/spa";
import {HTML} from "../../../lib/core/html";
import compile = HTML.compile;
import htmlParser = HTML.htmlParser;
import {DOM} from "../../../lib/core/dom";
import className = DOM.className;
import {Events} from "../../../lib/core/events";
import propertyMap = Events.propertyMap;
import {_reduce} from "../../../lib/core/_func/array";


export abstract class GenericModule<T> implements iSPA.module<T> {
    private _resolve: Promise<HTMLElement>
    protected element: HTMLElement
    protected q: T

    private popCount = 0;
    private loadingElement: HTMLElement
    private popElement: HTMLElement
    private pop2Element: HTMLElement

    /*
     *   이미 로드된 상황 (초기화)이고
     *   쿼리없이 그대로 요청이 들어오면 기존에 작업중이던 화면을 그대로 내보내준다.
     */
    protected isLoad = false;

    constructor(id: string, private param: new () => T) {
        let div = document.createElement('div');

        div.id = id;
        this.element = div;

        /*
         *  모든 모듈이 공통적으로 가지는 
         *  ① 로딩 엘리먼트
         *  ② 팝업 엘리먼트
         */
        div.innerHTML = '<div class="loading"></div><div id="pop1" class="popup"></div><div id="pop2" class="popup"></div>';

        this.loadingElement = div.querySelector('.loading');
        this.popElement = div.querySelector('#pop1');
        this.pop2Element = div.querySelector('#pop2');

        this._resolve = Promise.all([

            // style과 html 로딩딩
            SPA.getStyle('/dist/hancomee/src/' + id + '.css'),
            SPA.getFragment('hancomee/src/' + id)

        ]).then(([style, frag]) => {

            div.appendChild(style);

            // <script>로 작성된 template html
            /*
             *  존나 알 수 없는 일.
             *  병신같은 ie에서는 innerText와 (textConent, innerHTML) 값이 다르다..ㄷㄷ
             */
            let templates = _reduce(frag.querySelectorAll('script[type="text/html"]'), (r, v) => {
                frag.removeChild(v);
                v.id && (r[v.id] = v['innerText']);
                return r;
            }, {});

            // 하위 모듈 로직
            this.$init(div, frag, templates);

            div.appendChild(frag);
            return div;
        });
    }

    // 로딩바
    protected loading(flag: boolean) {
        className(this.loadingElement, 'on', flag);
        return this.bodyScreen(flag);
    }

    // 팝업창
    protected pop(element?: HTMLElement | DocumentFragment) {
        let {popElement} = this,
            isOpen = !!element;

        popElement.textContent = '';
        isOpen && popElement.appendChild(element);
        className(popElement, 'on', isOpen);
        return this.bodyScreen(isOpen);
    }

    // 팝업창
    protected pop2(element?: HTMLElement | DocumentFragment) {
        let {pop2Element} = this,
            isOpen = !!element;

        pop2Element.textContent = '';
        isOpen && pop2Element.appendChild(element);
        className(pop2Element, 'on', isOpen);
        return this.bodyScreen(isOpen);
    }

    private bodyScreen(isOpen: boolean) {
        this.popCount += isOpen ? 1 : -1;
        className(document.body, 'screen', this.popCount > 0);
        return this;
    }

    init(): Promise<HTMLElement> {
        return this._resolve;
    }

    load(param: T, search: string) {
        // 이미 로드된 상태에서 쿼리없이 주소요청만 들어오면 기존 작업상태를 그대로 보낸다.
        if (!this.isLoad || search) {
            this.isLoad = true;
            this.q = param;
            return this.$load(param);
        }
    }

    getParam() {
        return new this.param();
    }

    /*
     *  PostContructo()로 보면 된다.
     *
     *  ① container는 새로 만들어진 엘리먼트이고,
     *
     *  ② frag는 html에 포함된 엘리먼트들이다.
     *     - container에 포함되기 전에 $init() 메서드를 통해 조작할 수 있다.
     *
     *  ③ templates는 <script id="{key}"> 템플릿이 문자열로 들어간 map이다.
     */
    abstract $init(container: HTMLElement, frag: DocumentFragment, templates: { [index: string]: string })

    abstract $load(param: T): Promise<any> | void

    abstract close(): Promise<any> | void
}