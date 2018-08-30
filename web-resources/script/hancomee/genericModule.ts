import {SPA} from "../../lib/core/spa";
import {HTML} from "../../lib/core/html";


export abstract class GenericModule<T> implements iSPA.module<T> {
    private _resolve: Promise<HTMLElement>
    protected element: HTMLElement


    constructor(id: string) {
        let div = document.createElement('div');
        div.id = id;
        this.element = div;
        this._resolve = Promise.all([
            SPA.getStyle('/dist/hancomee/src/' + id + '.css'),
            SPA.getElement('hancomee/src/' + id)
        ]).then(([style, frag]) => {
            div.appendChild(style);
            this.$init(div, frag);
            return div;
        });
    }

    init(param): Promise<HTMLElement> {
        return this._resolve;
    }

    abstract $init(container: HTMLElement, frag: DocumentFragment)

    abstract load(param: T): Promise<any> | void

    abstract close(): Promise<any> | void
}