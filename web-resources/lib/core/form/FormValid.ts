import {_remap} from "../_func/remap";
import {r_number} from "../_regexp/number";
import {Forms} from "./Forms";


interface ValidHandler {
    '*'(errors: string[], input: INPUTS, group: HTMLElement, form: HTMLElement);

    [index: string]: (errors: string[], input: INPUTS, group: HTMLElement, form: HTMLElement) => void
}



export namespace FormValid {

    let
        /*
         *  ① attr.type.name
         *  ② attr.type
         *  ③ attr
         */
        input_valid: INPUT_MAP = _remap({

            // 두번째 인자값은 해당 어트리뷰트의 값
            required(target) {
                return !!target.value;
            },

            'required.select-multiple'(target: HTMLSelectElement, v: string) {

                let {length} = target;
                while (length-- > 0)
                    if (target[length].selected) return true;
                return false;
            },
            'required.select': 'required.select-multiple',
            'required.select-one': 'required.select-multiple',

            'pattern.text'(target: HTMLInputElement, v: string) {
                try {
                    return new RegExp(v).test(target.value);
                } catch (e) {
                    return true;
                }
            },

            'maxlength.text'(target: HTMLInputElement, v: string) {
                if (!r_number.test(v)) return true;
                return !(target.value.length > parseInt(v));
            },
            'maxlength.textarea': 'maxlength.text',

            'minlength.text'(target: HTMLInputElement, v: string) {
                if (!r_number.test(v)) return true;
                return !(target.value.length < parseInt(v));
            },
            'minlength.textarea': 'minlength.text',


            'max.select'(target: HTMLSelectElement, v: string) {
                if (!r_number.test(v)) return true;
                let max = parseInt(v), {length} = target, selected = 0;
                while (length-- > 0)
                    target[length].selected && selected++;

                return !(max < selected);
            },
            'max.select-multiple': 'max.select',
            'max.select-one': 'max.select',
            'min.select'(target: HTMLSelectElement, v: string) {
                if (!r_number.test(v)) return true;
                let min = parseInt(v), {length} = target;
                while (length-- > 0)
                    if (target[length].selected && --min === 0) return true;
                return false;
            },
            'min.select-multiple': 'min.select',
            'min.select-one': 'min.select',

            'min.number'(target: HTMLInputElement, v: string) {

            }
        }),

        group_valid: GROUP_MAP = _remap({
            min(ele: HTMLElement, val: string) {
            },
            max(ele: HTMLElement, val: string) {

            }
        }),

        error_msg = {
            required: '반드시 필요한 항목입니다.'
        };


    let skipProps = 'name type'.split(' ');


    // 각 key를 조합해 검증 핸들러를 찾는다.
    function _input(input: INPUTS, attrName: string, attrValue: string, type = input.type, name = input.name): boolean {
        let fn = input_valid[attrName + '.' + type + '.' + name] ||
            input_valid[attrName + '.' + type] ||
            input_valid[attrName];
        return fn ? fn(input, attrValue) : true;
    }

    function _group(group: HTMLElement, attrName: string, attrValue: string): boolean {
        let fn = group_valid[attrName];
        return fn ? fn(group, attrValue) : true;
    }

    function _message(attrName: string, attrValue: string, type: string, name: string) {
        let msg = error_msg[attrName + '.' + type + '.' + name] ||
                error_msg[attrName + '.' + type] ||
                error_msg[attrName];
        if (msg) return msg.replace(/%/g, attrValue);
        return attrName + ' is wrong.' + '(:' + attrValue + ')';
    }

    export function $valid(target: HTMLElement, h?: ValidHandler)
    export function $valid(forms: Forms, h?: ValidHandler)
    export function $valid(t, h?: ValidHandler) {
        let form: Forms = t instanceof Forms ? t : Forms.createForms(t),
            {element} = form,
            result = true;

        if (h) {
            form.groups.forEach(group => {
                let name, {element: e, inputs} = group, handler;
                for (name in inputs) {
                    handler = h[name] || h['*'];
                    inputs[name].forEach(input => {
                        let {type, attributes, attributes: {length: l}} = input,
                            n, v, errors = [];

                        while (l-- > 0) {
                            if(skipProps.indexOf(n = attributes[l].name) == -1) {
                                if (_input(input, n = attributes[l].name, v = attributes[l].value, type, name))
                                    errors.push(_message(n, v, type, name));
                            }
                        }
                        result = errors.length ? result : false;
                        handler.call(handler, errors, input, e, element);
                    })
                }
            });
        } else {
            form.groups.forEach(group => {
                let name, {inputs} = group;
                for (name in inputs) {
                    inputs[name].forEach(input => {
                        let {type, attributes, attributes: {length: l}} = input, attr: Attr;

                        while (l-- > 0) {
                            attr = attributes[l];
                            result = _input(input, attr.name, attr.value, type, name) ? result : false;
                        }
                    })
                }
            });
        }
        return result;
    }
    
    export function input(i: INPUTS) {
        let {type, name, attributes, attributes: {length: l}} = i;
        while(l-- > 0) {
            if(!_input(i, attributes[l].name, attributes[l].value, type, name))
                return false;
        }
        return true;
    }
}
