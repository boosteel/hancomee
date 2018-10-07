import {r_number} from "../_regexp/number";
import {_remap} from "../_func/remap";
import {_date} from "../_func/datetime";

export namespace FormValue {

    let

        {forEach} = Array.prototype,
        dummy = {},
        r_date = /\d{4}-\d{1,2}-\d{1,2}/,
        /*
         *  ① type.name
         *  ② type
         */
        DEFAULT_GETTER = _remap({

            file(input: HTMLInputElement) {
                if (input.value) {
                    if (input.files) return input.files;
                    else input.value;
                }
                return null;
            },
            'select-multiple'(select: HTMLSelectElement) {
                let i = 0, {length} = select, array = [];
                for (; i < length; i++) {
                    if (select[i].checked) array.push(select[i]);
                }
                return array.length ? array : null;

            },
            date(date: HTMLInputElement) {
                let value = date.value;
                if (value && r_date.test(value))
                    return new Date(value);
                return null;
            },
            select(select: HTMLSelectElement) {
                let {selectedIndex} = select;
                if (selectedIndex !== -1) return select[selectedIndex].value;
                return null;
            },
            'select-one': 'select',
            radio(input: HTMLInputElement) {
                if (input.checked) return input.value;
                return null;
            },
            checkbox(input: HTMLInputElement) {
                if (input.checked) {
                    return input.value;
                } else {
                    let v = input.getAttribute('data-none');
                    if (v) {
                        return v === 'null' ? null : v;
                    }
                }
                return null;
            },
            number(input: HTMLInputElement) {

                let value = input.value;

                if (r_number.test(value))
                    return parseInt(value);
                return 0;
            },
            text(input: HTMLInputElement) {
                return input.value;
            },
            textarea: 'text'

        }),
        DEFAULT_SETTER = _remap({

            number(input: HTMLInputElement, val) {
                if (typeof val === "number") val = val.toString();
                else if (val == null || !r_number.test(val))
                    val = '0';
                input.value = val;
            },
            // null값이 들어올 수 있다.
            date(input: HTMLInputElement, val) {
                if (val == null) input.value = '';
                else {
                    if (val instanceof Date)
                        input.value = _date(val);
                    else input.value = val;
                }
            },
            radio(input: HTMLInputElement, val) {
                if (val == null) input.checked = false;
                else {
                    let value = input.getAttribute('value');
                    if (Array.isArray(val))
                        input.checked = val.indexOf(value) !== -1;
                    else input.checked = value == val;
                }
            },
            checkbox: 'radio',


        });


    export function reset(inputs: iEleArray, obj = dummy) {
        forEach.call(inputs, (v) => set(v, obj[v.name]))
    }

    export function set<T>(input: T, v: any): T {
        let f = DEFAULT_SETTER[input['type']];
        if (f) {
            f(input, v);
        } else {
            input['value'] = v == null ? '' : v;
        }

        return input;
    }

    export function serialize(form: ArrayLike<HTMLElement>)
    export function serialize(form: HTMLFormElement)
    export function serialize(form) {

        let {length} = form, v, vv,
            input, name, type,
            obj = {};

        while (length-- > 0) {

            input = form[length];

            if (!input.disabled && (name = input.name)) {

                type = input.type;

                if (DEFAULT_GETTER[type]) {
                    v = DEFAULT_GETTER[type](input)
                    if (vv = obj[name]) {
                        if (!Array.isArray(vv)) obj[name] = vv = [vv];
                        vv.push(v);
                    } else obj[name] = v;
                }
            }
        }

        return obj;
    }
}