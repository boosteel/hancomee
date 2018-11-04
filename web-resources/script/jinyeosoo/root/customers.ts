import "../../../lib/core/component/toggle";
import {SPA} from "../../../lib/core/spa";
import {HTML} from "../../../lib/core/html";
import {Customer} from "../$data";
import {$form} from "../$form";
import selectAll = HTML.selectAll;
import compile = HTML.compile;
import {Events} from "../../../lib/core/events";
import propertyMap = Events.propertyMap;

export default function (init: InitData) {

    return class Register implements iSPA.module<{}> {

        private _resolve: Promise<HTMLElement>
        private render

        constructor() {

            this._resolve = Promise.all([
                SPA.getFragment("jinyeosoo/root/customers"),
                SPA.getStyle("/dist/jinyeosoo/root/customers.css")
            ]).then(([frag, style]: [DocumentFragment, HTMLStyleElement]) => {
                let element = <HTMLElement>frag.children[0];
                element.insertBefore(style, element.firstChild);

                this.render = selectAll(element,
                    ['tbody', '!tbody tr'],
                    (e, tbody: HTMLTableSectionElement, tr: HTMLTableRowElement) => {

                        let outerHTML = compile(tr.outerHTML);

                        propertyMap(tbody, 'click', {
                            move({id}: { id: number }) {
                                location.hash = 'main?id=' + id;
                            }
                        });

                        return (customers: Customer[]) => {
                            tbody.textContent = '';
                            tbody.innerHTML = customers.map(c => outerHTML(c)).join('');
                        }
                    });


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
            return Customer.list().then( c => this.render(c));
        }

        close() {
        }
    }
}