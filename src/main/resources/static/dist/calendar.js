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
/******/ 	return __webpack_require__(__webpack_require__.s = 25);
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
/* 8 */,
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
/* 10 */,
/* 11 */,
/* 12 */,
/* 13 */,
/* 14 */,
/* 15 */,
/* 16 */
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__, exports], __WEBPACK_AMD_DEFINE_RESULT__ = (function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var now = new Date().getTime(), second = 1000, minute = second * 60, hour = minute * 60, day = hour * 24, __day = ["일", "월", "화", "수", "목", "금", "토"], 
    // 숫자 자리수 맞추기
    zeroFill = function (_target, len) {
        var target = _target.toString();
        while (target.length < len)
            target = '0' + target; // 모자란 숫자는 앞에 0으로 채운다.
        return target;
    };
    function toKor(date) {
        var duration = now - (typeof date === 'number' ? date : new Date(date).getTime());
        if (duration > day)
            return Math.floor(duration / day) + '일 전';
        if (duration > hour)
            return Math.floor(duration / hour) + '시간 전';
        if (duration > minute)
            return Math.floor(duration / minute) + '분 전';
        if (duration > second)
            return Math.floor(duration / second) + '초 전';
    }
    function _format(_date, f) {
        if (f === void 0) {
            f = 'yyyy-MM-dd HH:mm';
        }
        if (!_date)
            return '';
        var d = typeof _date === 'number' ? new Date(_date) : _date, temp;
        return f.replace(/yyyy|yy|M{1,2}|d{1,2}|E|HH|mm|ss|a\/p/gi, function ($1) {
            switch ($1) {
                case "yyyy":
                    return d.getFullYear();
                case "yy":
                    return zeroFill(d.getFullYear() % 1000, 2);
                case "M":
                    return d.getMonth() + 1;
                case "MM":
                    return zeroFill(d.getMonth() + 1, 2);
                case "dd":
                    return zeroFill(d.getDate(), 2);
                case "d":
                    return d.getDate();
                case "E":
                    return __day[d.getDay()];
                case "HH":
                    return zeroFill(d.getHours(), 2);
                case "hh":
                    return ((temp = d.getHours() % 12) ? temp : 12).zf(2);
                case "mm":
                    return zeroFill(d.getMinutes(), 2);
                case "ss":
                    return zeroFill(d.getSeconds(), 2);
                case "a/p":
                    return d.getHours() < 12 ? "오전" : "오후";
                default:
                    return $1;
            }
        });
    }
    ;
    // 몇째주인지 확인
    function weekNum(date, day) {
        var week = 1;
        while (date-- > 0) {
            if (--day < 0) {
                week++;
                day = 7;
            }
        }
        return week;
    }
    var Month = /** @class */ (function () {
        // month는 0부터
        function Month(year, month) {
            this.year = year;
            this.month = month;
        }
        Month.prototype.move = function (val) {
            var _b = this, year = _b.year, month = _b.month, i = 1;
            if (val < 0)
                val = val * (i = -1);
            while (val-- > 0) {
                month = month + i;
                if (month > 11) {
                    year++;
                    month = 0;
                }
                else if (month < 0) {
                    year--;
                    month = 11;
                }
            }
            return new Month(year, month);
        };
        Month.prototype.toArray = function () {
            return Calendar.toArray(this.year, this.month);
        };
        Month.prototype.toString = function () {
            return this.year + '-' + (this.month + 1);
        };
        return Month;
    }());
    exports.Month = Month;
    var Calendar = /** @class */ (function () {
        function Calendar(_value) {
            if (_value == null)
                this.value = new Date();
            else
                this.value = _value instanceof Date ? _value : new Date(_value);
        }
        Object.defineProperty(Calendar.prototype, "year", {
            get: function () {
                return this.value.getFullYear();
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Calendar.prototype, "month", {
            get: function () {
                return this.value.getMonth();
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Calendar.prototype, "date", {
            get: function () {
                return this.value.getDate();
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Calendar.prototype, "day", {
            get: function () {
                return this.value.getDay();
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Calendar.prototype, "longtime", {
            get: function () {
                return this.value.getTime();
            },
            enumerable: true,
            configurable: true
        });
        // Date와 인터페이스를 맞추기 위한 메서드들
        Calendar.prototype.getFullYear = function () {
            return this.year;
        };
        Calendar.prototype.getMonth = function () {
            return this.month;
        };
        Calendar.prototype.$date = function (num) {
            if (!num)
                return this;
            return new Calendar(new Date(this.longtime + (num * day)));
        };
        Calendar.prototype.$month = function (num) {
            if (!num)
                return this;
            var _a = this, y = _a.year, m = _a.month, date = _a.date, expectMonth = m + num, // 희망하는 달
            len = y * 12 + expectMonth, // 년도를 달로 고쳐서 숫자를 만든다.
            result = new Calendar(new Date(len / 12, len % 12, date));
            /*
             *  만약 this가 10월 31일 이라면, 달만 더하면 11월 31일이 되는데,
             *  11월 31일은 없으므로 12월 1일이 되어버린다.
             *  따라서 이를 보정한다.
             *  해당하는 달이 될때까지 날짜를 빼나간다.
             */
            var i = 11;
            expectMonth = expectMonth % 12;
            expectMonth = expectMonth < 0 ? 11 : expectMonth;
            while (result.month !== expectMonth) {
                result = result.$date(-1);
                // 로직에 문제는 없지만 혹시 모르니까 추가해둔다.
                // 여기서 무한루프에 빠지면 디버깅이 존나 힘들것이므로..
                if (i-- < 0)
                    throw new Error('무한루프에 빠질 위험이 있습니다!!');
            }
            return result;
        };
        Calendar.prototype.$year = function (num) {
            if (!num)
                return this;
            var _a = this, year = _a.year, month = _a.month, date = _a.date;
            return new Calendar(new Date(year + num, month, date));
        };
        Calendar.prototype.getFirstDate = function () {
            return new Calendar(new Date(this.year, this.month, 1));
        };
        Calendar.prototype.getLastDate = function () {
            return new Calendar(new Date(this.year, this.month + 1, 0));
        };
        Calendar.prototype.setTime = function (value) {
            if (value === void 0) {
                value = new Date();
            }
            var _a = this, year = _a.year, month = _a.month, date = _a.date;
            return new Calendar(new Date(year, month, date, value.getHours(), value.getMinutes(), value.getSeconds()));
        };
        Object.defineProperty(Calendar.prototype, "isodate", {
            get: function () {
                return this.year + '-' + this.month_kr() + '-' + this.date_kr();
            },
            enumerable: true,
            configurable: true
        });
        Calendar.prototype.year_kr = function () {
            return this.year + '';
        };
        Calendar.prototype.month_kr = function () {
            var month = this.month + 1;
            return (month < 10 ? '0' : '') + month;
        };
        Calendar.prototype.date_kr = function () {
            var date = this.date;
            return (date < 10 ? '0' : '') + date;
        };
        Calendar.prototype.day_kr = function () {
            return __day[this.day];
        };
        Calendar.prototype.durationDate = function (target) {
            var origLong = Math.floor(this.longtime / day) * day, targetLong = Math.floor(target.getTime() / day) * day;
            return (targetLong - origLong) / day;
        };
        Calendar.prototype.durationMonth = function (target) {
            var origY = this.getFullYear() * 12 + this.getMonth(), targetY = target.getFullYear() * 12 + target.getMonth();
            return targetY - origY;
        };
        Calendar.prototype.durationYear = function (target) {
            return target.getFullYear() - this.getFullYear();
        };
        Calendar.prototype.format = function (str) {
            if (str === void 0) {
                str = 'yyyy-MM-dd';
            }
            return _format(this.value, str);
        };
        Calendar.prototype.equals = function (data) {
            var _a = this, year = _a.year, month = _a.month, date = _a.date;
            if (year !== data.getFullYear())
                return false;
            if (month !== data.getMonth())
                return false;
            if (date !== data.getDate())
                return false;
            return true;
        };
        Calendar.prototype.toString = function () {
            return _format(this.value, 'yyyy-MM-dd HH:mm:ss');
        };
        Calendar.prototype.clone = function () {
            return new Calendar(this.longtime);
        };
        return Calendar;
    }());
    exports.Calendar = Calendar;
    (function (Calendar) {
        Calendar.format = _format;
        function create(v1, v2, v3, v4, v5, v6) {
            var v = v1;
            if (typeof v6 === 'number')
                v = new Date(v1, v2 - 1, v3, v4, v5, v6);
            else if (typeof v3 === 'number')
                v = new Date(v1, v2 - 1, v3);
            return new Calendar(v);
        }
        Calendar.create = create;
        function monthInfo(year, month) {
            var first = new Date(year, month, 1), last = new Date(year, month + 1, 0);
            return [first.getDate(), first.getDay(), last.getDate(), last.getDay()];
        }
        function today(str) {
            if (str === void 0) { str = 'yyyy-MM-dd'; }
            return _format(new Date(), str);
        }
        // 달력을 만들기 위한 배열
        function toArray(y, m) {
            var _a = monthInfo(y, m), fd = _a[1], l = _a[2], start = new Calendar(new Date(y, m, 1)).$date((fd % 7 * -1) - 1), // 1를 빼는 이유는 일요일도 포함시키기 위함
            row = Math.ceil((l + fd % 7) / 7), i = 0, result = [];
            while (row > 0) {
                var r = [];
                for (; i < 7; i++) {
                    r.push(start = start.$date(1));
                }
                result.push(r);
                i = 0;
                row--;
            }
            return result;
        }
        Calendar.toArray = toArray;
        function isodate(y, m, d) {
            var date = y;
            if (typeof d === 'number')
                date = new Date(y, m, d);
            return _format(date, 'yyyy-MM-dd');
        }
        Calendar.isodate = isodate;
    })(Calendar = exports.Calendar || (exports.Calendar = {}));
    exports.Calendar = Calendar;
}).apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
/*
(function (DateManager) {
    DateManager.format = exports._format;

    // 시간을 뺀 날짜만
    function today() {
        var date = new Date();
        return new DateManager(date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate());
    }

    DateManager.today = today;

    function monthRange(dm) {
        var _a = monthInfo(dm.year, dm.month), firstDate = _a[0], firstDay = _a[1], lastDate = _a[2], lastDay = _a[3];
    }

    DateManager.monthRange = monthRange;
})(DateManager = exports.DateManager || (exports.DateManager = {}));
exports.DateManager = DateManager;
// [첫째일, 요일, 마지막일, 요일]
// month는 0부터 시작
function monthInfo(year, month) {
    var first = new Date(year, month, 1), last = new Date(year, month + 1, 0);
    return [first.getDate(), first.getDay(), last.getDate(), last.getDay()];
}

exports.monthInfo = monthInfo;

// 달력을 만들기 위한 배열
function daysOfMonth(y, m) {
    var _a = monthInfo(y, m), fd = _a[1], l = _a[2],
        start = new DateManager(new Date(y, m, 1)).$date((fd % 7 * -1) - 1), // 1를 빼는 이유는 일요일도 포함시키기 위함
        row = Math.ceil((l + fd % 7) / 7), i = 0, result = [];
    while (row > 0) {
        var r = [];
        for (; i < 7; i++) {
            r.push(start = start.$date(1));
        }
        result.push(r);
        i = 0;
        row--;
    }
    return result;
}

exports.daysOfMonth = daysOfMonth;*/


/***/ }),
/* 17 */,
/* 18 */,
/* 19 */,
/* 20 */,
/* 21 */,
/* 22 */,
/* 23 */,
/* 24 */,
/* 25 */
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
!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__, exports, __webpack_require__(0), __webpack_require__(16), __webpack_require__(6), __webpack_require__(1), __webpack_require__(7), __webpack_require__(26), __webpack_require__(2)], __WEBPACK_AMD_DEFINE_RESULT__ = (function (require, exports, core_1, calendar_1, location_1, dom_1, events_1, Branch_1, html_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var className = dom_1.DOM.className;
    var replaceHTML = html_1.HTML.replaceHTML;
    var dummyArray = [], format = calendar_1.Calendar.format, isodate = calendar_1.Calendar.isodate, TYPES = ['알림', '작업', '메모'], html = {
        data: '<div class="content">' +
            '<div class="type type-{{type}}">{{typeName}}</div>' +
            '<div class="title">' +
            '<span data-handler="view" data-handler-value="{{id}}">{{title}}</span>' +
            '</div>' +
            '</div>',
        cell: '<div class="calendar-cell{{class}}" data-col="{{index}}">' +
            '<span class="number" data-handler="add" data-handler-value="{{isodate}}">{{num}}</span>' +
            '<div id="date-{{isodate}}" class="contents">{{html}}</div>' +
            '</div>',
        type: '<input type="radio" name="type" class="form-check-input" id="type-{{i}}">' +
            '<label class="form-check-label" for="type-{{i}}">{{name}}</label>'
    };
    /*
     *  데이터 빈이자 CURD를 담당한다.
     */
    var DATA = /** @class */ (function () {
        function DATA(data) {
            this.title = '';
            this.body = '';
            if (data instanceof Date)
                this.date = data;
            else
                this.setData(data);
        }
        Object.defineProperty(DATA.prototype, "typeName", {
            get: function () {
                return TYPES[this.type];
            },
            enumerable: true,
            configurable: true
        });
        DATA.prototype.setData = function (data) {
            core_1.$extend(this, data, DATA.extend);
            return this;
        };
        DATA.prototype.save = function () {
            var _this = this;
            return new Promise(function (o, x) {
                var xhr = new XMLHttpRequest();
                xhr.onreadystatechange = function () {
                    if (xhr.readyState === 4 && xhr.status === 200) {
                        o(_this);
                    }
                };
                xhr.open('PUT', '/calendar/save');
                xhr.setRequestHeader('Content-Type', 'application/json');
                xhr.send(JSON.stringify(_this));
            });
        };
        DATA.prototype.remove = function () {
            var _this = this;
            return new Promise(function (o, x) {
                var xhr = new XMLHttpRequest();
                xhr.onreadystatechange = function () {
                    if (xhr.readyState === 4 && xhr.status === 200) {
                        o(_this);
                    }
                };
                xhr.open('DELETE', '/calendar/delete/' + _this.id);
                xhr.send(null);
            });
        };
        // 각 DATA의 타이틀 html
        DATA.prototype.html = function () {
            return replaceHTML(html.data, this);
        };
        DATA.prototype.json = function () {
            return core_1.$extend({}, this, DATA.json);
        };
        return DATA;
    }());
    (function (DATA) {
        // 웹에서 사용할 데이터로 변환
        DATA.extend = {
            date: function (v, t) {
                t.date = typeof v === 'number' ? new Date(v) : v;
            },
            writeTime: function (v, t) {
                t.writeTime = typeof v === 'number' ? new Date(v) : v;
            },
        };
        // DB에 저장할 데이터로 변환
        DATA.json = {
            date: function (v, t) {
                t.date = calendar_1.Calendar.isodate(v);
            },
            writeTime: function (v, t) {
                t.writeTime = calendar_1.Calendar.format(v, 'yyyy-MM-dd HH:mm:ss');
            },
            typeName: false
        };
    })(DATA || (DATA = {}));
    /*
     *  데이터를 관리하는 DataMap
     */
    var CalendarData = /** @class */ (function () {
        function CalendarData() {
        }
        // 목록을 받아서 ①id ②date 로 각각 구분해 자료구조화 한다.
        CalendarData.prototype.setValues = function (values) {
            var dateMap = this._dateMap = {}, idMap = this._idMap = {}, v, l = values.length, key, array;
            while (l-- > 0) {
                v = values[l];
                if (!(array = dateMap[key = calendar_1.Calendar.isodate(v.date)]))
                    dateMap[key] = array = [];
                array.push(v);
                idMap[v.id] = v;
            }
            return this;
        };
        CalendarData.prototype.add = function (data) {
            if (!this._idMap[data.id]) {
                var iso = isodate(data.date), array = this._dateMap[iso] || (this._dateMap[iso] = []);
                array.push(data);
                this._idMap[data.id] = data;
            }
            return this;
        };
        CalendarData.prototype.remove = function (data) {
            var iso = isodate(data.date), array = this._dateMap[iso];
            array.splice(array.indexOf(data), 1);
            delete this._idMap[data.id];
            return this;
        };
        CalendarData.prototype.byId = function (id) {
            return this._idMap[id];
        };
        CalendarData.prototype.byDate = function (isodate) {
            return this._dateMap[isodate] || dummyArray;
        };
        CalendarData.prototype.createLines = function (isodate) {
            var a = this._dateMap[isodate];
            return a ? a.map(function (v) { return v.html(); }).join('') : '';
        };
        CalendarData.prototype.refresh = function (v) {
            var iso = typeof v === 'string' ? v : isodate(v);
            document.getElementById('date-' + iso).innerHTML = this.createLines(iso);
            return this;
        };
        // 시작일과 마지막일을 기준로 여기서 ajax가 진행된다.
        // 달력을 그린다.
        CalendarData.prototype.render = function (array, y, m, today) {
            var _this = this;
            var tM = today.getMonth(), tD = today.getDate();
            // ① 해당 월에 대한 array을 받아와서
            return array.map(function (month) {
                // ② 일주일마다 한 줄씩 정렬해서
                return '<div class="calendar-row">' +
                    // ③ 각 일마다 데이터를 겅리한다.
                    month.map(function (day, i) {
                        var isodate = day.isodate, month = day.month, date = day.date, isCurrnet = month === m, c = isCurrnet ? ' current' : '';
                        if (tM === month && tD === date)
                            c += ' today';
                        return replaceHTML(html.cell, {
                            index: i,
                            class: c,
                            isodate: isodate,
                            num: isCurrnet ? date : (month + 1) + '/' + date,
                            html: _this.createLines(isodate)
                        });
                    }).join('') + '</div>';
            }).join('');
        };
        return CalendarData;
    }());
    var CalendarForm = /** @class */ (function (_super) {
        __extends(CalendarForm, _super);
        function CalendarForm(screen) {
            var _this = _super.call(this) || this;
            _this.screen = screen;
            // ① 엘리먼트의 id를 key로 잡아서 property로 등록
            Branch_1.Branch.$tour(screen, _this);
            var _a = _this, ctrl = _a.ctrl, title = _a.title, body = _a.body, types = _a.types, writeTime = _a.writeTime, content = _a.content, handlers = {
                modify: function () {
                    _this.form(true);
                },
                cancel: function () {
                    // 등록하는 상황이면, 취소버튼을 누르면 그냥 screen을 닫는다.
                    if (_this.data.id == null)
                        _this.off();
                    else
                        _this.form(false);
                },
                remove: function () {
                    var _a = _this, data = _a.data, date = _a.data.date;
                    if (confirm(data.title + '\n\n정말 삭제하시겠습니까?')) {
                        var xhr_1 = new XMLHttpRequest();
                        xhr_1.onreadystatechange = function () {
                            if (xhr_1.readyState === 4 && xhr_1.status === 200) {
                                _this.remove(data);
                                _this.refresh(date);
                                _this.off();
                            }
                        };
                        xhr_1.open('DELETE', 'calendar/' + data.id, true);
                        xhr_1.send(null);
                    }
                },
                submit: function () {
                    if (!_this._submit)
                        return;
                    var data = _this.data;
                    data.type = _this.getType();
                    data.title = title.value;
                    data.body = body.value;
                    data.writeTime = new Date();
                    var xhr = new XMLHttpRequest();
                    xhr.onreadystatechange = function () {
                        if (xhr.readyState === 4 && xhr.status === 200) {
                            data.id = parseInt(xhr.responseText);
                            _this.add(data).refresh(data.date).off();
                        }
                    };
                    xhr.open('PUT', 'calendar', true);
                    xhr.setRequestHeader('Content-Type', 'application/json');
                    xhr.send(JSON.stringify(data.json()));
                }
            }, 
            /*
             *   ① 데이터가 빠짐 없이 기입
             *   ② 데이터가 변경되었을때
             *
             *   위 조건이 성립할때만 isSubmit 클래스를 붙여준다.
             */
            valid = function () {
                var data = _this.data, type = _this.getType(), tVal = title.value.trim(), bVal = body.value.trim();
                if (!tVal || type === -1)
                    return _this.isSubmit(false);
                if (data) {
                    _this.isSubmit(data.title !== tVal || data.body !== bVal || data.type !== type);
                }
            };
            // 끄기
            screen.addEventListener('click', function (e) {
                if (e.target === screen)
                    _this.off();
            });
            ctrl.addEventListener('click', function (e) {
                var val = handlers[e.target.getAttribute('data-ctrl')];
                val && val();
            });
            // <input type="radio"> types 설정
            types.innerHTML = TYPES.map(function (t, i) { return replaceHTML(html.type, { i: i, name: t }); })
                .join('');
            _this.typesEle = core_1.__makeArray(types.querySelectorAll('input'));
            types.addEventListener('change', valid);
            title.addEventListener('keyup', valid);
            body.addEventListener('keyup', valid);
            return _this;
        }
        CalendarForm.prototype.form = function (flag) {
            var _a = this, content = _a.content, title = _a.title, body = _a.body;
            this.isModify(flag);
            if (flag) {
                title.removeAttribute('disabled');
                body.removeAttribute('disabled');
            }
            else {
                title.setAttribute('disabled', '');
                body.setAttribute('disabled', '');
            }
        };
        CalendarForm.prototype.on = function (data) {
            var _a = this, title = _a.title, body = _a.body;
            this.data = data;
            this.date = isodate(data.date);
            this.datetime.textContent = format(data.date, 'yyyy-MM-dd (E)');
            this.writeTime.textContent = data.writeTime ? format(data.writeTime, 'yyyy-MM-dd(E) HH:mm:ss') : '';
            title.value = data.title;
            body.value = data.body;
            this.setType(data.type);
            this.isNew(data.id == null);
            this.form(data.id == null);
            this.isSubmit(false);
            className(this.screen, 'on', true);
        };
        CalendarForm.prototype.off = function () {
            className(this.screen, 'on', false);
        };
        CalendarForm.prototype.setType = function (v) {
            this.typesEle.forEach(function (t, i) { return t.checked = v === i; });
            return this;
        };
        CalendarForm.prototype.getType = function () {
            var _a = this, typesEle = _a.typesEle, length = _a.typesEle.length;
            while (length-- > 0)
                if (typesEle[length].checked)
                    return length;
            return -1;
        };
        CalendarForm.prototype.isModify = function (flag) {
            if (flag === void 0) { flag = true; }
            className(this.screen, 'form', flag);
        };
        CalendarForm.prototype.isNew = function (flag) {
            if (flag === void 0) { flag = true; }
            className(this.screen, 'isNew', flag);
        };
        CalendarForm.prototype.isSubmit = function (flag) {
            if (flag === void 0) { flag = true; }
            className(this.screen, 'isSubmit', this._submit = flag);
        };
        return CalendarForm;
    }(CalendarData));
    var CalSearch = /** @class */ (function (_super) {
        __extends(CalSearch, _super);
        function CalSearch() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        return CalSearch;
    }(location_1.Search));
    core_1.$ready(function () {
        var main = document.querySelector('main'), screen = new CalendarForm(document.getElementById('screen')), refreshBtn = document.getElementById('refresh-btn'), prev = document.getElementById('date-prev'), current = document.getElementById('date-current'), next = document.getElementById('date-next'), 
        // click event handler
        handler = {
            view: function (v) {
                screen.on(screen.byId(v));
            },
            add: function (v) {
                screen.on(new DATA(new Date(v)));
            }
        }, 
        // 해시값에 따라 달력 갱신
        run = function () {
            // #yyyy-M
            var today = new Date(), key = location.hash.slice(1) || calendar_1.Calendar.format(new Date(), 'yyyy-M'), _a = key.split(/[^\d]/), _y = _a[0], _m = _a[1], month = new calendar_1.Month(parseInt(_y), parseInt(_m) - 1), array = month.toArray(), l = array.length - 1, query = 'sd=' + array[0][0].isodate + '&ed=' + array[l][6].isodate, xhr = new XMLHttpRequest();
            // today버튼 갱신
            refreshBtn.innerText = format(today, 'yyyy-MM-dd (E)');
            refreshBtn.href = '#' + format(today, 'yyyy-M');
            xhr.onreadystatechange = function () {
                if (xhr.readyState === 4 && xhr.status === 200) {
                    // 버튼 갱신
                    prev.href = '#' + month.move(-1).toString();
                    current.textContent = month.toString();
                    next.href = '#' + month.move(1).toString();
                    // 서버에서 받아온 데이터 변환
                    screen.setValues(JSON.parse(xhr.responseText || '[]')
                        .map(function (v) { return new DATA(v); }));
                    // 새로운 달력 html 주입
                    main.innerHTML = screen.render(array, month.year, month.month, today);
                }
            };
            xhr.open('GET', '/calendar/get?' + query, true);
            xhr.send(null);
        };
        events_1.Events.eventWorks(main, 'click', handler);
        window.addEventListener('hashchange', run);
        run();
    });
}).apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ }),
/* 26 */
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__, exports], __WEBPACK_AMD_DEFINE_RESULT__ = (function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var Branch = /** @class */ (function () {
        function Branch(element) {
            this.element = element;
            Branch.$tour(element, this);
        }
        return Branch;
    }());
    exports.Branch = Branch;
    (function (Branch) {
        function _tour(element, obj, prop) {
            if (element.nodeType !== 1)
                return obj;
            var children = element.children, length = element.children.length;
            while (length-- > 0)
                _tour(children[length], obj, prop);
            if (element.hasAttribute(prop))
                obj[element.getAttribute(prop)] = element;
            return obj;
        }
        function $tour(element, obj, prop) {
            if (prop === void 0) { prop = 'id'; }
            var children = element.children, length = element.children.length;
            while (length-- > 0)
                _tour(children[length], obj, prop);
            return obj;
        }
        Branch.$tour = $tour;
    })(Branch = exports.Branch || (exports.Branch = {}));
    exports.Branch = Branch;
}).apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ })
/******/ ]);