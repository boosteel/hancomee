import "../../../lib/core/component/toggle";
import {SPA} from "../../../lib/core/spa";
import {Src} from "./_src";
import {Customer} from "../$data";


export default function (init: InitData) {

    return class C extends Src {

        constructor() {
            super('main', init);
        }
        $init(ele: HTMLElement) {
        }
        $load(customer: Customer, element: HTMLElement) {

        }

        close() {

        }
    }

}