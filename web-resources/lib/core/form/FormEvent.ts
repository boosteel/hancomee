import {Events, EventsGroup} from "../events";
import {DOM} from "../dom";

export namespace FormEvent {

    import className = DOM.className;
    let
        {forEach} = Array.prototype,
        placeholder_props = 'text number';

    // 플레이스홀더 설정
    export function placeholder(input: HTMLInputElement,
                                val = input.getAttribute('data-placeholder')): EventsGroup {

        if (placeholder_props.indexOf(input.getAttribute('data-type') || input.type) === -1)
            return null;

        let isActive: boolean,
            handler = () => {
                if (isActive = !input.value) input.value = val;
                className(input, 'empty', isActive);
            }

        handler();

        return new EventsGroup()
            .register(input, 'focus', () => isActive && (input.value = ''))
            .register(input, 'change', handler)
            .register(input, 'blur', handler);
    }

    // 사용하면 안되는 문자를 기입한다.
    export function eraser(input: HTMLInputElement, regexp: string) {
        let reg = new RegExp(regexp, 'gi'),
            handler = () => input.value = input.value.replace(reg, '');

        return new EventsGroup()
            .register(input, 'keyup', handler)
            .register(input, 'change', handler)
    }

    export function checkLen(inputs: ArrayLike<HTMLElement>, min = 0, max = inputs.length) {
        let select = [],
            handler = (e) => {
                let input = <HTMLInputElement>e.target,
                    {length} = select;

                // 추가할때
                if (input.checked) {
                    while (length >= max) {
                        select.shift().checked = false;
                        length--;
                    }
                    select[length] = input;
                }
                // 뺄때
                else {
                    if (length > min) {
                        select.splice(select.indexOf(input), 1);
                    } else input.checked = true;
                }
            },
            group = new EventsGroup();


        forEach.call(inputs, (v) => {
            v.checked && select.push(v);
            group.register(v, 'change', handler)
        });
        return group;
    }
}
