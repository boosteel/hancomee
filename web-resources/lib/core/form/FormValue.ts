import {$$, r_number} from "./_commons";


export namespace FormValue {

    let /*
         *  ① type.name
         *  ② type
         */
        DEFAULT_GETTER = $$({

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
            select(select: HTMLSelectElement) {
                let {selectedIndex} = select;
                console.log(selectedIndex);
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
                }
                return null;
            },
            number(input: HTMLInputElement) {
                if (r_number.test(input.value))
                    return parseInt(input.value);
                return 0;
            },
            text(input: HTMLInputElement) {
                return input.value;
            },
            textarea: 'text'

        });

    export function serialize(form: HTMLFormElement) {

        let {length} = form, v, vv,
            input, name, type,
            obj = {};

        while (length-- > 0) {

            input = form[length];

            if (!input.disabled) {

                name = input.name;
                type = input.type;

                if (v = (DEFAULT_GETTER[type] && DEFAULT_GETTER[type](input))) {
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