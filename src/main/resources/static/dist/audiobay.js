/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 15);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;/**
 * Created by hellofunc on 2017-03-22.
 */
!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__, exports], __WEBPACK_AMD_DEFINE_RESULT__ = (function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var class2type = {}, toString = class2type.toString, getProto = Object.getPrototypeOf, hasOwn = class2type.hasOwnProperty, fnToString = hasOwn.toString, ObjectFunctionString = fnToString.call(Object), // function Object() { [native code] }
    objStr = class2type.toString(), // [object Object]
    __onload, __ready = [];
    function $ready(a) {
        if (a) {
            if (__onload)
                a();
            else
                __ready.indexOf(a) === -1 && __ready.push(a);
        }
    }
    exports.$ready = $ready;
    function $$ready() {
        __ready.forEach(function (h) { return h(); });
    }
    (function (onload) {
        __onload = onload;
        if (onload)
            window.setTimeout($$ready);
        else {
            var completed_1 = function () {
                document.removeEventListener("DOMContentLoaded", completed_1);
                window.removeEventListener("load", completed_1);
                __onload = true;
                window.setTimeout($$ready);
            };
            window.addEventListener("load", completed_1);
        }
    })(document.readyState === 'complete');
    exports.ownNames = Object.getOwnPropertyNames;
    function _toString(v) {
        return toString.call(v);
    }
    exports._toString = _toString;
    function __noop(a) {
        return a;
    }
    exports.__noop = __noop;
    function __returnFalse() {
        return false;
    }
    exports.__returnFalse = __returnFalse;
    function __returnTrue() {
        return true;
    }
    exports.__returnTrue = __returnTrue;
    // isPlainOjbect와 다르게 ①Object Map과 ②Class 객체를 골라준다.
    function isObjectType(obj) {
        return toString.call(obj) === objStr;
    }
    exports.isObjectType = isObjectType;
    function isPlainObject(obj) {
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
    exports.isPlainObject = isPlainObject;
    function isEmptyObject(obj) {
        var name;
        for (name in obj) {
            return false;
        }
        return true;
    }
    exports.isEmptyObject = isEmptyObject;
    function isArrayLike(item) {
        return Array.isArray(item) ||
            (item && typeof item === "object" && typeof (item.length) === "number" && (item.length - 1) in item);
    }
    exports.isArrayLike = isArrayLike;
    var r_fn = /^function\s*([^\s(]+)/;
    function getFunctionName(func) {
        return func.name ? func.name : func.toString().match(r_fn)[1];
    }
    exports.getFunctionName = getFunctionName;
    exports.isObject = function (val) { return toString.call(val) === "[object Object]"; };
    /*
     *  일종의 객체 Decode/Encode
     *  세번째 인자에 해당 프로퍼티를 가공할 함수를 넣어주면, 객체를 복사하면서 값을 처리한다.
     *  이때 함수가 1) 반환값을 가지면, 그 값을 프로퍼티에 입력하고, 2) 반환값이 없으면 그냥 넘어간다.
     *  2)번의 경우는 직접 함수내에서 값 설정을 한다고 가정한다.
     */
    var dummy = {}, converts = {
        number: function (a) { return a ? parseInt(a) : 0; },
    };
    function extend() {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        var handler = _extend, i = 0, len, temp;
        if (typeof args[0] === 'boolean') {
            if (args[0])
                handler = _deepExtend;
            i = 1;
        }
        temp = args[i++];
        len = args.length;
        for (; i < len; i++) {
            temp = handler(temp, args[i]);
        }
        return temp;
    }
    exports.extend = extend;
    function _extend(dest, source) {
        if (isArrayLike(source)) {
            var i = 0, l = source.length;
            for (; i < l; i++) {
                dest[i] = source[i];
            }
        }
        else {
            var p = void 0;
            for (p in source) {
                dest[p] = source[p];
            }
        }
        return dest;
    }
    exports._extend = _extend;
    function _deepExtend(dest, source) {
        if (isArrayLike(source)) {
            var i = 0, l = source.length, d = void 0, s = void 0;
            for (; i < l; i++) {
                s = source[i];
                d = dest[i];
                if (isArrayLike(s))
                    dest[i] = _deepExtend(isArrayLike(d) ? d : [], s);
                else if (isPlainObject(s))
                    dest[i] = _deepExtend(isPlainObject(d) ? d : {}, s);
                else
                    dest[i] = s;
            }
        }
        else {
            var i = void 0, s = void 0, d = void 0;
            for (i in source) {
                s = source[i];
                d = dest[i];
                if (isArrayLike(s))
                    dest[i] = _deepExtend(isArrayLike(d) ? d : [], s);
                else if (isPlainObject(s))
                    dest[i] = _deepExtend(isPlainObject(d) ? d : {}, s);
                else
                    dest[i] = s;
            }
        }
        return dest;
    }
    exports._deepExtend = _deepExtend;
    function $extend(target, source, converts) {
        if (converts === void 0) { converts = dummy; }
        // undefined값이 올때만 패스한다.
        // null이 들어오면 모든 프로퍼티가 null이 된다.
        if (source === void 0)
            return target;
        var p, v, f;
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
                        if (v !== void 0)
                            target[p] = v;
                    }
                    else
                        target[p] = v;
            }
        }
        return target;
    }
    exports.$extend = $extend;
    function __makeArray(dest) {
        if (dest == null)
            return [];
        var l = dest.length, result = [];
        while (l-- > 0)
            result[l] = dest[l];
        return result;
    }
    exports.__makeArray = __makeArray;
    function __map(obj, handler) {
        if (obj == null)
            return obj;
        var r, v, p;
        if (typeof obj.length === 'number') {
            r = [];
            for (var i = 0, l = obj.length; i < l; i++) {
                if ((v = handler.call(obj, obj[i], i, obj)) !== void 0)
                    r.push(v);
            }
        }
        else if (isPlainObject(obj)) {
            r = {};
            for (p in obj) {
                if ((v = handler.call(obj, obj[p], p, obj)) !== void 0)
                    r[p] = v;
            }
        }
        return r || obj;
    }
    exports.__map = __map;
    function __each(obj, handler) {
        if (obj == null)
            return obj;
        var p;
        if (isArrayLike(obj)) {
            for (var i = 0, l = obj.length; i < l; i++) {
                if (handler.call(obj, obj[i], i, obj) === false)
                    break;
            }
        }
        else if (isPlainObject(obj)) {
            for (p in obj) {
                if (handler.call(obj, obj[p], p, obj) === false)
                    break;
            }
        }
        return obj;
    }
    exports.__each = __each;
    function __reduce(obj, handler, d) {
        if (obj == null)
            return obj;
        var p;
        if (isArrayLike(obj)) {
            for (var i = 0, l = obj.length; i < l; i++)
                d = handler.call(obj, d, obj[i], i, obj);
        }
        else if (isPlainObject(obj)) {
            for (p in obj)
                d = handler.call(obj, d, obj[p], p, obj);
        }
        return d;
    }
    exports.__reduce = __reduce;
    /*
     *   [1,2,3,4,5];
     *   ::  (1,2)  (2,3)  (3,4)  (4,5)
     */
    function __zipper(array, handler, r) {
        var length = array.length;
        if (length < 2)
            return;
        var i = 0, l = length - 1;
        while (i < l) {
            r = handler(array[i++], array[i], r);
        }
        return r;
    }
    exports.__zipper = __zipper;
}).apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__, exports], __WEBPACK_AMD_DEFINE_RESULT__ = (function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var DOM;
    (function (DOM) {
        var doc = document;
        function closest(target, handler, limit) {
            if (limit === void 0) { limit = null; }
            var index = 0;
            do {
                if (handler(target, index++))
                    return target;
            } while ((target = target.parentElement) && target !== limit);
            return target;
        }
        DOM.closest = closest;
        function offset(e, parent, extend) {
            if (parent === void 0) { parent = document.body; }
            if (extend === void 0) { extend = false; }
            var l = 0, t = 0, target = e;
            do {
                t += target.offsetTop - target.scrollTop;
                l += target.offsetLeft - target.scrollLeft;
            } while ((target = target.offsetParent) && target !== parent);
            var result = { left: l, top: t };
            if (extend === true) {
                var w = e.offsetWidth, h = e.offsetHeight;
                result['width'] = w;
                result['height'] = h;
                result['right'] = w + l;
                result['bottom'] = t + h;
            }
            return result;
        }
        DOM.offset = offset;
        function isAssignableFrom(target, parent) {
            do {
                if (target === parent)
                    return true;
            } while (target = target.parentElement);
            return false;
        }
        DOM.isAssignableFrom = isAssignableFrom;
        function selector(selector, parent) {
            if (parent === void 0) { parent = document; }
            return toArray(parent.querySelectorAll(selector));
        }
        DOM.selector = selector;
        // NodeList등을 array로!!
        function toArray(elements, result) {
            if (result === void 0) { result = []; }
            var len = elements['length'];
            if (typeof len === 'number') {
                for (var i = 0; i < len; i++) {
                    result.push(elements[i]);
                }
            }
            else
                result.push(elements);
            return result;
        }
        DOM.toArray = toArray;
        // obj는 인터폴레이터용
        function stringToDOM(str, obj) {
            var v, div = document.createElement('div');
            if (obj) {
                str = str.replace(/{{(.+?)}}/g, function (_, p) {
                    if ((v = obj[p]) != null) {
                        if (typeof v === 'function')
                            return v.call(obj);
                        return v;
                    }
                    return '';
                });
            }
            div.innerHTML = str;
            return toArray(div.children);
        }
        DOM.stringToDOM = stringToDOM;
        function hasClass(element, name) {
            var className = element.className.split(c_r), names = Array.isArray(name) ? name : [name];
            return names.every(function (v) { return className.indexOf(v) !== -1; });
        }
        DOM.hasClass = hasClass;
        /*
         *  isAdd가 null이면 toggleClass로 작동한다.
         */
        var c_r = /\s+/, uuid = 1;
        /*
         *  2018-01-20
         *  원래는 <div> 하나의 객체를 만들어서 재활용하는 형태로 사용했었다.
         *  하지만 그렇게 할 경우 ie에서 버그가 생긴다.
         */
        DOM.createHTML = (function () {
            var r = /^<([^\s>]+)/i;
            function get(parent, html, tag) {
                var index;
                switch (tag) {
                    case 'option':
                        index = 2;
                        parent.innerHTML = '<select>' + html + '</select>';
                        break;
                    case 'thead':
                    case 'tbody':
                    case 'tfoot':
                    case 'colgroup':
                    case 'caption':
                        index = 2;
                        parent.innerHTML = '<table>' + html + '</table>';
                        break;
                    case 'col':
                        index = 3;
                        parent.innerHTML = '<table><colgroup>' + html + '</colgroup></table>';
                        break;
                    case 'tr':
                        index = 3;
                        parent.innerHTML = '<table><tbody>' + html + '</tbody></table>';
                        break;
                    case 'td':
                    case 'th':
                        index = 4;
                        parent.innerHTML = '<table><tbody><tr>' + html + '</tr></tbody></table>';
                        break;
                    default:
                        parent.innerHTML = html;
                        return parent.firstElementChild;
                }
                while (index-- > 0)
                    parent = parent.firstElementChild;
                return parent;
            }
            return function (html) {
                html = html.trim();
                return get(document.createElement('div'), html, r.exec(html)[1]);
            };
        })();
        function className(element, value, isAdd) {
            if (element == null)
                return element;
            var className = element.className.trim(), array = className ? className.split(c_r) : [], result;
            if (typeof value === 'function') {
                result = value.call(element, array, element);
            }
            else {
                var values = Array.isArray(value) ? value : [value];
                // ① ['a', 'u']  ==> ['!a', 'b']  ====>  ['u', 'b'];
                if (isAdd == null)
                    result = __toggleClass(array, values);
                else if (isAdd === true)
                    result = __addClass(array, values);
                else
                    result = __removeClass(array, values);
            }
            element.className = result.join(' ');
            return element;
        }
        DOM.className = className;
        function __addClass(array, target) {
            var i = 0, l = target.length;
            for (; i < l; i++) {
                array.indexOf(target[i]) === -1 && array.push(target[i]);
            }
            return array;
        }
        function __removeClass(array, target) {
            var i = 0, l = array.length, result = [], pos = 0;
            for (; i < l; i++) {
                target.indexOf(array[i]) === -1 && (result[pos++] = array[i]);
            }
            return result;
        }
        function __toggleClass(array, values) {
            var l = values.length, i = 0, pos = -1, result = [], v, removal;
            for (; i < l; i++) {
                if (removal = (v = values[i])[0] === '!') {
                    if ((pos = array.indexOf(v.slice(1))) !== -1)
                        array.splice(pos, 1);
                }
                else {
                    if ((pos = array.indexOf(v)) === -1)
                        result.push(v);
                }
            }
            return array.concat(result);
        }
        function eachAttrs(ele, handler) {
            var attributes = ele.attributes, length = ele.attributes.length;
            while (length-- > 0)
                if (handler.call(ele, attributes[length].name, attributes[length].value) === false)
                    return;
        }
        DOM.eachAttrs = eachAttrs;
        DOM.attrMap = (function (r_data, r_up, fn) {
            var rename = function (s) { return s.replace(r_data, '').replace(r_up, fn); };
            return function (element) {
                var attributes = element.attributes, length = attributes.length, attr, result = {};
                while (length-- > 0) {
                    attr = attributes[length];
                    result[rename(attr.name)] = attr.value;
                }
                return result;
            };
        })(/^data-/, /-([^-])/g, function (_, i) { return i.toUpperCase(); });
    })(DOM = exports.DOM || (exports.DOM = {}));
}).apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__, exports], __WEBPACK_AMD_DEFINE_RESULT__ = (function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var Arrays;
    (function (Arrays) {
        // 배열을 테이블화 시켜서 순회한다. 행이 존재함
        // 콜백함수 (원소, 전체인덱스, 열넘버, 행넘버) ==>  false 반환시 루프 멈춤
        function cols(array, col, callback) {
            var limit = array.length, i = 0, colNum, row = -1;
            if (col < 1)
                throw new Error('열 수는 1 이상이어야  합니다 :: input Value ==> ' + col);
            for (; i < limit; i++) {
                if ((colNum = i % col) === 0)
                    row++;
                if (callback.call(array, array[i], i, i % col, row) === false)
                    return;
            }
        }
        Arrays.cols = cols;
        /*
         *  DataTransferItemList 때문에 만든 함수
         *  map을 이용함에 있어, 비동기식 콜백으로 값을 받아야 하는 지연값이 있을 경우에 쓴다.
         *  *사용법은 로직 참고
         */
        function promiseMap(array, handler) {
            return new Promise(function (resolve, _) {
                var check, len = check = array.length, result = [];
                var _loop_1 = function () {
                    var index = len;
                    handler(array[index], function (d) {
                        result[index] = d;
                        --check === 0 && resolve(result);
                    });
                };
                while (len-- > 0) {
                    _loop_1();
                }
            });
        }
        Arrays.promiseMap = promiseMap;
        // 숫자배열을 만들어준다.
        // 시작넘버부터 객수
        function rangeBySize(start, size) {
            var array = [];
            for (var l = start + size; start < l; start++) {
                array.push(start);
            }
            return array;
        }
        Arrays.rangeBySize = rangeBySize;
        // 시작숫자부터 마지막 숫자를 포함한 배열을 반환
        function range_atob(start, lastNum) {
            var reverse = start > lastNum ? true : false, array = [];
            /*
             *  start와 lastNum이 반대로 들어오면 ?    (5, 1)   ==>  [5,4,3,2,1]
             *  일단 뒤짚어서 배열을 만든 후, 내보낼때 reserve()한다.
             */
            if (reverse) {
                var temp = start;
                start = lastNum;
                lastNum = temp;
            }
            for (var i = 0, l = lastNum - start + 1; i < l; i++) {
                array.push(i + start);
            }
            return reverse ? array.reverse() : array;
        }
        Arrays.range_atob = range_atob;
        // drive 배열의 원소만큼 루프를 돌린다.
        // callback함수는  1) drive 배열의 원소와  2) driven배얼, 3) 인덱스를 제공받는다.
        function _with(drive, driven, callback) {
            if (drive == null)
                return;
            for (var i = 0; i < drive.length; i++) {
                callback.call(drive, drive[i], driven, i);
            }
        }
        Arrays._with = _with;
        function fill(length, v) {
            if (v === void 0) { v = null; }
            var i = 0, array = [], handler = v;
            if (typeof v !== 'function')
                handler = function () { return v; };
            for (; i < length; i++) {
                array[i] = handler.call(array, i);
            }
            return array;
        }
        Arrays.fill = fill;
        // 배열을 length의 갯수만큼 나눈다.
        // [1,2,3,4,5,6], 3  ==>  [1,2,3], [4,5,6]
        function split(target, length) {
            var result = [], temp, pos;
            for (var i = 0, l = target.length; i < l; i++) {
                pos = i % length;
                if (!pos)
                    result.push(temp = []);
                temp[pos] = target[i];
            }
            return result;
        }
        Arrays.split = split;
        // target의 앞부터 다 맞으면 오케이
        function startWith(key, target) {
            var i = 0, l = key.length;
            if (target.length < l)
                return false;
            for (; i < l; i++) {
                if (key[i] !== target[i])
                    return false;
            }
            return true;
        }
        Arrays.startWith = startWith;
        function endWith(key, target) {
            var i = 0, l = key.length, r = target.length - l;
            if (r < 0)
                return false;
            for (; i < l; i++, r++) {
                if (key[i] !== target[r])
                    return false;
            }
            return true;
        }
        Arrays.endWith = endWith;
        // 값 비교
        function equals(a, b) {
            if (a === b)
                return true;
            if (a == null || b == null)
                return false;
            if (a.length != b.length)
                return false;
            // If you don't care about the order of the elements inside
            // the array, you should sort both arrays here.
            for (var i = 0, l = a.length; i < l; i++) {
                if (a[i] !== b[i])
                    return false;
            }
            return true;
        }
        Arrays.equals = equals;
    })(Arrays = exports.Arrays || (exports.Arrays = {}));
}).apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ }),
/* 3 */,
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__, exports, __webpack_require__(0), __webpack_require__(1), __webpack_require__(2), __webpack_require__(5)], __WEBPACK_AMD_DEFINE_RESULT__ = (function (require, exports, core_1, dom_1, arrays_1, strings_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    function $snapshot(data, names) {
        var v;
        return names.reduce(function (result, name) {
            v = data[name];
            if (Array.isArray(v))
                result[name] = v.slice(); // 배열일 경우 스냅샷
            else
                result[name] = v;
            return result;
        }, {});
    }
    // 두개의 스냅샷 비교해서 수정된 프로퍼티 목록 뽑아내기
    function $changeNames(snapshot, newSnapshot) {
        var p, result = [], o, n;
        for (p in newSnapshot) {
            o = snapshot[p];
            n = newSnapshot[p];
            // 둘 중 하나가 Array
            if (Array.isArray(o)) {
                if (!Array.isArray(n))
                    result.push(p);
                else if (!arrays_1.Arrays.equals(o, n))
                    result.push(p);
            }
            else if (o !== n)
                result.push(p);
        }
        return result;
    }
    ;
    var Watcher = /** @class */ (function () {
        function Watcher(obj) {
            this.obj = obj;
            this.snapshot = {};
            this.watchList = [];
            this.watchMap = {};
            this.applyHandler = [];
            this.isApply = false;
        }
        Watcher.prototype.addWatch = function (v) {
            if (!v)
                return this;
            var _a = this, watchMap = _a.watchMap, applyHandler = _a.applyHandler, watchList = _a.watchList, p;
            // applyHandler
            if (typeof v === 'function')
                applyHandler.indexOf(v) === -1 && applyHandler.push(v);
            // watchHandler
            else {
                var p_1;
                for (p_1 in v) {
                    watchList.indexOf(p_1) === -1 && watchList.push(p_1);
                    (watchMap[p_1] || (watchMap[p_1] = [])).push(v[p_1]);
                }
            }
            return this;
        };
        Watcher.prototype.apply = function (p) {
            if (this.isApply)
                return;
            this.isApply = true;
            var _a = this, obj = _a.obj, snapshot = _a.snapshot, watchMap = _a.watchMap, newSnapshot = this.snapshot = $snapshot(obj, this.watchList);
            // property명이 들어올 경우 강제 apply!
            if (p) {
                if (typeof p === 'string')
                    p = [p];
                p.forEach(function (name) {
                    watchMap[name] && watchMap[name].forEach(function (f) { return f(null, null); });
                });
            }
            else {
                // ① apply 핸들러
                this.applyHandler.forEach(function (h) { return h(); });
                // ② propery 핸들러
                $changeNames(snapshot, newSnapshot).forEach(function (name) {
                    watchMap[name] && watchMap[name].forEach(function (f) { return f(newSnapshot[name], snapshot[name]); });
                });
            }
            this.isApply = false;
        };
        return Watcher;
    }());
    exports.Watcher = Watcher;
    function Template(name, directives) {
        return function (cons) {
            Template.build(cons, name, directives);
        };
    }
    exports.Template = Template;
    (function (Template) {
        var unCamelCase = strings_1.Strings.unCamelCase;
        var PRIVATE_KEY = "_____object_____";
        Template.default_directive = {};
        //*********************** ▼ INNER CLASS ▼ ***********************//
        var TemplateObject = /** @class */ (function () {
            function TemplateObject(element, watcher) {
                this.element = element;
                this.watcher = watcher;
                this.isInit = false;
            }
            TemplateObject.prototype.apply = function () {
                this.isInit = true;
                this.watcher.apply();
            };
            return TemplateObject;
        }());
        (function (TemplateObject) {
            function get(obj, selector, directive) {
                var r = obj[PRIVATE_KEY];
                /*
                 *  여기서 처음으로 컴파일된다.
                 */
                if (!r) {
                    var watcher = new Watcher(obj), element = void 0;
                    // HTML 템플릿 가지고 오기
                    if (selector[0] === '=')
                        selector = document.querySelector(selector.slice(1)).innerHTML.trim();
                    if (selector[0] === '<')
                        element = dom_1.DOM.createHTML(selector);
                    else
                        element = document.querySelector(selector);
                    r = obj[PRIVATE_KEY] = new TemplateObject(element, watcher);
                    each(element, directive, watcher);
                }
                return r;
            }
            TemplateObject.get = get;
        })(TemplateObject || (TemplateObject = {}));
        //*********************** ▲ INNER CLASS ▲ ***********************//
        // 디렉티브 확장하기
        function expendDirective(cons, directives) {
            var consObj = cons[PRIVATE_KEY], dir = consObj ? consObj.directive : null, p;
            if (dir) {
                for (p in directives)
                    dir[p] = directives[p];
            }
            return Template;
        }
        Template.expendDirective = expendDirective;
        function build(cons, selector, directives) {
            var consObj = cons[PRIVATE_KEY];
            if (consObj && consObj.cons === cons)
                return cons;
            /*
             *    ("name", {})
             *    ("name")
             *    ({})
             */
            // arguments
            if (typeof selector !== 'string') {
                if (selector)
                    directives = selector;
                selector = core_1.getFunctionName(cons);
                selector = '=#' + selector[0].toLowerCase() + selector.slice(1) + '-template';
            }
            // 디렉티브 상속
            var prototype = cons.prototype, apply = cons.prototype.apply, dir = (consObj && consObj.directive) || Template.default_directive, p, result = Object.create(dir);
            if (directives)
                for (p in directives)
                    result[p] = directives[p];
            /*
             *
             */
            Object.defineProperty(prototype, '$template', {
                get: function () {
                    var temple = TemplateObject.get(this, selector, result);
                    temple.isInit || temple.apply();
                    return temple.element;
                },
                set: function (v) {
                },
                configurable: false,
                enumerable: false
            });
            /*
             *
             */
            prototype.apply = function () {
                apply.apply(this);
                TemplateObject.get(this, selector, result).apply();
                return this;
            };
            cons[PRIVATE_KEY] = { directive: result, cons: cons };
        }
        Template.build = build;
        function simpleEach(element, handler, data) {
            if (element.nodeType !== 1)
                return;
            var attrs = dom_1.DOM.attrMap(element), children = element.children, attributes = element.attributes, len = attributes.length;
            while (len-- > 0) {
                if (handler(element, attrs, data) === false)
                    return;
            }
            len = children.length;
            while (len-- > 0)
                simpleEach(children[len], handler, data);
        }
        function directiveEach(element, directive, watchMode, data) {
            if (element.nodeType !== 1 || element.hasAttribute('data-template-compile'))
                return;
            var attrs = dom_1.DOM.attrMap(element), func = directive[unCamelCase(element.tagName.toLowerCase())];
            // tag명이 일치하면 순회중지
            if (func) {
                if (watchMode)
                    data.addWatch(func(element, attrs, data.obj));
                else
                    func(element, null, data);
            }
            // 디렉티브 중 표기하면 건너띈다.
            if (element.hasAttribute('data-template-compile'))
                return;
            var children = element.children, len = element.children.length, p;
            for (p in attrs) {
                if (func = directive[p]) {
                    if (watchMode)
                        data.addWatch(func(element, attrs, data.obj));
                    else
                        func(element, attrs, data);
                }
            }
            while (len-- > 0)
                directiveEach(children[len], directive, watchMode, data);
            if (watchMode)
                return data;
        }
        function each(element, directive, data) {
            if (typeof directive === 'function') {
                simpleEach(element, directive, data);
                return element;
            }
            var watchMode = data instanceof Watcher, attrs = dom_1.DOM.attrMap(element);
            // ① 디렉티브 순회 전
            if (typeof directive['$'] === 'function') {
                if (watchMode)
                    data.addWatch(directive['$'](element, attrs, data.obj));
                else
                    directive['$'](element, attrs, data);
            }
            // ② 디렉티브 순회
            var rv = directiveEach(element, directive, watchMode, data);
            // 컴파일 사실을 체크한다.
            element.setAttribute('data-template-compile', 'true');
            // ③ 디렉티브 순회 후
            if (typeof directive['$$'] === 'function') {
                if (watchMode)
                    data.addWatch(directive['$$'](element, attrs, data.obj));
                else
                    directive['$$'](element, attrs, data);
            }
            return rv;
        }
        Template.each = each;
        Template.snapshot = $snapshot;
        Template.changeNames = $changeNames;
    })(Template = exports.Template || (exports.Template = {}));
}).apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ }),
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__, exports], __WEBPACK_AMD_DEFINE_RESULT__ = (function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var Strings;
    (function (Strings) {
        Strings.unCamelCase = (function (r_data, r_up, fn) {
            return function (s) { return s.replace(r_data, '').replace(r_up, fn); };
        })(/^data-/, /-([^-])/g, function (_, i) { return i.toUpperCase(); });
        var r = /{{(.*?)}}/g;
        function replaceHTML(str, obj) {
            return str.replace(r, function (_, p) {
                return obj[p] == null ? '' : obj[p];
            });
        }
        Strings.replaceHTML = replaceHTML;
    })(Strings = exports.Strings || (exports.Strings = {}));
}).apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ }),
/* 6 */,
/* 7 */,
/* 8 */,
/* 9 */,
/* 10 */,
/* 11 */,
/* 12 */,
/* 13 */,
/* 14 */
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__, exports], __WEBPACK_AMD_DEFINE_RESULT__ = (function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var CountLoop = /** @class */ (function () {
        function CountLoop(time, handler) {
            var _this = this;
            this.time = time;
            this.handler = handler;
            this._isActive = false;
            this._count = 0;
            this._handler = function () { return _this.run(); };
        }
        CountLoop.prototype.start = function () {
            if (!this._isActive) {
                this._index = setTimeout(this._handler, this.time);
                this._isActive = true;
            }
            return this;
        };
        CountLoop.prototype.stop = function () {
            if (this._isActive) {
                clearTimeout(this._index);
                this._isActive = false;
            }
            this._count = 0;
            return this;
        };
        CountLoop.prototype.run = function () {
            this.handler(++this._count, this);
            // handler중에 stop()이 호출됐을수도 있다.
            if (this._isActive)
                this._index = setTimeout(this._handler, this.time);
        };
        return CountLoop;
    }());
    exports.CountLoop = CountLoop;
    /*
     *  setTimeout()
     */
    var Loop;
    (function (Loop) {
        function _timeloop(handler, time) {
            var count = 1, index = -1, dispatcher = function () {
                if (handler(count++) === false)
                    clearTimeout(index);
                else
                    loop();
            }, loop = function () { return index = setTimeout(dispatcher, time); };
            loop();
        }
        function countLoop(handler, time, count) {
        }
        Loop.countLoop = countLoop;
    })(Loop = exports.Loop || (exports.Loop = {}));
}).apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ }),
/* 15 */
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__, exports, __webpack_require__(0), __webpack_require__(14), __webpack_require__(4), __webpack_require__(1)], __WEBPACK_AMD_DEFINE_RESULT__ = (function (require, exports, core_1, loop_1, template_1, dom_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var className = dom_1.DOM.className;
    var $$resolve = Promise.resolve(), filter = (function (key) {
        return key ? new RegExp(key, 'gi') : null;
    })(decodeURIComponent(location.search.replace(/^\?/, '')));
    var Data = /** @class */ (function () {
        function Data(config) {
            this.config = config;
            this.xhr = new XMLHttpRequest();
            this.loading = false;
            this._resolve = $$resolve;
            this.checks = [];
            this.values = [];
        }
        Data.prototype.refresh = function () {
            var _this = this;
            if (this.loading)
                return this._resolve;
            className(this.$template, ['loading'], true);
            return this._resolve = new Promise(function (o, x) {
                var xhr = _this.xhr;
                _this.loading = true;
                xhr.onreadystatechange = function () {
                    if (xhr.readyState == 4) {
                        if (xhr.status == 200) {
                            _this.values = JSON.parse(xhr.responseText);
                            className(_this.$template, ['loading'], false);
                            _this.apply();
                            _this.loading = false;
                            _this.checks = _this.values.map(function (s) { return s.url; });
                        }
                        o();
                    }
                };
                xhr.open('GET', _this.config.url, true);
                xhr.send(null);
            });
        };
        Data.prototype.apply = function () {
            return this;
        };
        Data = __decorate([
            template_1.Template({
                ul: function (ele, attrs, data) {
                    return function () {
                        var values = data.values, checks = data.checks, v, title, html = [], i = 0, l = 20;
                        for (; i < l; i++) {
                            if (v = values[i]) {
                                var classes = [], ii = 0;
                                if (v.soldout)
                                    classes[ii++] = 'sold-out';
                                if (checks.length && checks.indexOf(v.url) === -1)
                                    classes[ii++] = 'new';
                                if (filter && filter.test(v.title)) {
                                    title = '<span class="catch"><a href="' + v.url + '" target="_blank">' +
                                        v.title.replace(filter, function (a) { return '<b>' + a + '</b>'; }) +
                                        '</a></span></li>';
                                }
                                else {
                                    title = '<span><a href="' + v.url + '" target="_blank">' + v.title + '</a></span></li>';
                                }
                                html[i] = '<li' + (classes.length ? ' class="' + classes.join(' ') + '"' : '') + '>' +
                                    (v.count > 200 ? '<i class="hit">' + v.count + '</i>' : '<i>' + v.count + '</i>') +
                                    title;
                            }
                            else
                                html[i] = '<li><i></i><a></a></li>';
                        }
                        ele.innerHTML = html.join('');
                    };
                },
                a: function (ele, attrs, data) {
                    ele.href = data.config.link;
                    ele.textContent = data.config.name;
                }
            }),
            __metadata("design:paramtypes", [Object])
        ], Data);
        return Data;
    }());
    core_1.$ready(function () {
        var container = document.querySelector('.row'), t = document.querySelector('.time-count'), 
        //   https://cafe.naver.com/hungrya?iframe_url=/ArticleList.nhn%3Fsearch.clubid=25678061%26userDisplay=50%26search.boardtype=L%26search.specialmenutype=%26search.questionTab=A%26search.totalCount=501%26search.page=2
        naverCafe = function (kr, name, cId, mId) {
            return {
                name: kr,
                link: 'https://cafe.naver.com/' + name + '?' +
                    'iframe_url=/ArticleList.nhn%3F' +
                    'search.clubid=' + cId + '%26' +
                    'search.menuid=' + mId + '%26' +
                    'userDisplay=50%26' +
                    'search.boardtype=L%26' +
                    'search.specialmenutype=%26' +
                    'search.questionTab=A%26' +
                    'search.totalCount=501%26' +
                    'search.page=1',
                url: '/audiobay/naver?page=1&clubId=' + cId + '&name=' + name + '&menuId=' + mId
            };
        }, list = [
            {
                name: '와싸다닷컴',
                link: 'http://www.wassada.com/bbs_list.php?tb=board_uusell',
                url: '/audiobay/wassada?page=1',
            },
            {
                name: '하이파이클럽',
                link: 'https://www.hificlub.co.kr/web10/jmkt/jmkt_list_n16.asp?jmkt_gb=1',
                url: '/audiobay/hificlub?page=1',
            },
            naverCafe('피씨파이카페', 'cyrus7', 15058188, 59),
            naverCafe('중고나라', 'joonggonara', 10050146, 411),
            naverCafe('하이파이코리아', 'hifikorea', 23218064, 48),
            naverCafe('헝그리오디오', 'hungrya', 25678061, 14),
            naverCafe('두두오 일반', 'audiodudu', 28248719, 46),
            naverCafe('신길카오디오', 'junggocaraudio', 20672804, 19),
            naverCafe('두두오 고급', 'audiodudu', 28248719, 53),
            {
                name: '실용오디오',
                link: 'https://www.enjoyaudio.com/zbxe/index.php?mid=audiosell',
                url: '/audiobay/enjoyaudio?page=1',
            },
            naverCafe('깡통소리', 'hiend', 25469486, 48),
            naverCafe('네임오디오 카페', 'naimaudiokorea', 26214223, 86),
        ]
            .map(function (r) {
            var d = new Data(r);
            container.appendChild(d.$template);
            return d;
        }), loop = new loop_1.CountLoop(1000, function (count, loop) {
            t.textContent = (30 - count).toString();
            if (count == 30) {
                loop.stop();
                $refresh();
            }
        }), $refresh = function () { return Promise.all(list.map(function (l) { return l.refresh(); })).then(function () { return loop.start(); }); };
        template_1.Template.each(document.body, {
            input: function (ele, attrs) {
                /*
                 *  url값으로 filter를 셋팅한다.
                 */
                var value = decodeURIComponent(location.search.replace(/^\?/, ''));
                if (value) {
                    filter = new RegExp(value.replace(/\s+/g, '|'), 'gi');
                    ele.value = value;
                }
                ele.addEventListener('keypress', function (e) {
                    if (e.keyCode === 13) {
                        var keyword = ele.value.trim();
                        if (keyword && keyword !== value) {
                            try {
                                filter = new RegExp(keyword.replace(/\s+/g, '|'), 'gi');
                            }
                            catch (e) {
                                filter = null;
                            }
                        }
                        else {
                            filter = null;
                        }
                        list.forEach(function (l) { return l.apply(); });
                    }
                });
            }
        });
        $refresh();
    });
}).apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ })
/******/ ]);