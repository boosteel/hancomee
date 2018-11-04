import {SPA} from "../../../lib/core/spa";

type Param = { id: number }

export abstract class Src implements iSPA.module<Param> {

    private _resolve: Promise<HTMLElement>

    constructor(name: string) {

        this._resolve = Promise.all([
            SPA.getFragment("boosteel/src/" + name),
            SPA.getStyle("/dist/boosteel/src/" + name + ".css")
        ]).then(([frag, style]: [DocumentFragment, HTMLStyleElement]) => {
            let element = <HTMLElement>frag.childNodes[0];

            this.$init(element);

            element.insertBefore(style, element.firstChild);
            return element;
        });

    }

    getParam() {
        return <any>{};
    }

    init() {
        return this._resolve;
    }

    abstract $init(element: HTMLElement)
    abstract load(param, search: string, element: HTMLElement): Promise<any> | void
    abstract close(): Promise<any> | void
}