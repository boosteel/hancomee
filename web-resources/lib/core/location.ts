/**
 * Created by hellofunc on 2017-05-06.
 */

import {isPlainObject, isEmptyObject, extend, $extend} from "./core";
import {Access} from "./access";

let hasOwn = {}.hasOwnProperty,
    hasOwnProperty = (obj, value: string) => hasOwn.call(obj, value),
    r_url = /(https?:\/\/.*?\/)?([^\?]+)\??([^#]+)?#?(.*)/;


export class Search implements iLocation.iSearch {

    reset(search = location.search) {
        return this.extend(Search.toObject(search))
    }

    extend(obj: {}) {
        let p;
        for (p in obj) {
            this[p] = obj[p];
        }
        return this;
    }

    hash() {
        location.hash = this.toString();
        return this;
    }

    queryString(extend: {}): string
    queryString(): string
    queryString(obj?) {
        if (obj) obj = $extend($extend({}, obj), this);
        else obj = this;
        return Search.toSearch(obj);
    }

    toString() {
        return Search.toSearch(this);
    }
}

export namespace Search {

    import primitive = Access.primitive;
    let r_n = /&/


    export function create() {
        return new Search().reset();
    }

    /*
     *  쿼리 문자열 비교.
     *  순서만 다르고 같은 값으로 이루어진 쿼리의 경우 true가 된다.
     */
    export function equals(a: string, b: string) {
        if (a === b) return true;
        if (a == null || b == null) return false;
        if (a.length != b.length) return false;

        let an = a.split(r_n), bn = b.split(r_n), len = an.length;
        while (len-- > 0) if (bn.indexOf(an[len]) === -1) return false;

        return true;
    }


    // Object  ====>  querystring
    export function toSearch(obj: Object, prefix = '') {

        if (isEmptyObject(obj)) return '';

        let array: string[] = [], value;

        for (let key in obj) {
            value = obj[key];
            if (key[0] === '_' || key[0] === '$' || value == null || typeof value === 'function' || !hasOwnProperty(obj, key)) continue;
            if (isPlainObject(value)) {
                array.push(toSearch(value, prefix + key + '.'));
            }
            else if (Array.isArray(value)) {
                array = array.concat(value.map(v => key + '=' + encodeURIComponent(v)));
            }
            else array.push(prefix + key + '=' + encodeURIComponent(value));
        }

        return array.join("&");
    }

    // querystring  ====>  Object
    export function toObject(query: string, dest?) {

        let obj = {};

        if (query[0] === '?') query = query.slice(1);

        query.split(/&/)
            .filter(a => a && a.indexOf('=') !== -1)
            .forEach(v => {
                let [key, _value] = v.split(/=/),
                    value = Access.access(obj, key);

                // decoding
                _value = primitive(decodeURIComponent(_value));

                // key가 같은 경우 array로
                if (value) {
                    if (!Array.isArray(value)) value = [value];
                    value.push(_value);
                } else value = _value;

                Access.access(obj, key, value, true);
            });

        if (dest)
            obj = $extend(dest, obj);

        return obj;
    }
}


export class URLManager {

    host = ''
    pathname = ''
    search = ''
    hash = ''

    private path: string[]

    constructor(public fullURL: string) {
        let exec = r_url.exec(fullURL);
        if (exec) {
            this.host = exec[1] || '';

            // 앞의 /는 삭제한다.
            this.pathname = (exec[2] || '').replace(/^\//, '');
            this.search = exec[3] || '';
            this.hash = exec[4] || '';
        }
    }

    paths() {
        return this.path || (this.path = this.pathname.split(/\//));
    }


    equals(fullURL: string)
    equals(manager: URLManager)
    equals(v) {

        if (v == null) return false;

        if (typeof v === 'string') v = new URLManager(v);

        if (v.fullURL === this.fullURL) return true;

        if (v.host !== this.host) return false;
        if (v.pathname !== this.pathname) return false;
        if (!Search.equals(v.search, this.search)) return false;
        if (v.hash !== this.hash) return false;

        return true;
    }

}

export namespace URLManager {

    export function create(url: string) {
        return new URLManager(url);
    }

    // /admin/:name?music=:audio, {name: '고정철', audio: '네임'}  ===>   /admin/고정철?music=네임
    // 해당값이 없을시  키워드 부분을 삭제해버린다.
    export function queryExp(str: string, obj: {}) {

        let [url, query] = str.split(/\?/),
            URL = url.split(/\//).reduce((r, v) => {

                if (v[0] === ':' && (v = v.slice(1))) {
                    let value = Access.access(obj, v);
                    value != null && r.push(value);
                }
                else r.push(v);
                return r;

            }, []).join('/'),
            QUERY: string;

        // 쿼리 문자열이 있으면?
        if (query) {
            QUERY = query.split(/&/).reduce((r, v) => {

                let [prop, value] = v.split(/\=/);
                if (value[0] === ':' && (value = value.slice(1))) {
                    let u = Access.access(obj, value);
                    u != null && r.push(prop + '=' + u);
                }
                else r.push(v);

                return r;

            }, []).join('&');
        }
        return QUERY ? URL + '?' + QUERY : URL;
    }
}

