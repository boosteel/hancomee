import {SPA} from "../../../lib/core/spa";
import {HTML} from "../../../lib/core/html";
import compile = HTML.compile;
import htmlParser = HTML.htmlParser;


export abstract class GenericModule<T> implements iSPA.module<T> {
    private _resolve: Promise<HTMLElement>
    protected element: HTMLElement
    protected q: T

    /*
     *   이미 로드된 상황 (초기화)이고
     *   쿼리없이 그대로 요청이 들어오면 기존에 작업중이던 화면을 그대로 내보내준다.
     */
    protected isLoad = false;

    constructor(id: string, private param: new () => T) {
        let div = document.createElement('div');

        div.id = id;
        this.element = div;
        this._resolve = Promise.all([
            SPA.getStyle('/dist/hancomee/src/' + id + '.css'),
            SPA.getElement('hancomee/src/' + id)
        ]).then(([style, frag]) => {
            div.appendChild(style);
            let templates = {};

            Array.prototype.forEach.call(frag.querySelectorAll('script[type="text/html"]'),
                (v) => {
                    frag.removeChild(v);
                    v.id && (templates[v.id] = v.innerHTML);
                });

            this.$init(div, frag, templates);
            div.appendChild(frag);
            return div;
        });
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