
export let skipProps = 'name type';

export function closest(target: HTMLElement, className: string) {

}


export function each(ele, handler) {
    let {attributes, attributes: {length}} = ele, name;
    while (length-- > 0) {
        if (skipProps.indexOf(name = attributes[length].name) === -1) {
            handler(name, attributes[length].value);
        }
    }
}

export function eachChilds(nodeList: NodeList, handler) {
    let {length: len} = nodeList, node;
    while (len-- > 0) {
        if (!(node = nodeList[len])['hasAttribute']('disabled'))
            handler(node);
    }
}