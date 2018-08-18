/**
 * Created by hellofunc on 2017-03-22.
 */

let class2type = {},
    toString = class2type.toString,
    getProto = Object.getPrototypeOf,
    hasOwn = class2type.hasOwnProperty,
    fnToString = hasOwn.toString,
    ObjectFunctionString = fnToString.call(Object),     // function Object() { [native code] }
    objStr = class2type.toString(),                     // [object Object]

    __onload,
    __ready = [];


export function $ready(a: Function) {
    if (a) {
        if (__onload) a();
        else __ready.indexOf(a) === -1 && __ready.push(a);
    }
}

function $$ready() {
    __ready.forEach(h => h());
}

(function (onload) {
    __onload = onload;
    if (onload) window.setTimeout($$ready);
    else {
        let completed = function () {
            document.removeEventListener("DOMContentLoaded", completed);
            window.removeEventListener("load", completed);
            __onload = true;
            window.setTimeout($$ready);
        }
        window.addEventListener("load", completed);
    }
})(document.readyState === 'complete')


export let ownNames = Object.getOwnPropertyNames;

export function _toString(v) {
    return toString.call(v);
}

export function __noop(a?) {
    return a;
}

export function __returnFalse() {
    return false;
}

export function __returnTrue() {
    return true;
}

// isPlainOjbect와 다르게 ①Object Map과 ②Class 객체를 골라준다.
export function isObjectType(obj) {
    return toString.call(obj) === objStr;
}

export function isPlainObject(obj) {
    var proto, Ctor;

    // Detect obvious negatives
    // Use toString instead of jQuery.type to catch host objects
    if (!obj || toString.call(obj) !== "[object Object]") {
        return false;
    }

    proto = getProto(obj);

    // Objects with no prototype (e.g., `Object.create( null )`) are plain
    if (!proto) {
        return true;
    }

    // Objects with prototype are plain iff they were constructed by a global Object function
    Ctor = hasOwn.call(proto, "constructor") && proto.constructor;
    return typeof Ctor === "function" && fnToString.call(Ctor) === ObjectFunctionString;
}


export function isEmptyObject(obj) {
    var name;
    for (name in obj) {
        return false;
    }
    return true;
}

export function isArrayLike(item) {
    return Array.isArray(item) ||
        (item && typeof item === "object" && typeof (item.length) === "number" && (item.length - 1) in item);
}

let r_fn = /^function\s*([^\s(]+)/;
export function getFunctionName(func) {
    return func.name ? func.name : func.toString().match(r_fn)[1]
}

export let isObject = (val) => toString.call(val) === "[object Object]";

/*
 *  일종의 객체 Decode/Encode
 *  세번째 인자에 해당 프로퍼티를 가공할 함수를 넣어주면, 객체를 복사하면서 값을 처리한다.
 *  이때 함수가 1) 반환값을 가지면, 그 값을 프로퍼티에 입력하고, 2) 반환값이 없으면 그냥 넘어간다.
 *  2)번의 경우는 직접 함수내에서 값 설정을 한다고 가정한다.
 */


let dummy = {},
    converts = {
        number: (a: string) => a ? parseInt(a) : 0,
    };
type EXTEND_CONFIG<T> = { [index: string]: ((v: any, o: T) => void) | boolean }


export function extend(...args: {}[])
export function extend(deep: boolean, ...args: {}[])
export function extend(...args: any[]) {

    let handler = _extend, i = 0, len: number, temp;

    if (typeof args[0] === 'boolean') {
        if (args[0]) handler = _deepExtend;
        i = 1;
    }

    temp = args[i++];
    len = args.length;


    for (; i < len; i++) {
        temp = handler(temp, args[i]);
    }

    return temp;
}

export function _extend<T>(dest: ArrayLike<T>, source: ArrayLike<T>): ArrayLike<T>
export function _extend<T>(dest: {}, source: T): T
export function _extend(dest, source): any {

    if (isArrayLike(source)) {
        let i = 0, l = source.length;
        for (; i < l; i++) {
            dest[i] = source[i];
        }
    }
    else {
        let p;
        for (p in source) {
            dest[p] = source[p];
        }
    }

    return dest;
}

export function _deepExtend<T>(dest: ArrayLike<T>, source: ArrayLike<T>): ArrayLike<T>
export function _deepExtend<T>(dest: {}, source: T): T
export function _deepExtend(dest, source): any {

    if (isArrayLike(source)) {
        let i = 0, l = source.length, d, s;
        for (; i < l; i++) {
            s = source[i];
            d = dest[i];
            if (isArrayLike(s)) dest[i] = _deepExtend(isArrayLike(d) ? d : [], s);
            else if (isPlainObject(s)) dest[i] = _deepExtend(isPlainObject(d) ? d : {}, s);
            else dest[i] = s;
        }
    }
    else {
        let i, s, d;
        for (i in source) {
            s = source[i];
            d = dest[i];
            if (isArrayLike(s)) dest[i] = _deepExtend(isArrayLike(d) ? d : [], s);
            else if (isPlainObject(s)) dest[i] = _deepExtend(isPlainObject(d) ? d : {}, s);
            else dest[i] = s;
        }
    }

    return dest;
}


// $extend(target, null)  ==>  모두 null값으로 대체
export function $extend<T>(target: T, source): T;
export function $extend<T>(target: T, source, converts: EXTEND_CONFIG<T>): T
export function $extend<T>(target: T, source, converts: EXTEND_CONFIG<T> = <any>dummy): T {

    // undefined값이 올때만 패스한다.
    // null이 들어오면 모든 프로퍼티가 null이 된다.
    if (source === void 0) return target;

    let p, v, f;

    // source가 단순 값일 경우!
    if (source === null) {
        for (p in target) {
            if (p[0] !== '_' && p[0] !== '$' && typeof (v = target[p]) !== 'function')
                target[p] = source;
        }
    }

    // source가 객체 혹은 valueMap일 경우
    else {
        for (p in source) {
            if (p[0] !== '_' && p[0] !== '$' && typeof (v = source[p]) !== 'function' && (f = converts[p]) !== false)
                if (typeof f === 'function') {
                    v = f.call(target, source[p], target);
                    if (v !== void 0) target[p] = v;
                }
                else target[p] = v
        }
    }

    return target;
}


export function __makeArray<T>(dest: ArrayLike<T>): T[] {
    if (dest == null) return <T[]>[];
    let l = dest.length, result = [];
    while (l-- > 0) result[l] = dest[l];
    return result;
}

type OBJECT<T> = { [index: string]: T }

export function __map<T, A>(array: ArrayLike<T>, handler: (v: T, i: number, obj: ArrayLike<T>) => A): A[]
export function __map<T, A>(obj: OBJECT<T>, handler: (v: T, p: string, obj) => A): {}
export function __map(obj, handler) {
    if (obj == null) return obj;

    let r, v, p;
    if (typeof obj.length === 'number') {
        r = [];
        for (let i = 0, l = obj.length; i < l; i++) {
            if ((v = handler.call(obj, obj[i], i, obj)) !== void 0) r.push(v);
        }
    }
    else if (isPlainObject(obj)) {
        r = {};
        for (p in obj) {
            if ((v = handler.call(obj, obj[p], p, obj)) !== void 0) r[p] = v;
        }
    }

    return r || obj;
}

export function __each<T>(array: ArrayLike<T>, handler: (v: T, i: number, obj: ArrayLike<T>) => any): T[]
export function __each<T>(obj: OBJECT<T>, handler: (v: T, p: string, obj: OBJECT<T>) => any): OBJECT<T>
export function __each(obj, handler) {
    if (obj == null) return obj;

    let p;
    if (isArrayLike(obj)) {
        for (let i = 0, l = obj.length; i < l; i++) {
            if (handler.call(obj, obj[i], i, obj) === false) break;
        }
    }
    else if (isPlainObject(obj)) {
        for (p in obj) {
            if (handler.call(obj, obj[p], p, obj) === false) break;
        }
    }
    return obj;
}

export function __reduce<T, D>(obj: ArrayLike<T>, handler: (d: D, v: T, i: number, obj: ArrayLike<T>) => D, d: D): D
export function __reduce<T, D>(obj: OBJECT<T>, handler: (d: D, v: T, p: string, obj: OBJECT<T>) => D, d: D): D
export function __reduce(obj, handler, d) {
    if (obj == null) return obj;

    let p;
    if (isArrayLike(obj)) {
        for (let i = 0, l = obj.length; i < l; i++)
            d = handler.call(obj, d, obj[i], i, obj);
    }
    else if (isPlainObject(obj)) {
        for (p in obj) d = handler.call(obj, d, obj[p], p, obj);

    }
    return d;
}


/*
 *   [1,2,3,4,5];
 *   ::  (1,2)  (2,3)  (3,4)  (4,5)
 */
export function __zipper<T, R>(array: ArrayLike<T>, handler: (before: T, after: T, r: R) => R, r?: R) {
    let {length} = array;
    if (length < 2) return;

    let i = 0, l = length - 1;
    while(i < l) {
        r = handler(array[i++], array[i], r);
    }
    return r;
}