import "../../../lib/core/component/toggle";
import {SPA} from "../../../lib/core/spa";
import {HTML} from "../../../lib/core/html";
import {Customer} from "../$data";
import {$form} from "../$form";

export default function (init: InitData) {

    return class Register implements iSPA.module<{}> {

        private _resolve: Promise<HTMLElement>
        onSubmit = (e, c) => {
            Customer.save(new Customer($form.values())).then(id => {
                location.hash = 'main?id=' + id;
            });
        }

        constructor() {

            this._resolve = Promise.all([
                SPA.getFragment("jinyeosoo/root/register"),
                SPA.getStyle("/dist/jinyeosoo/root/register.css")
            ]).then(([frag, style]: [DocumentFragment, HTMLStyleElement]) => {
                let element = <HTMLElement>frag.children[0];
                element.insertBefore(style, element.firstChild);
                return element;
            });

        }

        getParam() {
            return {};
        }

        init() {
            return this._resolve;
        }

        load(param, search: string, ele: HTMLElement) {
            ele.appendChild($form.onSubmit(this.onSubmit).reset().element);
        }

        close() {
        }
    }
}