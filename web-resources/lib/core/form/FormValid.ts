import {each, eachChilds} from "./_commons";
import {_remap} from "../_func/remap";
import {r_number} from "../_regexp/number";


type RESULT_HANDLER<T> = (this: T, isValid: boolean, input: INPUTS, group: HTMLElement, form: HTMLFormElement) => void;

let {map: $$map, forEach: $$forEach, reduce: $$reduce} = Array.prototype;

/*
 *  폼 검증 결과로 제공하는 객체
 */
class VALID<T> {
    errors: string[] = []

    constructor(public element: T, public isValid = true) {
    }

    setValid(flag: boolean) {
        this.isValid = flag;
        return this;
    }

    addError(msg: string) {
        let {errors} = this;
        errors.indexOf(msg) === -1 && errors.push(msg);
        this.isValid = false;
        return this;
    }

}

// <input>
class ValidInput extends VALID<INPUTS> {

    each(handler: RESULT_HANDLER<ValidInput>) {
        let {element} = this;
        handler.call(this, this.isValid, element, element.closest('.form-group'), element.form);
        return this;
    }

}

// <div class="form-group">
class ValidGroup extends VALID<HTMLElement> {
    private inputs: ValidInput[] = []

    addInput(input: ValidInput) {
        if (!input.isValid) this.setValid(false);
        this.inputs.push(input);
        return this;
    }

    each(handler: RESULT_HANDLER<ValidGroup>): this
    each<T>(handler: RESULT_HANDLER<T>, context: T): this
    each(handler: RESULT_HANDLER<ValidGroup>, _context?) {
        let {element, inputs, inputs: {length: l}} = this,
            i = 0, input: ValidInput,
            context = _context || this;
        while (i < l) {
            input = inputs[i++];
            handler.call(context, input.isValid, input.element, element, input.element.form);
        }
        return this;
    }
}


// <form>
class ValidForm extends VALID<HTMLFormElement> {

    private groups: ValidGroup[] = []

    addGroup(group: ValidGroup) {
        if (!group.isValid) this.setValid(false);
        this.groups.push(group);
        return this;
    }

    each(handler: RESULT_HANDLER<ValidForm>) {
        this.groups.forEach(g => g.each(handler, this));
        return this;
    }
}


/*
 *  폼 검증을 위한 검증핸들러를 가진 객체.
 *  엘리먼트를 받아 어트리뷰트값을 모두 순회하며, 등록된 검증핸들러를 찾는다.
 *  핸들러가 존재하면 이를 통해 값을 검증한다.
 *  그 결과로 VALID객체를 반환한다.
 */
export class FormValid {

    constructor(
        public inputs: INPUT_MAP = {},
        public groups: GROUP_MAP = {},
        public errors: ERROR_MAP = {}
    ) {
    }

    input(target: INPUTS) {

        let {name, type} = target,
            obj = new ValidInput(target);

        each(target, (p, v,) => {
            if (!this._input(target, p, v, name, type)) {
                obj.setValid(false).addError(this._message(p, v, type, name))
            }
        })
        return obj;
    }


    group(target: HTMLElement) {
        let obj = new ValidGroup(target);

        // form 자체 검증
        each(target, (p, v) => {
            this._group(target, p, v) || obj.addError(this._message(p, v, 'group', name))
        });

        // inputs 검증
        eachChilds(target.querySelectorAll('[name]'), (child) => obj.addInput(this.input(child)))

        return obj;
    }

    form(form: HTMLFormElement) {
        let obj = new ValidForm(form);
        eachChilds(form.querySelectorAll('.form-group'), (child) => obj.addGroup(this.group(child)));
        return obj;
    }


    // 각 key를 조합해 검증 핸들러를 찾는다.
    private _input(input: INPUTS, attrName: string, attrValue: string, type = input.type, name = input.name): boolean {
        let {inputs} = this,
            fn = inputs[attrName + '.' + type + '.' + name] ||
                inputs[attrName + '.' + type] ||
                inputs[attrName];
        return fn ? fn(input, attrValue) : true;
    }


    private _group(group: HTMLElement, attrName: string, attrValue: string): boolean {
        let fn = this.groups[attrName];
        return fn ? fn(group, attrValue) : true;
    }

    private _message(attrName: string, attrValue: string, type: string, name: string) {
        let {errors} = this,
            msg = errors[attrName + '.' + type + '.' + name] ||
                errors[attrName + '.' + type] ||
                errors[attrName];
        if (msg) return msg.replace(/%/g, attrValue);
        return attrName + ' is wrong.' + '(:' + attrValue + ')';
    }
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
        },

        DEFAULT_FORM_VALID = new FormValid(input_valid, group_valid, error_msg);


    function extend(dist, source) {
        if (!source) return dist;
        let p;
        for (p in source) dist[p] = source[p];
    }

    // 새로운 FormValid 생성
    export function extendOption(data: { input?: INPUT_MAP, group?: GROUP_MAP, error?: ERROR_MAP }) {
        return new FormValid(
            extend(Object.create(input_valid), data.input),
            extend(Object.create(group_valid), data.group),
            extend(Object.create(error_msg), data.error)
        )
    }

    /*
     *  Default 설정을 사용할때는 아래 static 메서드를 사용하면 된다.
     *  특수한 검증이 필요할 경우에는 직접 FormValie 객체를 만들어서 사용하면 된다.
     */
    export function inputs(inputs: ({[index: number]: INPUTS}) | NodeListOf<any>) {
        return $$map.call(inputs, i => input(i));
    }

    export function input(input: INPUTS) {
        return DEFAULT_FORM_VALID.input(input);
    }

    export function group(group: HTMLElement) {
        return DEFAULT_FORM_VALID.group(group);
    }

    export function form(form: HTMLFormElement) {
        return DEFAULT_FORM_VALID.form(form);
    }


}
