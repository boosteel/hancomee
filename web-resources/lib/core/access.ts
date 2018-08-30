/**
 * Created by hellofunc on 2017-03-01.
 */

export namespace Access {

    // dot으로 구분된 프로퍼티 읽어오기
    export let read = (function () {
        function ___read(prop: string, data: {}) {
            let value = data[prop];
            return typeof value === 'function' ? value.call(data) : value;
        }

        return (prop: string, data: {}, nullSafeVal = null) => {
            let props = prop.split(/\./),
                i = 0, l = props.length,
                result: any = data;

            for (; i < l; i++) {
                result = ___read(props[i], result);
                if (result == null) return nullSafeVal;
            }
            return primitive(result);
        }
    })();


    export let primitive = (function () {
        let
            r_number = /^\d+$/,
            r_boolean = /^true$|^false$/,
            r_string = /^['"][^"']+['"]$/,
            r_date = /^\d{4}-\d{2}-\d{2}$|^\d{4}-\d{2}-\d{2}\s\d{2}:\d{2}:\d{2}$/,

            r_string_replace = /["']/g;

        return (val) => {
            if (typeof val === 'string' && val.length > 0) {
                if (r_number.test(val)) return parseInt(val);
                if (r_boolean.test(val)) return val === 'true';
                if (r_string.test(val)) return val.replace(r_string_replace, '');
                if(r_date.test(val)) return new Date(val)
            }
            return val;
        };
    })();

    export function access(target, _props: string): any
    export function access<T>(target: T, _props: string, val, force: boolean): T
    export function access(target, _props: string, val?, force?: boolean) {
        let
            props = _props.split(/\./),
            len = props.length - 1,
            obj = target, temp,
            i = 0;

        for (; obj != null && i < len; i++) {
            temp = obj[props[i]];
            if (temp == null && force) temp = obj[props[i]] = {};
            obj = temp;
        }

        // [1] getter
        if (arguments.length === 2) return obj != null ? obj[props[i]] : obj;

        // [2] setter
        obj != null && (obj[props[i]] = val);
        return target;
    }
}



