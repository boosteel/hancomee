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
/******/ 	return __webpack_require__(__webpack_require__.s = 23);
/******/ })
/************************************************************************/
/******/ ({

/***/ 19:
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

/***/ 23:
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
!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__, exports, __webpack_require__(19)], __WEBPACK_AMD_DEFINE_RESULT__ = (function (require, exports, calcurator_1) {
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


/***/ })

/******/ });