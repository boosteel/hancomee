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
/******/ 	return __webpack_require__(__webpack_require__.s = 31);
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

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__, exports, __webpack_require__(3)], __WEBPACK_AMD_DEFINE_RESULT__ = (function (require, exports, StringBuffer_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    function log(a) {
        console.log(a);
        return a;
    }
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
        var r_replace_name = /:(:)?([^>\s]+)>$/, r_eraser = /\s+::?[^>\s]+>/g;
        /*
         *  템플릿 가운데 치환자로 변환할 위치를 설정하는 클래스
         *  하위 엘리먼트부터 상위로 올라가므로 시작 index는 점점 작은 숫자가 들어온다고 보면 된다.
         */
        var ParseIndex = /** @class */ (function () {
            function ParseIndex(html) {
                this.html = html;
                this.values = [];
                this.result = {};
            }
            // 저장되지 않는 단순 마커(:value)를 위한 추가메서드
            ParseIndex.prototype.remove = function (s, e) {
                var _a = this, values = _a.values, l = _a.values.length, i = 0, newValues = [], ni = 0;
                for (; i < l; i++) {
                    // 매치된건 없앤다.
                    if (values[i].start > s && values[i].end < e)
                        void 0;
                    else
                        newValues[ni++] = values[i];
                }
                this.values = newValues;
            };
            // 저장되는 마커(::value)를 위한 메서드
            ParseIndex.prototype.loop = function (s, e) {
                var _a = this, html = _a.html, values = _a.values, l = _a.values.length, buf = new StringBuffer_1.StringBuffer(), pos = s, i = 0, newValues = [], ni = 0;
                for (; i < l; i++) {
                    // 매치된건 없앤다.
                    if (values[i].start > s && values[i].end < e) {
                        buf.append(html.substring(pos, values[i].start))
                            .append('{{').append(values[i].name).append('}}');
                        pos = values[i].end;
                    }
                    else {
                        newValues[ni++] = values[i];
                    }
                }
                if (pos < e)
                    buf.append(html.substring(pos, e));
                this.values = newValues;
                return buf.toString().replace(r_eraser, '>');
            };
            // new
            ParseIndex.prototype.setV = function (s, e, name, save) {
                if (save)
                    this.result[name] = compile(this.loop(s, e));
                else
                    this.remove(s, e);
                this.values.push({ start: s, end: e, name: name });
                return this;
            };
            // new
            ParseIndex.prototype.getResult = function () {
                return [compile(this.loop(0, this.html.length)), this.result];
            };
            return ParseIndex;
        }());
        function htmlParser(html, handler) {
            var parseIndex = new ParseIndex(html), pos = 0, tagNames = [], startPos = [], lines = [], index = 0;
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
                            parseIndex.setV(startIndex, endIndex, name_1, !!save);
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
            var _a = parseIndex.getResult(), $c = _a[0], result = _a[1];
            parseIndex = null;
            return handler ? handler($c, result) : [$c, result];
        }
        HTML.htmlParser = htmlParser;
    })(HTML = exports.HTML || (exports.HTML = {}));
}).apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__, exports], __WEBPACK_AMD_DEFINE_RESULT__ = (function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var StringBuffer = /** @class */ (function () {
        function StringBuffer(init) {
            this.array = [];
            this.i = 0;
            if (init)
                this.append(init);
        }
        StringBuffer.prototype.reset = function () {
            this.array = [];
            this.i = 0;
            return this;
        };
        StringBuffer.prototype.prepend = function (v) {
            this.array.unshift(v);
            this.i++;
            return this;
        };
        StringBuffer.prototype.append = function (v) {
            var array = this.array;
            if (!Array.isArray(v))
                array[this.i++] = v;
            else {
                var i = 0, u = this.i, l = v.length;
                while (i < l)
                    array[u++] = v[i++];
                this.i = u;
            }
            return this;
        };
        StringBuffer.prototype.toString = function () {
            return this.array.join('');
        };
        return StringBuffer;
    }());
    exports.StringBuffer = StringBuffer;
}).apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ }),
/* 4 */
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
/* 5 */
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
/* 6 */
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;/**
 * Created by hellofunc on 2017-05-06.
 */
!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__, exports, __webpack_require__(0), __webpack_require__(4)], __WEBPACK_AMD_DEFINE_RESULT__ = (function (require, exports, core_1, access_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var hasOwn = {}.hasOwnProperty, hasOwnProperty = function (obj, value) { return hasOwn.call(obj, value); }, r_url = /(https?:\/\/.*?\/)?([^\?]+)\??([^#]+)?#?(.*)/;
    var Search = /** @class */ (function () {
        function Search() {
        }
        Search.prototype.reset = function (search) {
            if (search === void 0) { search = location.search; }
            return this.extend(Search.toObject(search));
        };
        Search.prototype.extend = function (obj) {
            var p;
            for (p in obj) {
                this[p] = obj[p];
            }
            return this;
        };
        Search.prototype.hash = function () {
            location.hash = this.toString();
            return this;
        };
        Search.prototype.queryString = function (obj) {
            if (obj)
                obj = core_1.$extend(core_1.$extend({}, obj), this);
            else
                obj = this;
            return Search.toSearch(obj);
        };
        Search.prototype.toString = function () {
            return Search.toSearch(this);
        };
        return Search;
    }());
    exports.Search = Search;
    (function (Search) {
        var primitive = access_1.Access.primitive;
        var r_n = /&/;
        function create() {
            return new Search().reset();
        }
        Search.create = create;
        /*
         *  쿼리 문자열 비교.
         *  순서만 다르고 같은 값으로 이루어진 쿼리의 경우 true가 된다.
         */
        function equals(a, b) {
            if (a === b)
                return true;
            if (a == null || b == null)
                return false;
            if (a.length != b.length)
                return false;
            var an = a.split(r_n), bn = b.split(r_n), len = an.length;
            while (len-- > 0)
                if (bn.indexOf(an[len]) === -1)
                    return false;
            return true;
        }
        Search.equals = equals;
        // Object  ====>  querystring
        function toSearch(obj, prefix) {
            if (prefix === void 0) { prefix = ''; }
            if (core_1.isEmptyObject(obj))
                return '';
            var array = [], value;
            var _loop_1 = function (key) {
                value = obj[key];
                if (key[0] === '_' || key[0] === '$' || value == null || typeof value === 'function' || !hasOwnProperty(obj, key))
                    return "continue";
                if (core_1.isPlainObject(value)) {
                    array.push(toSearch(value, prefix + key + '.'));
                }
                else if (Array.isArray(value)) {
                    array = array.concat(value.map(function (v) { return key + '=' + encodeURIComponent(v); }));
                }
                else
                    array.push(prefix + key + '=' + encodeURIComponent(value));
            };
            for (var key in obj) {
                _loop_1(key);
            }
            return array.join("&");
        }
        Search.toSearch = toSearch;
        // querystring  ====>  Object
        function toObject(query, dest) {
            var obj = {};
            if (query[0] === '?')
                query = query.slice(1);
            query.split(/&/)
                .filter(function (a) { return a && a.indexOf('=') !== -1; })
                .forEach(function (v) {
                var _a = v.split(/=/), key = _a[0], _value = _a[1], value = access_1.Access.access(obj, key);
                // decoding
                _value = primitive(decodeURIComponent(_value));
                // key가 같은 경우 array로
                if (value) {
                    if (!Array.isArray(value))
                        value = [value];
                    value.push(_value);
                }
                else
                    value = _value;
                access_1.Access.access(obj, key, value, true);
            });
            if (dest)
                obj = core_1.$extend(dest, obj);
            return obj;
        }
        Search.toObject = toObject;
    })(Search = exports.Search || (exports.Search = {}));
    exports.Search = Search;
    var URLManager = /** @class */ (function () {
        function URLManager(fullURL) {
            this.fullURL = fullURL;
            this.host = '';
            this.pathname = '';
            this.search = '';
            this.hash = '';
            var exec = r_url.exec(fullURL);
            if (exec) {
                this.host = exec[1] || '';
                // 앞의 /는 삭제한다.
                this.pathname = (exec[2] || '').replace(/^\//, '');
                this.search = exec[3] || '';
                this.hash = exec[4] || '';
            }
        }
        URLManager.prototype.paths = function () {
            return this.path || (this.path = this.pathname.split(/\//));
        };
        URLManager.prototype.equals = function (v) {
            if (v == null)
                return false;
            if (typeof v === 'string')
                v = new URLManager(v);
            if (v.fullURL === this.fullURL)
                return true;
            if (v.host !== this.host)
                return false;
            if (v.pathname !== this.pathname)
                return false;
            if (!Search.equals(v.search, this.search))
                return false;
            if (v.hash !== this.hash)
                return false;
            return true;
        };
        return URLManager;
    }());
    exports.URLManager = URLManager;
    (function (URLManager) {
        function create(url) {
            return new URLManager(url);
        }
        URLManager.create = create;
        // /admin/:name?music=:audio, {name: '고정철', audio: '네임'}  ===>   /admin/고정철?music=네임
        // 해당값이 없을시  키워드 부분을 삭제해버린다.
        function queryExp(str, obj) {
            var _a = str.split(/\?/), url = _a[0], query = _a[1], URL = url.split(/\//).reduce(function (r, v) {
                if (v[0] === ':' && (v = v.slice(1))) {
                    var value = access_1.Access.access(obj, v);
                    value != null && r.push(value);
                }
                else
                    r.push(v);
                return r;
            }, []).join('/'), QUERY;
            // 쿼리 문자열이 있으면?
            if (query) {
                QUERY = query.split(/&/).reduce(function (r, v) {
                    var _a = v.split(/\=/), prop = _a[0], value = _a[1];
                    if (value[0] === ':' && (value = value.slice(1))) {
                        var u = access_1.Access.access(obj, value);
                        u != null && r.push(prop + '=' + u);
                    }
                    else
                        r.push(v);
                    return r;
                }, []).join('&');
            }
            return QUERY ? URL + '?' + QUERY : URL;
        }
        URLManager.queryExp = queryExp;
    })(URLManager = exports.URLManager || (exports.URLManager = {}));
    exports.URLManager = URLManager;
}).apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ }),
/* 7 */
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;/**
 * Created by hellofunc on 2017-02-28.
 */
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__, exports, __webpack_require__(9), __webpack_require__(5), __webpack_require__(0), __webpack_require__(4)], __WEBPACK_AMD_DEFINE_RESULT__ = (function (require, exports, NameMap_1, arrays_1, core_1, access_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var Events = /** @class */ (function () {
        function Events(target, type, handler) {
            this.target = target;
            this.type = type;
            this.handler = handler;
            this.isActive = false;
            this.on();
        }
        Events.prototype.setTarget = function (t) {
            var _a = this, target = _a.target, isActive = _a.isActive;
            if (t === target)
                return this;
            if (isActive)
                this.off();
            this.target = t;
            if (isActive)
                this.on();
            return this;
        };
        Events.prototype.on = function () {
            if (!this.isActive) {
                this.target.addEventListener(this.type, this.handler);
                this.isActive = true;
            }
            return this;
        };
        Events.prototype.off = function () {
            if (this.isActive) {
                this.target.removeEventListener(this.type, this.handler);
                this.isActive = false;
            }
            return this;
        };
        return Events;
    }());
    exports.Events = Events;
    var EventsGroup = /** @class */ (function () {
        function EventsGroup() {
            this.isActive = true;
            this.map = new NameMap_1.NameMap();
        }
        EventsGroup.prototype.register = function (element, type, handler) {
            if (typeof type === 'string') {
                var e = new Events(element, type.split(/\./)[0], handler);
                if (!this.isActive)
                    e.off();
                this.map.add(type, e);
            }
            else {
                if (!this.isActive)
                    element.off();
                this.map.add(element.type, element);
            }
            return this;
        };
        EventsGroup.prototype.on = function (n) {
            if (!this.isActive) {
                this.map.get(n).forEach(function (v) { return v.on(); });
                this.isActive = true;
            }
            return this;
        };
        EventsGroup.prototype.off = function (n) {
            if (this.isActive) {
                this.map.get(n).forEach(function (v) { return v.off(); });
                this.isActive = false;
            }
            return this;
        };
        return EventsGroup;
    }());
    exports.EventsGroup = EventsGroup;
    var TargetEvent = /** @class */ (function () {
        function TargetEvent() {
            this.isActive = false;
            this.events = [];
        }
        TargetEvent.prototype.register = function (type, handler) {
            this.events.push({ type: type, handler: handler });
            return this;
        };
        TargetEvent.prototype.on = function (own) {
            var target = this.target;
            if (target) {
                if (target === own)
                    return this;
                this.off();
            }
            this.events.forEach(function (v) { return own.addEventListener(v.type, v.handler); });
            this.target = own;
            this.isActive = true;
            return this;
        };
        TargetEvent.prototype.off = function () {
            var target = this.target;
            if (target) {
                this.events.forEach(function (v) { return target.removeEventListener(v.type, v.handler); });
                this.isActive = false;
                this.target = null;
            }
            return this;
        };
        return TargetEvent;
    }());
    exports.TargetEvent = TargetEvent;
    (function (Events) {
        var primitive = access_1.Access.primitive;
        function closest(target, selector, ele) {
            var list = target.querySelectorAll(selector), l = list.length;
            while (l-- > 0)
                if (list[l]['contains'](ele))
                    return list[l];
            return null;
        }
        function mine(target, type, handler) {
            return new Events(target, type, function (e) {
                if (e.target === target)
                    return handler.call(this, e);
            });
        }
        Events.mine = mine;
        function bind(target, type, selector, handler) {
            if (handler)
                return new Events(target, type, function (e) {
                    var t = closest(target, selector, e.target);
                    if (t)
                        return handler.call(target, e, t);
                });
            else
                return new Events(target, type, selector);
        }
        Events.bind = bind;
        function map(target, map) {
            var group = new EventsGroup(), p;
            for (p in map)
                typeof map[p] === 'function' && group.register(target, p, map[p].bind(map));
            return group;
        }
        Events.map = map;
        /*
         *  키 입력에 따라 핸들러 호출
         */
        Events.keyDown = (function () {
            var KeyEvents = /** @class */ (function (_super) {
                __extends(KeyEvents, _super);
                function KeyEvents(element, keys, handler) {
                    var _this = _super.call(this, element, 'keyevent', handler) || this;
                    _this.keys = keys;
                    _this.on();
                    return _this;
                }
                KeyEvents.prototype.on = function () {
                    if (keyListener.indexOf(this) === -1) {
                        keyListener.push(this);
                        KEY_LISTEN.on();
                        this.isActive = true;
                    }
                    return this;
                };
                KeyEvents.prototype.off = function () {
                    var i = keyListener.indexOf(this);
                    if (i !== -1) {
                        keyListener.splice(i, 1);
                        keyListener.length || KEY_LISTEN.off();
                        this.isActive = false;
                    }
                    return this;
                };
                return KeyEvents;
            }(Events));
            var keyListener = [], 
            /*
             *  ① document가 키 입력을 다 받는다.
             *  ② 등록된 element위에 마우스가 위치할때, 해당 키 입력에 따라 handler를 호출한다.
             */
            KEY_LISTEN = (function () {
                var keys = [];
                // 키 이벤트를 받는 그룹
                return new EventsGroup()
                    .register(document, 'keydown', function (e) {
                    var keyCode = e.keyCode, hovers = core_1.__makeArray(document.querySelectorAll(':hover'));
                    if (keys.indexOf(keyCode) === -1)
                        keys.push(keyCode);
                    keyListener.forEach(function (v) {
                        if (hovers.indexOf(v.target) !== -1 && arrays_1.Arrays.equals(v.keys, keys))
                            v.handler();
                    });
                })
                    .register(document, 'keyup', function (e) {
                    var i = keys.indexOf(e.keyCode);
                    if (i !== -1)
                        keys.splice(i, 1);
                }).off();
            })();
            // on/off 컨트롤러를 반환한다.
            return function keyDown(element, keys, handler) {
                return new KeyEvents(element, keys, handler);
            };
        })();
        // 해당 횟수만큼 이벤트를 리스닝한다.
        function count(element, type, handler, count) {
            if (count === void 0) { count = 1; }
            if (count < 1)
                return;
            var dispatcher = function () {
                var args = [];
                for (var _i = 0; _i < arguments.length; _i++) {
                    args[_i] = arguments[_i];
                }
                count--;
                var rv = handler.apply(element, args);
                count < 1 && element.removeEventListener(type, dispatcher);
                return rv;
            };
            element.addEventListener(type, dispatcher);
        }
        Events.count = count;
        function listener(element, type, handler) {
            return new Events(element, type, handler);
        }
        Events.listener = listener;
        function listenGroup() {
            return new EventsGroup();
        }
        Events.listenGroup = listenGroup;
        function trigger(target, type, bubbles, cancelable) {
            if (bubbles === void 0) { bubbles = true; }
            if (cancelable === void 0) { cancelable = true; }
            if (typeof target[type] === 'function')
                target[type]();
            else {
                var e_1 = document.createEvent('Events');
                e_1.initEvent(type, bubbles, cancelable);
                // 이미 진행중인 이벤트가 있다면 버블링 후에 동작하도록
                setTimeout(function () { return target.dispatchEvent(e_1); }, 0);
            }
        }
        Events.trigger = trigger;
        function custom(target, type, detail, bubbles, cancelable) {
            if (bubbles === void 0) { bubbles = true; }
            if (cancelable === void 0) { cancelable = true; }
            var e = document.createEvent('CustomEvent');
            e.initCustomEvent(type, bubbles, cancelable, detail);
            setTimeout(function () { return target.dispatchEvent(e); }, 0);
        }
        Events.custom = custom;
        function eventWorks(element, type, handlers, attrName) {
            if (attrName === void 0) { attrName = 'data-handler'; }
            var target, vName = attrName + '-value', isFun = typeof handlers === 'function' ? handlers : null;
            return new Events(element, type, function (e) {
                target = e.target;
                while (target && target !== element) {
                    if (target.hasAttribute(attrName)) {
                        var prop = target.getAttribute(attrName), val = target.getAttribute(vName);
                        if (isFun)
                            return isFun(prop, val, target, e);
                        else if (handlers[prop])
                            handlers[prop](target.getAttribute(vName), target, e);
                        return;
                    }
                    target = target.parentElement;
                }
            });
        }
        Events.eventWorks = eventWorks;
        /*
         *  event가 발생하면 target 엘리먼트부터 상위엘리먼트로 올라가면서
         *  어트리뷰트를 읽어 데이터맵을 만들어준다.
         */
        function read(target, limit, obj) {
            var event, n, v, vv, fn;
            while (target && limit !== target) {
                if (event == null) {
                    if (event = target.getAttribute('data-event')) {
                        if (typeof obj['setTarget'] === 'function')
                            obj['setTarget'](target);
                        else
                            obj.target = target;
                    }
                }
                // target 자체를
                if (v = target.getAttribute('data-self')) {
                    // set{Value}()가 있으면 거기에 넣어준다.
                    if (typeof (fn = obj['set' + v[0].toUpperCase() + v.slice(1)]) === 'function')
                        fn(target);
                    else
                        obj[v] = target;
                }
                // property 이름
                if (v = target.getAttribute('data-property')) {
                    // 값
                    if (vv = target.getAttribute('data-value')) {
                        // set{Value}()가 있으면 거기에 넣어준다.
                        if (typeof (fn = obj['set' + v[0].toUpperCase() + v.slice(1)]) === 'function')
                            fn(primitive(vv));
                        else
                            obj[v] = primitive(vv);
                    }
                }
                target = target.parentElement;
            }
            return event;
        }
        // 데이터가 있을때만
        function propertyMap(target, type, handlers, factory) {
            return new Events(target, type, function (e) {
                var obj = factory ? new factory(e) : {}, p = read(e.target, target, obj);
                handlers[p] && handlers[p](obj, e);
            });
        }
        Events.propertyMap = propertyMap;
    })(Events = exports.Events || (exports.Events = {}));
    exports.Events = Events;
}).apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ }),
/* 8 */
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__, exports, __webpack_require__(0), __webpack_require__(1), __webpack_require__(5), __webpack_require__(2)], __WEBPACK_AMD_DEFINE_RESULT__ = (function (require, exports, core_1, dom_1, arrays_1, html_1) {
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
        var unCamelCase = html_1.HTML.unCamelCase;
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
/* 9 */
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__, exports, __webpack_require__(5)], __WEBPACK_AMD_DEFINE_RESULT__ = (function (require, exports, arrays_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var NameMap = /** @class */ (function () {
        function NameMap() {
            this.map = {};
            this.datas = []; // 중복방지를 위한 리스트
        }
        NameMap.prototype.get = function (name) {
            if (typeof name !== 'string')
                return this.datas;
            var map = this.map, _a = name.split(/\./), key = _a[0], args = _a.slice(1), list = map[key];
            if (!list)
                return [];
            return list.filter(function (v) { return arrays_1.Arrays.startWith(args, v.names); }).map(function (v) { return v.data; });
        };
        NameMap.prototype.add = function (name, data) {
            if (this.datas.indexOf(data) === -1) {
                var map = this.map, _a = name.split(/\./), key = _a[0], args = _a.slice(1);
                (map[key] || (map[key] = [])).push({ names: args, data: data });
                this.datas.push(data);
            }
            return this;
        };
        NameMap.prototype.remove = function (name) {
            var _a = this, map = _a.map, datas = _a.datas, _b = name.split(/\./), key = _b[0], args = _b.slice(1), list = map[key];
            if (list) {
                map[key] = list.filter(function (v) {
                    if (arrays_1.Arrays.startWith(args, v.names)) {
                        datas.splice(datas.indexOf(v.data), 1);
                        return false;
                    }
                    return true;
                });
            }
            return this;
        };
        return NameMap;
    }());
    exports.NameMap = NameMap;
}).apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ }),
/* 10 */
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__, exports], __WEBPACK_AMD_DEFINE_RESULT__ = (function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var Calcurator;
    (function (Calcurator) {
        // num1이 num1c로 변할때 num2의 값
        function ratio(num1, num1c, num2) {
            return num2 + (num2 * ((num1c - num1) / num1));
        }
        Calcurator.ratio = ratio;
    })(Calcurator = exports.Calcurator || (exports.Calcurator = {}));
    var ImageCal;
    (function (ImageCal) {
        function __tilt(rotate, r) {
            if (r === void 0) { r = Math.abs(rotate % 360); }
            return r === 90 || r === 270;
        }
        function __ratio(num1, num1c, num2) {
            return num2 + (num2 * ((num1c - num1) / num1));
        }
        // [x, y, width, height]
        function alignment(w, h, rotate, W, H) {
            if (__tilt(rotate)) {
                var maxHeight_1 = __ratio(w, H, h);
                if (maxHeight_1 > W) {
                    w = __ratio(h, W, w);
                    return [(W - w) / 2, (H - W) / 2, w, W];
                }
                else {
                    w = H;
                    return [(W - w) / 2, (H - maxHeight_1) / 2, w, maxHeight_1];
                }
            }
            var maxHeight = __ratio(w, W, h);
            // 세로를 딱 맞춰야 할 경우
            if (maxHeight > H) {
                w = __ratio(h, H, w);
                return [(W - w) / 2, 0, w, H];
            }
            else {
                h = maxHeight;
                return [0, (H - h) / 2, W, h];
            }
        }
        ImageCal.alignment = alignment;
    })(ImageCal = exports.ImageCal || (exports.ImageCal = {}));
}).apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ }),
/* 11 */,
/* 12 */,
/* 13 */,
/* 14 */
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__, exports, __webpack_require__(10)], __WEBPACK_AMD_DEFINE_RESULT__ = (function (require, exports, calcurator_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var MediaElement = /** @class */ (function () {
        function MediaElement() {
            this.isLoad = false;
            this.mediaWidth = 0;
            this.mediaHeight = 0;
        }
        MediaElement.prototype.render = function (rotate) {
            if (rotate === void 0) { rotate = 0; }
            if (this.element.parentElement) {
                var _a = this, mediaWidth = _a.mediaWidth, mediaHeight = _a.mediaHeight, _b = _a.element, style = _b.style, parent_1 = _b.parentElement, _c = calcurator_1.ImageCal.alignment(mediaWidth, mediaHeight, rotate, parent_1.offsetWidth, parent_1.offsetHeight), left = _c[0], top_1 = _c[1], width = _c[2], height = _c[3];
                style.transform = 'rotate(' + rotate + 'deg)';
                style.top = top_1 + 'px';
                style.left = left + 'px';
                style.width = width + 'px';
                style.height = height + 'px';
            }
            return this;
        };
        MediaElement.prototype.offScreen = function () {
            return this;
        };
        MediaElement.prototype.onScreen = function () {
            return this;
        };
        return MediaElement;
    }());
    exports.MediaElement = MediaElement;
    (function (MediaElement) {
        var r_erase = /\/+$/, types = [
            {
                check: /jpeg|jpg|gif|png|bmp|svg/i,
                factory: /** @class */ (function (_super) {
                    __extends(A, _super);
                    function A(media) {
                        var _this = _super.call(this) || this;
                        var img = _this.element = new Image();
                        img.style.visibility = 'hidden';
                        img.onload = function () {
                            _this.mediaWidth = img.naturalWidth;
                            _this.mediaHeight = img.naturalHeight;
                            _this.render(media.rotate);
                            _this.isLoad = true;
                            img.style.visibility = '';
                        };
                        img.src = src(media);
                        return _this;
                    }
                    return A;
                }(MediaElement)),
            },
            {
                check: /mp4/i,
                factory: /** @class */ (function (_super) {
                    __extends(A, _super);
                    function A(media) {
                        var _this = _super.call(this) || this;
                        var video = _this.element = document.createElement('video'), source = document.createElement('source');
                        video.style.visibility = 'hidden';
                        video.setAttribute('controls', 'true');
                        video.onloadeddata = function () {
                            _this.mediaHeight = video.videoHeight;
                            _this.mediaWidth = video.videoWidth;
                            video.pause();
                            _this.render(media.rotate);
                            _this.isLoad = true;
                            video.style.visibility = '';
                        };
                        video.setAttribute('loop', '');
                        video.appendChild(source);
                        source.src = src(media);
                        return _this;
                    }
                    A.prototype.onScreen = function () {
                        var element = this.element;
                        element.play();
                        return this;
                    };
                    A.prototype.offScreen = function () {
                        this.element.pause();
                        return this;
                    };
                    return A;
                }(MediaElement)),
            }
        ];
        function src(media) {
            return media.path.replace(r_erase, '') + '/' +
                encodeURIComponent(media.filename || '') +
                (media.filetype ? '.' + media.filetype : '');
        }
        MediaElement.src = src;
        function create(media) {
            var i = 0, l = types.length;
            for (; i < l; i++)
                if (types[i].check.test(media.filetype))
                    return new types[i].factory(media);
            return null;
        }
        MediaElement.create = create;
    })(MediaElement = exports.MediaElement || (exports.MediaElement = {}));
    exports.MediaElement = MediaElement;
}).apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ }),
/* 15 */
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__, exports, __webpack_require__(7)], __WEBPACK_AMD_DEFINE_RESULT__ = (function (require, exports, events_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var MediaController = /** @class */ (function () {
        function MediaController(eGroup, _test) {
            this.eGroup = eGroup;
            this._test = _test;
        }
        MediaController.prototype.on = function (ele) {
            this.target = ele;
            this.eGroup.on();
            return this;
        };
        MediaController.prototype.off = function () {
            this.target = null;
            this.eGroup.off();
            return this;
        };
        MediaController.prototype.test = function (media) {
            return this._test.test(media.filetype);
        };
        return MediaController;
    }());
    exports.MediaController = MediaController;
    (function (MediaController) {
        var ctrl = [
            {
                test: /mp4/i,
                factory: function (container, group, context) {
                    group
                        .register(events_1.Events.keyDown(container, [32], function () {
                        var video = context.target.element;
                        video.paused ? video.play() : video.pause();
                    }))
                        .register(events_1.Events.keyDown(container, [37], function () {
                        var video = context.target.element;
                        video.currentTime = video.currentTime - 10;
                    }))
                        .register(events_1.Events.keyDown(container, [39], function () {
                        var video = context.target.element;
                        video.currentTime = video.currentTime + 3;
                    }));
                }
            },
            {
                test: /jpeg|jpg|gif|png|bmp|mp4/i,
                factory: function (container, group, context) {
                }
            }
        ];
        function create(container) {
            return ctrl.map(function (c) {
                var group = new events_1.EventsGroup(), context = new MediaController(group, c.test);
                c.factory(container, group, context);
                return context;
            });
        }
        MediaController.create = create;
    })(MediaController = exports.MediaController || (exports.MediaController = {}));
    exports.MediaController = MediaController;
}).apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ }),
/* 16 */,
/* 17 */
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__, exports, __webpack_require__(18), __webpack_require__(7), __webpack_require__(1), __webpack_require__(8), __webpack_require__(14), __webpack_require__(15), __webpack_require__(6), __webpack_require__(0)], __WEBPACK_AMD_DEFINE_RESULT__ = (function (require, exports, Tree_1, events_1, dom_1, template_1, MediaElement_1, MediaController_1, location_1, core_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var className = dom_1.DOM.className;
    /*
     *  해시 쿼리를 담는 Search 객체
     *  path를 반드시 가지고 있어야 한다.
     */
    var MediaSeach = /** @class */ (function (_super) {
        __extends(MediaSeach, _super);
        function MediaSeach() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            _this.path = '';
            _this.size = 100;
            return _this;
        }
        return MediaSeach;
    }(location_1.Search));
    exports.MediaSeach = MediaSeach;
    /*
     *  Browser를 이용하기 위해서는 이 컨테이너를 상속받아야 한다.
     *
     *  thumbElement: 썸네일 엘리먼트
     *  $template: 미디어 컨테이너
     *
     */
    var MediaContainer = /** @class */ (function () {
        function MediaContainer(mediaElement, media, index) {
            this.mediaElement = mediaElement;
            var p;
            for (p in media)
                this[p] = media[p];
            this.thumbElement = MediaContainer_1.container.cloneNode(false);
            this.$template.setAttribute('data-media-index', index.toString());
            this.thumbElement.appendChild(this.$template);
        }
        MediaContainer_1 = MediaContainer;
        MediaContainer.prototype.onScreen = function (screen) {
            screen.appendChild(this.$template);
            this.mediaElement.onScreen().render(this.rotate);
            return this;
        };
        MediaContainer.prototype.offScreen = function () {
            this.thumbElement.appendChild(this.$template);
            this.mediaElement.offScreen().render(this.rotate);
            window.scrollTo(0, this.thumbElement.offsetTop - (window.innerHeight / 3.5));
            return this;
        };
        MediaContainer.prototype.apply = function () {
            return this;
        };
        var MediaContainer_1;
        MediaContainer.events = null;
        MediaContainer.container = dom_1.DOM.createHTML('<div class="col-sm-2 media-thumbnail"></div>');
        MediaContainer = MediaContainer_1 = __decorate([
            template_1.Template({
                mediaContent: function (ele, attrs, lf) {
                    ele.appendChild(lf.mediaElement.element);
                },
            }),
            __metadata("design:paramtypes", [Object, Object, Number])
        ], MediaContainer);
        return MediaContainer;
    }());
    exports.MediaContainer = MediaContainer;
    var BodyDirective = {
        /*
         *  body는 반드시 [browser] 어트리뷰트를 가져야 한다.
         *
         *  data-media-click 어트리뷰트를 가진 엘리먼트를 클릭하면 browser가 제어하는 click이벤트를 받을 수 있다.
         *
         */
        browser: function (ele, attrs, browser) {
            var _this = this;
            var events = browser.config.events, eventMap = browser.eventMap;
            /*
             *  [data-media-action] 엘리먼트만 이벤트에 참여하게 된다.
             */
            events_1.Events.bind(ele, 'click', function (e) {
                var target = e.target;
                while (target && target !== ele) {
                    if (target.hasAttribute('data-media-click')) {
                        var type = target.getAttribute('data-media-click'), value = target.getAttribute('data-media-value');
                        while (!target.hasAttribute('data-media-index'))
                            if (!(target = target.parentElement))
                                return;
                        var index = parseInt(target.getAttribute('data-media-index')), media = browser.list[index];
                        events[type] && events[type].call(_this, index, value, media, e);
                        eventMap[type] && eventMap[type].call(_this, index, value, media, e);
                        return;
                    }
                    target = target.parentElement;
                }
            });
        },
        /*
         *  폴더 트리 생성
         *  ① 해시에 변화가 있으면, $load() 메서드를 실행시켜준다.
         *  ② browser.setTree()를 통해 폴더 트리를 갱신할 수 있다.
         */
        aside: function (ele, attrs, browser) {
            var $template = browser.$template, _a = browser.config, Search = _a.Search, $load = _a.$load, c = ['loading'], tree = new Tree_1.Tree('tree')
                .appendTo(ele)
                /*
                 *  <a>클릭시 이벤트를 인터셉트해서 정규화된 쿼리문을 hash로 설정한다.
                 */
                .setIntercepter(function (href, tree, e) {
                // 트리를 클릭하면 Search가 초기화 된다.
                browser.search = new Search().extend({ path: href }).hash();
                e.preventDefault();
            }).reset(browser.tree), $change = function () {
                var hash = location.hash.slice(1), search = browser.search;
                className($template, c, true);
                $load(search.reset(hash), browser).then(function () {
                    tree.active(search.path).open(search.path);
                    browser.watcher.apply('#hash');
                    window.scrollTo(0, 0);
                    className($template, c, false);
                });
            };
            window.addEventListener('hashchange', function () { return $change(); });
            $change();
            return {
                tree: function () {
                    var search = browser.search;
                    tree.reset(browser.tree).active(search.path).open(search.path);
                }
            };
        },
        /*
         *  ※미디어의 전체화면
         *
         *  ① 미디어를 전체화면으로 뿌려준다.
         *  ② 휠 이벤트 등을 통해 미디어 리스트를 순회한다.
         *  ③ Media 종류에 따라 각 Media Controller를 on/off한다.
         */
        screen: function (screen, attrs, browser) {
            var active, count = screen.querySelector('.count'), ctrls = MediaController_1.MediaController.create(screen), events = new events_1.EventsGroup()
                .register(screen, 'mousewheel', function (e) {
                $move(e['wheelDelta'] < 0 ? 1 : -1);
                e.preventDefault();
            })
                .register(events_1.Events.keyDown(screen, [38], function () { return $move(-1); }))
                .register(events_1.Events.keyDown(screen, [40], function () { return $move(1); }))
                .register(events_1.Events.keyDown(screen, [27], function () { return $off(); }))
                .register(screen, 'click', function (e) {
                if (e.target['hasAttribute']('media-content')) {
                    $off();
                }
            }).off(), $move = function (num) {
                var list = browser.list, index = list.indexOf(active), next = num + index;
                if (next > -1 && next < list.length) {
                    $off();
                    $on(list[next]);
                }
            }, $on = function (container) {
                if (active !== container) {
                    var mediaElement_1 = container.mediaElement, list = browser.list;
                    ctrls.forEach(function (c) { return c.test(container) ? c.on(mediaElement_1) : c.off(); });
                    events.on();
                    active = container.onScreen(screen);
                    screen.className = 'on';
                    count.textContent = list.indexOf(container) + 1 + ' / ' + list.length;
                }
            }, $off = function () {
                active && active.offScreen();
                active = null;
                ctrls.forEach(function (c) { return c.off(); });
                events.off();
                screen.className = '';
            };
            browser.eventMap.screen = function (i, val, media) { return $on(media); };
        },
        /*
         *  미디어 썸네일을 관리한다.
         */
        mediaList: function (ele, attrs, body) {
            return {
                list: function () {
                    ele.innerHTML = '';
                    if (body.list) {
                        ele.appendChild(body.list.reduce(function (frag, v) {
                            frag.appendChild(v.thumbElement);
                            return frag;
                        }, document.createDocumentFragment()));
                    }
                }
            };
        },
        '$$': function (ele, attrs, body) {
            console.log('$$');
        }
    };
    var Browser = /** @class */ (function () {
        function Browser(config, $template) {
            if ($template === void 0) { $template = document.body; }
            this.config = config;
            this.$template = $template;
            this.list = [];
            this.tree = [];
            this.eventMap = {};
            this.search = new config.Search();
            // compile!!
            template_1.Template.each($template, core_1.extend({}, BodyDirective, config.directive), this.watcher = new template_1.Watcher(this));
        }
        Browser.prototype.setTree = function (tree) {
            this.tree = tree;
            return this;
        };
        Browser.prototype.setValues = function (values) {
            var Media = this.config.Media;
            if (values) {
                this.list = values
                    .map(function (v, i) {
                    var e = MediaElement_1.MediaElement.create(v);
                    e.element.setAttribute('data-media-click', 'screen');
                    return new Media(e, v, i);
                });
            }
            else
                this.list = [];
            return this;
        };
        Browser.prototype.apply = function () {
            this.watcher.apply();
            return this;
        };
        return Browser;
    }());
    exports.Browser = Browser;
}).apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ }),
/* 18 */
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
!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__, exports, __webpack_require__(8), __webpack_require__(1), __webpack_require__(7)], __WEBPACK_AMD_DEFINE_RESULT__ = (function (require, exports, template_1, dom_1, events_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var r_anchor = /a/i, c_active = ['active'], c_open = ['open'];
    var Tree = /** @class */ (function () {
        function Tree(className) {
            if (className === void 0) { className = 'tree'; }
            var _this = this;
            this.eventGroup = new events_1.EventsGroup();
            var ul = this.element = document.createElement('ul');
            ul.className = className;
            this.eventGroup.register(ul, 'click', function (e) {
                var target = e.target;
                if (target.hasAttribute('data-tree-toggle')) {
                    var parent_1 = target.parentElement, doOpen = parent_1.className.indexOf('open') === -1;
                    dom_1.DOM.className(parent_1, ['open'], doOpen);
                }
                if (r_anchor.test(target.tagName)) {
                    if (_this.interceptor) {
                        _this.interceptor(target.getAttribute('href'), _this, e);
                    }
                }
            });
        }
        Tree.prototype.setIntercepter = function (handler) {
            this.interceptor = handler;
            return this;
        };
        Tree.prototype.appendTo = function (ele) {
            ele.appendChild(this.element);
            return this;
        };
        Tree.prototype.active = function (url) {
            if (this.root) {
                this.root.active(url);
            }
            return this;
        };
        Tree.prototype.open = function (url) {
            if (this.root) {
                this.root.open(url);
            }
            return this;
        };
        Tree.prototype.reset = function (names) {
            Tree.create(names, 'root', this);
            this.element.innerHTML = '';
            this.element.appendChild(this.root.$template);
            return this;
        };
        return Tree;
    }());
    exports.Tree = Tree;
    var Menu = /** @class */ (function () {
        function Menu(name, path, parent) {
            this.name = name;
            this.path = path;
            this.parent = parent;
            this.childs = [];
        }
        // apply전에 미리 등록
        Menu.prototype.register = function (v) {
            this.childs.push(v);
            return this;
        };
        Menu.prototype.active = function (url) {
            dom_1.DOM.className(this.$template, c_active, url.indexOf(this.path) !== -1);
            this.childs.forEach(function (c) { return c.active(url); });
            return this;
        };
        Menu.prototype.open = function (url) {
            var childs = this.childs;
            if (childs.length) {
                url.indexOf(this.path) !== -1 && dom_1.DOM.className(this.$template, c_open, true);
                childs.forEach(function (c) { return c.open(url); });
            }
            return this;
        };
        Menu.prototype.apply = function () {
            return this;
        };
        Menu = __decorate([
            template_1.Template('<li>' +
                '<i class="material-icons" data-tree-toggle>keyboard_arrow_right</i>' +
                '<a href></a>' +
                '<ul class="tree"></ul>' +
                '</li>', {
                href: function (ele, attrs, tree) {
                    ele.href = tree.path;
                    ele.textContent = tree.name;
                },
                ul: function (ele, attrs, tree) {
                    if (tree.childs.length) {
                        var f_1 = document.createDocumentFragment();
                        tree.childs.forEach(function (c) { return f_1.appendChild(c.$template); });
                        ele.appendChild(f_1);
                    }
                    else
                        dom_1.DOM.className(tree.$template, 'empty');
                }
            }),
            __metadata("design:paramtypes", [String, String, Menu])
        ], Menu);
        return Menu;
    }());
    (function (Tree) {
        var r_ease = /^\/+|\/+$/, r_split = /\//;
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
        Tree.toObject = toObject;
        function toTemplate(obj, root, prefix) {
            if (root === void 0) { root = new Menu('root', '', null); }
            if (prefix === void 0) { prefix = ''; }
            if (obj) {
                var p = void 0;
                for (p in obj) {
                    var _prefix = prefix + '/' + p;
                    root.register(toTemplate(obj[p], new Menu(p, _prefix, root), _prefix));
                }
            }
            return root;
        }
        function create(names, rootName, tree) {
            if (rootName === void 0) { rootName = 'root'; }
            if (tree === void 0) { tree = new Tree(); }
            var root = toTemplate(toObject(names));
            tree.root = root;
            return tree;
        }
        Tree.create = create;
    })(Tree = exports.Tree || (exports.Tree = {}));
    exports.Tree = Tree;
}).apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ }),
/* 19 */
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;/**
 * Created by hellofunc on 2017-01-23.
 */
!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__, exports], __WEBPACK_AMD_DEFINE_RESULT__ = (function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    function $computeStart(n, size) {
        return (Math.floor((n - 1) / size) * size) + 1;
    }
    // page는 1부터 시작한다.
    var Pager = /** @class */ (function () {
        function Pager(page, totalPages) {
            this.before = -1;
            this.after = -1;
            this.reset(page, totalPages);
        }
        Pager.prototype.reset = function (page, totalPages) {
            if (totalPages === void 0) { totalPages = this.totalPages; }
            this.page = page;
            this.totalPages = totalPages;
            // before
            if (page > 1)
                this.before = page - 1;
            // after
            if (page < totalPages)
                this.after = page + 1;
            return this;
        };
        return Pager;
    }());
    exports.Pager = Pager;
    var PagerTable = /** @class */ (function () {
        function PagerTable(container, col, row) {
            var _this = this;
            this.container = container;
            this.col = col;
            this.row = row;
            container.addEventListener('click', function (e) {
                var target = e.target, num;
                if (num = target.getAttribute('data-page')) {
                    _this._handler.call(_this, parseInt(num), num);
                }
                if (num = target.getAttribute('data-nav')) {
                    _this.render(_this._pager, parseInt(num));
                }
                e.preventDefault();
                e.stopPropagation();
            });
        }
        PagerTable.prototype.render = function (page, viewPage) {
            this._pager = page;
            this.container.innerHTML = Pager.createTable(page, this.col, this.row, viewPage).join('');
            return this;
        };
        PagerTable.prototype.setHandler = function (handler) {
            this._handler = handler;
            return this;
        };
        return PagerTable;
    }());
    exports.PagerTable = PagerTable;
    (function (Pager) {
        function createTable(_a, col, row, _p) {
            var page = _a.page, totalPages = _a.totalPages;
            var size = col * row, tableTotalPage = Math.ceil(totalPages / size), tablePage = _p != null ? _p - 1 : Math.floor((page - 1) / size), start = tablePage * size + 1, pos = 0, i = 0, array = [];
            for (var r = 0; r < row; r++) {
                array[i++] = '<tr>';
                for (var c = 0; c < col; c++, start++, pos++) {
                    if (start === page)
                        array[i++] = '<td class="current"><span>' + start + '</span></td>';
                    else if (start > totalPages)
                        array[i++] = '<td class="disabled"><span>' + start + '</span></td>';
                    else
                        array[i++] = '<td class="link"><span data-page="' + start + '">' + start + '</span></td>';
                }
                array[i++] = '</tr>';
            }
            return [
                '<div>' +
                    '<span class="prev' + (tablePage === 0 ? ' disabled' : '" data-nav="' + tablePage) + '">◀</span>' +
                    '<span class="number">' + (tablePage + 1) + '</span>' +
                    '<span class="next' + (tablePage > (tableTotalPage - 2) ? ' disabled' : '" data-nav="' + (tablePage + 2)) + '">▶</span>' +
                    '</div>',
                '<table>' + array.join('') + '</table>'
            ];
        }
        Pager.createTable = createTable;
    })(Pager = exports.Pager || (exports.Pager = {}));
    exports.Pager = Pager;
}).apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ }),
/* 20 */
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__, exports, __webpack_require__(1)], __WEBPACK_AMD_DEFINE_RESULT__ = (function (require, exports, dom_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var Toggle;
    (function (Toggle) {
        var className = dom_1.DOM.className;
        var hasClass = dom_1.DOM.hasClass;
        var r_dropdown = ['dropdown'], r_open = ['show', 'open'], active, act = function (dropdown, flag) {
            className(dropdown, r_open, flag);
            className(dropdown.querySelector('.dropdown-menu'), r_open, flag);
            if (flag)
                active = dropdown;
            else
                active = null;
        };
        (function () {
            document.addEventListener('click', function (e) {
                var ele = e.target, dropdown, btn = false, dismiss = false;
                // 순회
                do {
                    // dropdown 찾기
                    if (hasClass(ele, r_dropdown)) {
                        dropdown = ele;
                        break;
                    }
                    // 끄기 버튼
                    else if (ele.hasAttribute('data-dismiss'))
                        dismiss = true;
                    // 타켓 확인
                    else if (ele.hasAttribute('data-toggle')) {
                        if (ele.getAttribute('data-toggle') === 'dropdown')
                            btn = dismiss = true;
                        else
                            return;
                    }
                } while (ele = ele.parentElement);
                // ① dropdown 객체일 경우
                if (dropdown) {
                    // 현재 열려진
                    if (hasClass(dropdown, r_open)) {
                        dismiss && act(dropdown, false);
                    }
                    else {
                        btn && act(dropdown, true);
                    }
                }
                // ① dropdown 객체가 아닌 경우에는 현재 열려진 거 닫기
                else if (active) {
                    dropdown = active;
                    while (dropdown = dropdown.parentElement) {
                        hasClass(dropdown, r_dropdown) && (active = dropdown);
                    }
                    act(active, false);
                }
            });
        })();
    })(Toggle = exports.Toggle || (exports.Toggle = {}));
}).apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ }),
/* 21 */,
/* 22 */,
/* 23 */,
/* 24 */,
/* 25 */,
/* 26 */,
/* 27 */,
/* 28 */,
/* 29 */,
/* 30 */,
/* 31 */
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__, exports, __webpack_require__(17), __webpack_require__(8), __webpack_require__(0), __webpack_require__(19), __webpack_require__(7), __webpack_require__(1), __webpack_require__(20)], __WEBPACK_AMD_DEFINE_RESULT__ = (function (require, exports, Browser_1, template_1, core_1, pager_1, events_1, dom_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var className = dom_1.DOM.className;
    var xhr = {
        dirs: (function () {
            var xhr = new XMLHttpRequest();
            return function () {
                return new Promise(function (o, x) {
                    xhr.onreadystatechange = function (aEvt) {
                        if (xhr.readyState == 4) {
                            if (xhr.status == 200) {
                                o(JSON.parse(xhr.responseText));
                            }
                        }
                    };
                    xhr.open('GET', '/secret/gallery/paths', true);
                    xhr.send(null);
                });
            };
        })(),
        update: function (id, data) {
            var xhr = new XMLHttpRequest();
            return new Promise(function (o, x) {
                xhr.onreadystatechange = function (aEvt) {
                    if (xhr.readyState == 4) {
                        if (xhr.status == 200) {
                            o(JSON.parse(xhr.responseText));
                        }
                    }
                };
                xhr.open('PUT', '/secret/gallery/update/' + id, true);
                xhr.setRequestHeader('Content-Type', 'application/json');
                xhr.send(JSON.stringify(data));
            });
        },
        list: (function () {
            var xhr = new XMLHttpRequest();
            return function (data) {
                return new Promise(function (o, x) {
                    xhr.onreadystatechange = function (aEvt) {
                        if (xhr.readyState == 4) {
                            if (xhr.status == 200) {
                                o(JSON.parse(xhr.responseText));
                            }
                        }
                    };
                    xhr.open('GET', '/secret/gallery/values?' + data.toString(), true);
                    xhr.send(JSON.stringify(data));
                });
            };
        })(),
    };
    var LocalSearch = /** @class */ (function (_super) {
        __extends(LocalSearch, _super);
        function LocalSearch() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            _this.favorite = 0;
            _this.size = 100;
            _this.blind = false;
            _this.order = ">uploadtime";
            return _this;
        }
        return LocalSearch;
    }(Browser_1.MediaSeach));
    var GalleryFiles = /** @class */ (function (_super) {
        __extends(GalleryFiles, _super);
        function GalleryFiles() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        GalleryFiles.prototype.apply = function () {
            return this;
        };
        GalleryFiles = __decorate([
            template_1.Template({
                galFavorite: function (ele, attrs, f) {
                    ele.setAttribute('data-template-compile', '');
                    return {
                        favorite: function () {
                            ele.setAttribute('data-favorite', f.favorite.toString());
                        }
                    };
                },
                galRotate: function (ele, attrs, f) {
                    return {
                        rotate: function () {
                            ele.textContent = f.rotate.toString();
                        }
                    };
                },
                galShot: function (ele, attrs, f) {
                    return {
                        shot: function () {
                            className(ele, 'zero', !f.shot);
                            ele.textContent = f.shot.toString();
                        }
                    };
                },
                galPath: function (a, attrs, f) {
                    a.href = '#path=/' + encodeURIComponent(f.path);
                },
                galUser: function (a, attrs, f) {
                    a.textContent = '[' + f.user + ']';
                    a.href = '#search=@' + f.user;
                },
                galTitle: function (ele, attrs, f) {
                    ele.textContent = f.title;
                },
            })
        ], GalleryFiles);
        return GalleryFiles;
    }(Browser_1.MediaContainer));
    core_1.$ready(function () {
        var config = {
            Media: GalleryFiles,
            Search: LocalSearch,
            events: {
                favorite: function (i, v, media, e) {
                    var favorite = parseInt(v);
                    if (media.favorite === favorite)
                        favorite--;
                    xhr.update(media.id, { prop: 'favorite', value: favorite }).then(function () {
                        media.favorite = favorite;
                        media.apply();
                    });
                },
                shot: function (i, v, media, e) {
                    var shot = media.shot;
                    if (e.ctrlKey)
                        shot--;
                    else
                        shot++;
                    if (shot < 0)
                        return;
                    xhr.update(media.id, { prop: 'shot', value: shot }).then(function () {
                        media.shot = shot;
                        media.apply();
                    });
                },
                rotate: function (i, v, media, e) {
                    var r = media.rotate + 90;
                    if (r === 360)
                        r = 0;
                    xhr.update(media.id, { prop: 'rotate', value: r }).then(function () {
                        media.mediaElement.render(media.rotate = r);
                        media.apply();
                    });
                }
            },
            $load: function (map, browser) {
                return xhr.list(map).then(function (l) {
                    browser.setValues(l.values).apply();
                    var search = browser.search;
                    search.page = l.page;
                    search._totalPages = l.totalPages;
                });
            },
            directive: {
                // Pager
                galPager: function (ele, attrs, browser) {
                    var pagerTable = new pager_1.PagerTable(ele, 10, 10)
                        .setHandler(function (page, table) {
                        location.hash = browser.search.extend({ page: page }).toString();
                    });
                    return {
                        '#hash': function () {
                            var search = browser.search;
                            pagerTable.render(new pager_1.Pager(search.page, search._totalPages));
                        }
                    };
                },
                galNav: function (ele, attrs, browser) {
                    var current = ele.querySelector('.current');
                    ele.addEventListener('click', function (e) {
                        var target = e.target, num;
                        if (num = target.getAttribute('data-nav')) {
                            var search = browser.search;
                            var n = search.page + parseInt(num);
                            if (n > 0 && n < search._totalPages + 1)
                                search.extend({ page: n }).hash();
                        }
                    });
                    return {
                        '#hash': function () {
                            current.textContent = browser.search.page + ' / ' +
                                browser.search._totalPages;
                        }
                    };
                },
                galFavorite: function (ele, attrs, browser) {
                    events_1.Events.bind(ele, 'click', '[data-value]', function (e, target) {
                        var favorite = parseInt(target.getAttribute('data-value')), search = browser.search;
                        search.favorite === favorite && favorite--;
                        search.extend({ page: 1, favorite: favorite }).hash();
                    });
                    return {
                        '#hash': function () {
                            ele.setAttribute('data-favorite', browser.search.favorite.toString());
                        }
                    };
                }
            }
        };
        xhr.dirs().then(function (s) {
            new Browser_1.Browser(config).setTree(s).apply();
        });
    });
}).apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ })
/******/ ]);