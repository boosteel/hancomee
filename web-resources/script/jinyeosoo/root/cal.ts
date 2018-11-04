import "../../../lib/core/component/toggle";
import {SPA} from "../../../lib/core/spa";

export default function(init: InitData) {

    return class Cal implements iSPA.module<{}> {

        private _resolve: Promise<HTMLElement>

        constructor() {

            this._resolve = Promise.all([
                SPA.getFragment("jinyeosoo/root/calendar"),
                SPA.getStyle("/dist/jinyeosoo/root/cal.css")
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

        load(param, search: string) {
        }

        close() {
        }
    }
}


