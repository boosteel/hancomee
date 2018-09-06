import {SPA} from "../../../lib/core/spa";
import {GenericModule} from "./genericModule";

class Search {
    name: string
}

export class List extends GenericModule<Search> {

    constructor() {
        super('list', Search);
    }
    
    $init(container, frag) {
        container.appendChild(frag);
    }

    $load(param) {
    }

    close() {

    }
}