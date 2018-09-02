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
/******/ 	return __webpack_require__(__webpack_require__.s = 38);
/******/ })
/************************************************************************/
/******/ ({

/***/ 0:
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
        if (source == null)
            return dest;
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

/***/ 1:
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

/***/ 12:
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__, exports], __WEBPACK_AMD_DEFINE_RESULT__ = (function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var Selector;
    (function (Selector) {
        function select(ele, handler) {
            var arg = [];
            for (var _i = 2; _i < arguments.length; _i++) {
                arg[_i - 2] = arguments[_i];
            }
            var element = typeof ele === 'string' ? document.querySelector(ele) : ele, args = [], i = 0, l = arg.length;
            for (; i < l; i++) {
                args[i] = typeof arg[i] === 'string' ? element.querySelector(arg[i]) : arg[i];
            }
            return handler.apply(element, args);
        }
        Selector.select = select;
        ;
        function byId(s) {
            return document.getElementById(s);
        }
        Selector.byId = byId;
    })(Selector = exports.Selector || (exports.Selector = {}));
}).apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ }),

/***/ 3:
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;/**
 * Created by hellofunc on 2017-03-01.
 */
!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__, exports], __WEBPACK_AMD_DEFINE_RESULT__ = (function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var Access;
    (function (Access) {
        // dot으로 구분된 프로퍼티 읽어오기
        Access.read = (function () {
            function ___read(prop, data) {
                var value = data[prop];
                return typeof value === 'function' ? value.call(data) : value;
            }
            return function (prop, data, nullSafeVal) {
                if (nullSafeVal === void 0) { nullSafeVal = null; }
                var props = prop.split(/\./), i = 0, l = props.length, result = data;
                for (; i < l; i++) {
                    result = ___read(props[i], result);
                    if (result == null)
                        return nullSafeVal;
                }
                return Access.primitive(result);
            };
        })();
        Access.primitive = (function () {
            var r_number = /^\d+$/, r_boolean = /^true$|^false$/, r_string = /^['"][^"']+['"]$/, r_date = /^\d{4}-\d{2}-\d{2}$|^\d{4}-\d{2}-\d{2}\s\d{2}:\d{2}:\d{2}$/, r_string_replace = /["']/g;
            return function (val) {
                if (typeof val === 'string' && val.length > 0) {
                    if (r_number.test(val))
                        return parseInt(val);
                    if (r_boolean.test(val))
                        return val === 'true';
                    if (r_string.test(val))
                        return val.replace(r_string_replace, '');
                    if (r_date.test(val))
                        return new Date(val);
                }
                return val;
            };
        })();
        function access(target, _props, val, force) {
            var props = _props.split(/\./), len = props.length - 1, obj = target, temp, i = 0;
            for (; obj != null && i < len; i++) {
                temp = obj[props[i]];
                if (temp == null && force)
                    temp = obj[props[i]] = {};
                obj = temp;
            }
            // [1] getter
            if (arguments.length === 2)
                return obj != null ? obj[props[i]] : obj;
            // [2] setter
            obj != null && (obj[props[i]] = val);
            return target;
        }
        Access.access = access;
    })(Access = exports.Access || (exports.Access = {}));
}).apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ }),

/***/ 38:
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__, exports, __webpack_require__(0), __webpack_require__(39), __webpack_require__(4), __webpack_require__(12), __webpack_require__(1)], __WEBPACK_AMD_DEFINE_RESULT__ = (function (require, exports, core_1, format_1, html_1, selector_1, dom_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var number = format_1.Formats.number;
    var createHTML = dom_1.DOM.createHTML;
    var select = selector_1.Selector.select;
    var byId = selector_1.Selector.byId;
    var compile = html_1.HTML.compile;
    core_1.$ready(function () {
        select(document.body, function ($result, $unit, result, container, add) {
            var r_input_type = /input/i, r_num = /^\d+$/, r_input = /\d+-\d+/, r_group = {
                num: /[^\d]/g,
                size: /[^\d-]/g,
            }, units = [], $$result = compile($result.innerText), refresh = function () {
                var count = 0, n = units
                    .filter(function (v) { return v.valid(); })
                    .reduce(function (r, i) {
                    count += i.count();
                    return r += i.compute();
                }, 0);
                result.innerHTML = $$result({
                    count: count,
                    price: number(n)
                });
            }, create = function () {
                select(createHTML($unit.innerText), function (price, size, count, remove) {
                    var _this = this;
                    var ctrl = {
                        index: units.length,
                        count: function () {
                            return parseInt(count.value || '1');
                        },
                        valid: function () {
                            console.log(price.value, size.value);
                            return r_num.test(price.value) && r_input.test(size.value);
                        },
                        compute: function () {
                            var p = parseInt(price.value), _a = size.value.split(/-/), _w = _a[0], _h = _a[1], w = parseInt(_w), h = parseInt(_h);
                            return (w * h / 1000000) * p * this.count();
                        }
                    };
                    container.appendChild(this);
                    units.push(ctrl);
                    remove.addEventListener('click', function () {
                        units.splice(units.indexOf(ctrl), 1);
                        ctrl = null;
                        container.removeChild(_this);
                        refresh();
                    });
                }, '.price', '.size', '.count', '.remove');
            };
            container.addEventListener('keyup', function (e) {
                var target = e.target;
                if (r_input_type.test(target.tagName)) {
                    target.value = target.value.replace(r_group[target.getAttribute('data-regexp')], '');
                    refresh();
                }
            });
            add.addEventListener('click', function () { return create(); });
            create();
        }, byId('result-template'), byId('unit-template'), '#result', '#values', '#add');
    });
}).apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ }),

/***/ 39:
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__, exports, __webpack_require__(3)], __WEBPACK_AMD_DEFINE_RESULT__ = (function (require, exports, access_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    /**
     * Created by hellofunc on 2017-03-01.
     */
    var Formats;
    (function (Formats) {
        var rr = /:([\w.]+)/g;
        function replaceAll(str, val) {
            var v;
            if (val == null)
                return str;
            return str.replace(rr, function (_, prop) {
                v = access_1.Access.access(val, prop);
                return v == null ? '' : v;
            });
        }
        Formats.replaceAll = replaceAll;
        function replace(__value, rg, literal, matcher) {
            var pos = 0, result = __value.replace(rg, function (all, match, index) {
                if (index)
                    literal(__value.substring(pos, index));
                pos = index + all.length;
                return matcher.apply(this, arguments);
                ;
            });
            if (pos < __value.length)
                literal(__value.substring(pos, __value.length));
            return result;
        }
        Formats.replace = replace;
        // 숫자 받아서 파일 크기로... (천단위 쉼표)
        // unit은 단위를 덧붙일 것인지
        Formats.fileSize = (function (array) {
            var r = /\B(?=(?:\d{3})+(?!\d))/g;
            return function (size, unit) {
                if (unit === void 0) { unit = true; }
                var t = typeof size;
                if (t !== 'number') {
                    if (t !== 'string' || !/^\d+$/.test(size))
                        return '';
                    size = parseInt(size);
                }
                if (size === 0)
                    return '0 bytes';
                var result = Math.floor(Math.log(size) / Math.log(1024));
                return String((size / Math.pow(1024, result)).toFixed(2)).replace(r, ',')
                    + (unit ? " " + array[result] : '');
            };
        })(['bytes', 'kB', 'MB', 'GB', 'TB', 'PB']);
        Formats.moneyKr = (function (hanA, danA) {
            return function (val) {
                if (typeof val === 'number')
                    val = val.toString();
                if (typeof val === 'string' && /^\d+$/.test(val)) {
                    var result = '', han = void 0, str = void 0, i = 0, l = val.length;
                    for (; i < l; i++) {
                        str = '';
                        han = hanA[val[l - (i + 1)]];
                        if (han != "")
                            str = han + danA[i];
                        if (i == 4)
                            str += "만";
                        if (i == 8)
                            str += "억";
                        result = str + result;
                    }
                    return result || '';
                }
                return '';
            };
        })(["", "일", "이", "삼", "사", "오", "육", "칠", "팔", "구", "십"], ["", "십", "백", "천", "", "십", "백", "천", "", "십", "백", "천"]);
        // {{obj}}
        function replaceByObj(str, obj) {
            var f;
            return str.replace(/{{[^{}]+}}/g, function (_, g) {
                f = obj[g];
                if (f == null)
                    return '';
                else if (typeof f === 'function')
                    return f.call(obj);
                else
                    return '';
            });
        }
        Formats.replaceByObj = replaceByObj;
        // HTML 이스케이프
        Formats._htmlEscape = (function () {
            var escape = /&lt;|&gt;|&nbsp;|&amp;|&quot;|&apos;/g;
            function _change(c) {
                switch (c) {
                    case '&lt;':
                        return '<';
                    case '&gt;':
                        return '>';
                    case '&nbsp;':
                        return ' ';
                    case '&amp;':
                        return '&';
                    case '&quot;':
                        return '"';
                    case '&apos;':
                        return '\'';
                    default:
                        return c;
                }
            }
            return function (str) {
                return str.replace(escape, function (s) { return _change(s); });
            };
        })();
        var r_num = /^[-+]?\d+$/, r_num_replace = /\B(?=(\d{3})+(?!\d))/g;
        Formats.number = function (val) {
            if (typeof val === 'number')
                val = val.toString();
            if (typeof val === 'string' && r_num.test(val))
                return val.replace(r_num_replace, ",");
            return '0';
        };
    })(Formats = exports.Formats || (exports.Formats = {}));
}).apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ }),

/***/ 4:
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__, exports], __WEBPACK_AMD_DEFINE_RESULT__ = (function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var HTML;
    (function (HTML) {
        HTML.unCamelCase = (function (r_data, r_up, fn) {
            return function (s) { return s.replace(r_data, '').replace(r_up, fn); };
        })(/^data-/, /-([^-])/g, function (_, i) { return i.toUpperCase(); });
        var r = /{{(.*?)}}/g, r_compile_test = /{{[^{}]+}}/;
        function replaceHTML(str, obj) {
            return str.replace(r, function (_, p) {
                return obj[p] == null ? '' : obj[p];
            });
        }
        HTML.replaceHTML = replaceHTML;
        function compile(str) {
            if (!r_compile_test.test(str))
                return function () { return str; };
            var i = 0, l = str.length, s = 0, e = 0, array = [], size = 0;
            var _loop_1 = function () {
                if ((s = str.indexOf('{{', i)) !== -1) {
                    var $v_1 = str.substring(i, s);
                    array[size++] = function () { return $v_1; };
                    e = str.indexOf('}}', s += 2);
                    // _를 가지고 있을때만 Function 생성
                    var ss_1 = str.substring(s, e), $fn = ss_1.indexOf('_') === -1 ?
                        function (obj) { return obj == null ? '' : (typeof obj[ss_1] === 'function' ? obj[ss_1]() : obj[ss_1]); } :
                        new Function('_', 'return _ == null ? "" : (' + ss_1 + ');');
                    array[size++] = $fn;
                    i = e + 2;
                }
                else {
                    var $v_2 = str.substring(i, l);
                    array[size++] = function () { return $v_2; };
                    i = l;
                }
            };
            while (i !== l) {
                _loop_1();
            }
            return function (obj) {
                var i = 0, result = [];
                while (i < size) {
                    result[i] = array[i++](obj);
                }
                return result.join('');
            };
        }
        HTML.compile = compile;
        var r_ease = /^\/+|\/+$/, r_split = /\//, template = '<li data-active="false">' +
            '<i data-child="{{!!_.childs}}">&gt;</i>' +
            '<a href="{{href}}">{{name}}</a>' +
            '{{_.childs ? "<ul>" + _.childs + "</ul>" : ""}}' +
            '</li>';
        function a(str, obj) {
            if (obj === void 0) { obj = {}; }
            var s = str.replace(r_ease, '').split(r_split), i = 0, l = s.length, v;
            for (; i < l; i++) {
                obj = (obj[(v = s[i])] || (obj[v] = {}));
            }
        }
        function toObject(list, obj) {
            if (obj === void 0) { obj = {}; }
            if (typeof list === 'string')
                a(list, obj);
            else {
                var l = list.length;
                while (l-- > 0)
                    a(list[l], obj);
            }
            return obj;
        }
        HTML.toObject = toObject;
        function $createHTML($com, obj, name, url) {
            if (obj == null)
                return '';
            var p, c, array = [];
            for (p in obj) {
                if (c = $createHTML($com, obj[p], p, (url ? url + '/' + p : p)))
                    array.push(c);
            }
            return $com({ href: url, name: name, childs: array.join('') });
        }
        function createTree(values, html, rootName) {
            if (html === void 0) { html = template; }
            if (rootName === void 0) { rootName = 'root'; }
            var c = document.createElement('div');
            c.innerHTML = '<ul>' + $createHTML(compile(html), toObject(values), rootName, '') + '</ul>';
            c = c.firstElementChild;
            // <a> 엘리먼트들을 미리 땡겨놓는다.
            var anchors = c.querySelectorAll('a[href]'), ctrl = {
                element: c,
                active: function (path) {
                    var l = anchors.length, anchor;
                    while (l-- > 0) {
                        anchor = anchors[l];
                        if (path.indexOf(anchor.getAttribute('href')) === 0) {
                            anchor.parentElement.setAttribute('data-active', 'true');
                        }
                        else {
                            anchor.parentElement.setAttribute('data-active', 'false');
                        }
                    }
                },
                handler: null
            };
            c.addEventListener('click', function (e) {
                var target = e.target;
                if (target['href']) {
                    ctrl.handler && ctrl.handler(target.getAttribute('href'), e);
                    e.preventDefault();
                }
                else if (/i/i.test(target.tagName)) {
                    var p = target.parentElement;
                    p.setAttribute('data-active', p.getAttribute('data-active') === 'true' ? 'false' : 'true');
                }
            });
            return ctrl;
        }
        HTML.createTree = createTree;
        function createChildren(html) {
            var div = document.createElement('div'), children, l, i = 0, pos = 0, c, array = [];
            div.innerHTML = html;
            children = div.children;
            l = children.length;
            while (i < l) {
                if ((c = children[i++]) && c.nodeType === 1) {
                    array[pos++] = c;
                }
            }
            return array;
        }
        function create(html, handler) {
            var children = createChildren(html), l, i;
            if (typeof handler !== 'function')
                return children;
            if (l = children.length) {
                i = 0;
                while (i < l)
                    handler(children[i], i++);
            }
        }
        HTML.create = create;
        function createFragment(html) {
            var frag = document.createDocumentFragment();
            if (typeof html === 'string')
                create(html, function (v) { return frag.appendChild(v); });
            else {
                var l = html.length;
                while (l-- > 0)
                    frag.insertBefore(html[l], frag.firstChild);
            }
            return frag;
        }
        HTML.createFragment = createFragment;
        var r_script = /script/i, r_template = /template/i;
        function templateMap(html) {
            var result = { doc: {}, com: {} }, array = createChildren(html), l = array.length, e;
            while (l-- > 0) {
                e = array[l];
                if (e.id) {
                    if (r_script.test(e.tagName)) {
                        e.type.indexOf('html') !== -1 && (result.com[e.id] = compile(e.innerText));
                    }
                    if (r_template.test(e.tagName))
                        (result.doc[e.id] = createFragment(e.children));
                }
            }
            return result;
        }
        HTML.templateMap = templateMap;
        /*
         *  2018-09-01
         *  나의 @Template 프레임워크를 대체할 새로운 개발 패러다임이 탄생했다.
         *
         *  @Template는 HTMLElement와 객체를 1:1로 맵핑하는 패러다임이었다.
         *  매우 훌륭한 프레임워크지만, 계속 사용하다보니 유지보수할때 코드읽기가 불편한 점이 있었다.
         *  특히 template html이 여기저기 조각난채로 배치되어있다보니 최종 DOM tree에 대한 이미징이 부족했다.
         *
         *  이를 개선한 것이 바로 이 html프레임워크다.
         *  html 프레임워크는 엘리먼트를 DOM이 아닌 문자열로 다룬다.
         *  html template는 조각난채로 여기저기 배회할 필요가 없다.
         *  사용방법은 아래 코드를 참조하자.
         *
         */
        var r_replace_name = /:(:)?([^>]+)>$/, r_eraser = /\s+::?[^>]+>/g;
        /*
         *  템플릿 가운데 치환자로 변환할 위치를 설정하는 클래스
         *  하위 엘리먼트부터 상위로 올라가므로 시작 index는 점점 작은 숫자가 들어온다고 보면 된다.
         */
        var ParseIndex = /** @class */ (function () {
            function ParseIndex() {
                this.values = [];
            }
            ParseIndex.prototype.setVal = function (s, end, name) {
                var _a = this, values = _a.values, length = _a.values.length, i = 0, v, nVal = [], nI = 0;
                while (length-- > 0) {
                    v = values[length];
                    if (s < v.start && v.end < end)
                        void 0;
                    else
                        nVal[nI++] = v;
                }
                nVal.push({ start: s, end: end, name: name });
                this.values = nVal;
                return this;
            };
            ParseIndex.prototype.replace = function (html) {
                var list = this.values.sort(function (a, b) { return a.start - b.start; }), v, pos = 0, l = list.length, i = 0, result = [], index = 0;
                for (; i < l; i++) {
                    v = list[i];
                    result[index++] = html.substring(pos, v.start);
                    result[index++] = v.name == null ? '' : '{{' + v.name + '}}';
                    pos = v.end;
                }
                if (html.length > pos)
                    result[index++] = html.substring(pos);
                return result.join('');
            };
            return ParseIndex;
        }());
        /*
         *  html 문자열을 파싱한다.
         *
         *  ① 여는 태그를 순회하며 위치정보와 메타정보를 스택에 저장한다.
         *  ② 닫는 태그가 나오면 스택에 저장된 것들을 차례로 꺼내어
         *     파싱 로직을 실행한다.
         *
         *  간단한 접근법이지만, html문서를 파싱하는데 매우 강력한 기법이다.
         *
         */
        function htmlParser(html) {
            var parseIndex = new ParseIndex(), result = {}, pos = 0, tagNames = [], startPos = [], lines = [], index = 0;
            while ((pos = html.indexOf('<', pos)) !== -1) {
                var l = html.indexOf('>', pos) + 1; // <...>
                // ① 시작 태그
                if (html[pos + 1] !== '/') {
                    var t = pos + 1;
                    // tagName 읽어들이고, 스택에 쌓기
                    while (t < l && html[++t] !== '/' && html[t] !== ' ' && html[t] !== '>')
                        ;
                    tagNames[index] = html.substring(pos + 1, t);
                    lines[index] = html.substring(pos, l);
                    startPos[index] = pos;
                    index++;
                }
                // ② 끝 태그
                else {
                    var t = pos + 2, tagName = void 0;
                    // tagName을 이용해 스택 꺼내기
                    while (t < l && html[++t] !== ' ' && html[t] !== '>')
                        ;
                    tagName = html.substring(pos + 2, t);
                    /*
                     *  아래 코드는 한가지 중요한 로직을 행간에 담고 있다.
                     *
                     *  닫는 태그가 없는 엘리먼트가 있다.
                     *  이것들은 스택에 쌓여있다가, 닫는 태그가 출현하면 그 태그명을 가진 스택이 나올때까지
                     *  루프를 돌리는 와중에 스택에서 해소되어진다.
                     */
                    while (index-- > 0) {
                        var 
                        /*
                         *  own은 현재 출현한 닫는 태그가 현재 순번의 스택과 같은 것인지 알려주는 플래그다.
                         *  아니라면 닫기 태그가 없는 태그이므로, endIndex를 다시 계산한다.
                         */
                        own = tagNames[index] === tagName, startIndex = startPos[index], endIndex = own ? l : html.indexOf('>', startIndex) + 1, line = lines[index], match = r_replace_name.exec(line);
                        //
                        if (match) {
                            var save = match[1], name_1 = match[2];
                            if (save)
                                result[name_1] = compile(html.substring(startIndex, endIndex).replace(r_eraser, '>'));
                            parseIndex.setVal(startIndex, endIndex, name_1);
                        }
                        if (own)
                            break;
                    }
                }
                // 끝부분 확인
                pos = l;
            }
            // 변수 표현식에서 쉽게 표기하기 위해 배열로 내보낸다.
            /*
             *  let [create, {val1, val2}] = htmlParse()
             */
            return [compile(parseIndex.replace(html)), result];
        }
        HTML.htmlParser = htmlParser;
    })(HTML = exports.HTML || (exports.HTML = {}));
}).apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ })

/******/ });