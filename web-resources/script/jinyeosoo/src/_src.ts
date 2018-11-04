import {SPA} from "../../../lib/core/spa";
import {HTML} from "../../../lib/core/html";
import {Customer} from "../$data";

type Param = { id: number }

let year = new Date().getFullYear(),
    directive = {
        old(ele, val, c: Customer) {
            let {birth} = c;
            if(birth) {
                ele.textContent = ((year - parseInt(birth.substring(0, 4))) + 1) + '세';
            } else ele.textContent = '?세';
        },
        birth(ele, val,c) {
            if(val) ele.textContent = val.replace(/-/g, '. ');
            else ele.textContent = '';
        }
    };

export abstract class Src implements iSPA.module<Param> {

    private _resolve: Promise<HTMLElement>

    constructor(name: string, private initData: InitData) {

        this._resolve = Promise.all([
            SPA.getFragment("jinyeosoo/src/" + name),
            SPA.getStyle("/dist/jinyeosoo/src/" + name + ".css")
        ]).then(([frag, style]: [DocumentFragment, HTMLStyleElement]) => {
            let element = <HTMLElement>frag.children[0];

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

    load(param: Param, search: string, element: HTMLElement) {
        return Customer.get(param.id).then( customer => {
            this.initData.aside.setText(customer, directive);
            return this.$load(customer, element);
        })
    }

    abstract $init(element: HTMLElement)
    abstract $load(customer: Customer, element: HTMLElement): Promise<any> | void
    abstract close(): Promise<any> | void
}