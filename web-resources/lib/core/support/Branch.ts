


export class Branch {

    constructor(public element: HTMLElement) {
        Branch.$tour(element, this);
    }

}

export namespace Branch {

    function _tour(element: HTMLElement, obj, prop: string) {
        if(element.nodeType !== 1) return obj;

        let {children, children: {length}} = element;
        while(length-- > 0) _tour(<HTMLElement>children[length], obj, prop);

        if(element.hasAttribute(prop))
            obj[element.getAttribute(prop)] = element;

        return obj;
    }
    
    export function $tour(element: HTMLElement, obj, prop = 'id') {

        let {children, children: {length}} = element;
        while(length-- > 0) _tour(<HTMLElement>children[length], obj, prop);
        return obj;
    }
}