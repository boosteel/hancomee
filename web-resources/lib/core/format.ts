import {Access} from "./access";
import {r_number} from "./_regexp/number";

/**
 * Created by hellofunc on 2017-03-01.
 */

export namespace Formats {

    let rr = /:([\w.]+)/g;

    export function replaceAll(str: string, val: Object) {
        let v;
        if (val == null) return str;
        return str.replace(rr, function (_, prop) {
            v = Access.access(val, prop);
            return v == null ? '' : v;
        });
    }


    type REPLASER = (substring: string, ...args: any[]) => string;

    export function replace(__value: string, rg: RegExp, literal: (s: string) => void, matcher: REPLASER) {
        let
            pos = 0,
            result = __value.replace(rg, function (all, match, index) {
                if (index) literal(__value.substring(pos, index));
                pos = index + all.length;
                return matcher.apply(this, arguments);
                ;
            });
        if (pos < __value.length) literal(__value.substring(pos, __value.length));
        return result;
    }


    // 숫자 받아서 파일 크기로... (천단위 쉼표)
    // unit은 단위를 덧붙일 것인지
    export let fileSize = (function (array) {

        let r = /\B(?=(?:\d{3})+(?!\d))/g;

        return (size: number, unit = true) => {

            let t = typeof size;
            if (t !== 'number') {
                if (t !== 'string' || !/^\d+$/.test(<any>size)) return '';
                size = parseInt(<any>size);
            }

            if (size === 0) return '0 bytes';

            let result = Math.floor(Math.log(size) / Math.log(1024));
            return String(
                (size / Math.pow(1024, result)).toFixed(2)
                ).replace(r, ',')
                + (unit ? " " + array[result] : '');
        }

    })(['bytes', 'kB', 'MB', 'GB', 'TB', 'PB']);


    export let moneyKr = (function (hanA, danA) {

        return function (val) {

            if (typeof val === 'number') val = val.toString();
            if (typeof val === 'string' && /^\d+$/.test(val)) {

                let result = '', han, str, i = 0, l = val.length;

                for (; i < l; i++) {
                    str = '';
                    han = hanA[val[l - (i + 1)]];
                    if (han != "") str = han + danA[i];
                    if (i == 4) str += "만";
                    if (i == 8) str += "억";
                    result = str + result;
                }

                return result || '';
            }
            return '';
        }
    })(
        ["", "일", "이", "삼", "사", "오", "육", "칠", "팔", "구", "십"],
        ["", "십", "백", "천", "", "십", "백", "천", "", "십", "백", "천"]
    );


    // {{obj}}
    export function replaceByObj(str: string, obj) {
        let f;
        return str.replace(/{{[^{}]+}}/g, function (_, g) {
            f = obj[g];
            if (f == null) return '';
            else if (typeof f === 'function') return f.call(obj);
            else return '';
        });
    }


    // HTML 이스케이프
    export let _htmlEscape = (function () {
        let escape = /&lt;|&gt;|&nbsp;|&amp;|&quot;|&apos;/g;

        function _change(c: string) {
            switch (c) {
                case '&lt;' :
                    return '<';
                case '&gt;' :
                    return '>';
                case '&nbsp;' :
                    return ' ';
                case '&amp;' :
                    return '&';
                case '&quot;' :
                    return '"';
                case '&apos;' :
                    return '\'';
                default :
                    return c;
            }
        }

        return function (str: string) {
            return str.replace(escape, (s) => _change(s));
        }
    })();

    let r_num_replace = /\B(?=(\d{3})+(?!\d))/g;

    export let number = (val) => {
        if (typeof val === 'number') val = val.toString();

        if (typeof val === 'string' && r_number.test(val))
            return val.replace(r_num_replace, ",");

        return '0';
    };
}
