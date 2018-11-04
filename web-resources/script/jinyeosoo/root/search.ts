import "../../../lib/core/component/toggle";
import {SPA} from "../../../lib/core/spa";
import {HTML} from "../../../lib/core/html";
import {Customer} from "../$data";
import {Events} from "../../../lib/core/events";
import selectAll = HTML.selectAll;
import propertyMap = Events.propertyMap;

export default function (init: InitData) {

    return class Search implements iSPA.module<{}> {

        private _resolve: Promise<HTMLElement>
        private $init: (ele: HTMLElement) => HTMLElement;

        constructor() {

            this._resolve = Promise.all([
                SPA.getFragment("jinyeosoo/root/search"),
                SPA.getStyle("/dist/jinyeosoo/root/search.css")
            ]).then(([frag, style]: [DocumentFragment, HTMLStyleElement]) => {
                let element = <HTMLElement>frag.children[0];
                element.insertBefore(style, element.firstChild);

                selectAll(element,
                    ['input', 'tbody'],
                    (e: HTMLElement, input: HTMLInputElement, tbody: HTMLTableSectionElement) => {

                        let r = /[가-힣a-zA-Z\d]+/,
                            temp;

                        // keyup으로 조회
                        input.addEventListener('keyup', () => {
                            let {value} = input;
                            console.log(value, temp);
                            if (r.test(value) && temp !== value) {

                                Customer.search(value).then(value => {
                                    tbody.textContent = '';
                                    tbody.innerHTML = value.map((v, i) => {
                                        return '<tr data-event="move" data-value="id:' + v.id + '">' +
                                            '<td>' + (i + 1) + '</td>' +
                                            '<td>' + v.name + '</td>' +
                                            '<td>' + v.birth + '</td>' +
                                            '<td>' + v.mobile + '</td>'
                                        '</tr>'
                                    }).join('');
                                });
                                temp = value;
                            }
                        });

                        propertyMap(tbody, 'click', {
                            move({id}: { id: number }) {
                                location.hash = '#main?id=' + id;
                            }
                        });


                        this.$init = ele => {
                            input.value = tbody.textContent = temp = '';
                            return ele;
                        }

                    });


                return element;
            });

        }

        getParam() {
            return {};
        }

        init() {
            return this._resolve.then(this.$init);
        }

        load(param, search: string) {
        }

        close() {
        }
    }
}