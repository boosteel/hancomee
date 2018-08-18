import {EventsGroup} from "../events";

export namespace FormActive {

    let placeholder_props = 'text number';

    // 플레이스홀더 설정
    export function placeholder(input: HTMLInputElement): EventsGroup {

        if (placeholder_props.indexOf(input.type) === -1)
            return null;

        let isActive: boolean,
            handler = () => {
                if (isActive = !input.value) input.value = input.getAttribute('data-placeholder')
            }

        handler();

        return new EventsGroup()
            .register(input, 'focus', () => isActive && (input.value = ''))
            .register(input, 'blur', handler);
    }
}
