

export function _remap(obj) {

    let p, v;
    for(p in obj)
        if(typeof (v = obj[p]) === 'string')
            obj[p] = obj[v];

    return obj;
}