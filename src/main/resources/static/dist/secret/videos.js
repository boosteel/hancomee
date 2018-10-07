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
/******/ 	return __webpack_require__(__webpack_require__.s = 44);
/******/ })
/************************************************************************/
/******/ ({

/***/ 18:
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

/***/ 3:
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

/***/ 44:
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__, exports, __webpack_require__(3), __webpack_require__(18)], __WEBPACK_AMD_DEFINE_RESULT__ = (function (require, exports, dom_1, calcurator_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var createHTML = dom_1.DOM.createHTML;
    function render(col, values) {
        var W = window.innerWidth, w = Math.floor(W / col), h = [];
        // 첫 시작 height는 모두 0으로
        for (var i = 0; i < col; i++)
            h[i] = 0;
        values.forEach(function (v, i) {
            i = i % col;
            // 설정해야 할 :: (width, left, top)
            // return :: 자신의 height
            h[i] += v(w, w * i, h[i]);
        });
    }
    var SIZE = 1, 
    // nav
    length = values.length, totalPages = Math.ceil(length / SIZE), page, 
    // elements
    main = document.querySelector('main'), prev = document.querySelector('.prev'), num = document.querySelector('.current'), next = document.querySelector('.next'), count = document.querySelector('.count'), complete = function () {
    }, createVideo = function (main, data) {
        return new Promise(function (o, x) {
            var thumb = data.thumb, title = data.title, mp4 = data.mp4, url = data.url, container = createHTML('<div class="video">' +
                '<span class="title">' + title + '.mp4<br /><a href="' + url + '" target="_blank">move</a> ' + '</span>' +
                '</div>'), video = document.createElement('video'), source = document.createElement('source');
            // video 로딩
            video.controls = true;
            video.onloadedmetadata = function (e) {
                video.setAttribute('data-loaded', 'true');
                o(function (width, left, top) {
                    var s = container.style, style = video.style, videoWidth = video.videoWidth, videoHeight = video.videoHeight, h = calcurator_1.Calcurator.ratio(videoWidth, width, videoHeight);
                    s.left = left + 'px';
                    s.top = top + 'px';
                    style.width = width + 'px';
                    style.height = h + 'px';
                    return h;
                });
            };
            source.onerror = function (e) {
                o(function (width, left, top) {
                    var s = container.style, style = video.style;
                    s.left = left + 'px';
                    s.top = top + 'px';
                    style.width = width + 'px';
                    style.height = width + 'px';
                    return width;
                });
            };
            video.appendChild(source);
            container.insertBefore(video, container.firstChild);
            source.src = mp4;
            // <main>에 붙인다
            main.appendChild(container);
        });
    }, current, run = function (p) {
        if (page !== p && !(totalPages < p)) {
            window.scrollTo(0, 0);
            var list = values.slice((p - 1) * SIZE, p * SIZE);
            num.textContent = p.toString();
            if (p === totalPages)
                next.removeAttribute('data-nav');
            else
                next.setAttribute('data-nav', 'next');
            if (p === 1)
                prev.removeAttribute('data-nav');
            else
                prev.setAttribute('data-nav', 'prev');
            count.textContent = p + ' / ' + totalPages;
            main.innerHTML = '';
            Promise.all(list.map(function (v) { return createVideo(main, v); }))
                .then(function (fns) { return page === p && render(5, fns); });
            page = p;
        }
    };
    main.addEventListener('mouseover', function (e) {
        var target = e.target;
        if (/video/i.test(target.tagName) && target.hasAttribute('data-loaded')) {
            if (current)
                current.pause();
            (current = target).play();
        }
    });
    document.querySelector('.navi').addEventListener('click', function (e) {
        var target = e.target;
        switch (target.getAttribute('data-nav')) {
            case 'prev':
                return location.search = (page - 1).toString();
            case 'next':
                return location.search = (page + 1).toString();
        }
    });
    var d = location.search.replace(/[^\d]+/g, '') || '1';
    run(parseInt(d));
}).apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ })

/******/ });