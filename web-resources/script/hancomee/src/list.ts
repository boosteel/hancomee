import {SPA} from "../../../lib/core/spa";
import {GenericModule} from "../genericModule";

interface P {
    name: string
}

export class List extends GenericModule<P> {

    constructor() {
        super('list');
    }
    
    $init(container, frag) {
        container.appendChild(frag);
    }

    load(param) {
    }

    close() {

    }
}