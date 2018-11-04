import {Src} from "./_src";


export default function() {


    class C extends Src {

        constructor() {
            super('intro')
        }

        $init(element: HTMLElement) {

        }
        load(param, search: string, element: HTMLElement) {

        }
        close() {

        }

    }

    return C;

}