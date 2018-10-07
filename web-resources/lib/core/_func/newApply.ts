
let {bind} = Function.prototype;

export function _newApply(cons, args: any[]) {
    return new (bind.apply(cons, [null].concat(args)));
}
