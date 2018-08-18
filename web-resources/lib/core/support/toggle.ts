import {DOM} from "../dom";

export namespace Toggle {

    import className = DOM.className;
    import hasClass = DOM.hasClass;

    let
        r_dropdown = ['dropdown'],
        r_open = ['show', 'open'],

        active: HTMLElement,

        act = (dropdown: HTMLElement, flag: boolean) => {
            className(dropdown, r_open, flag);
            className(dropdown.querySelector('.dropdown-menu'), r_open, flag);

            if(flag) active = dropdown;
            else active = null;
        };

    (function () {

        document.addEventListener('click', (e) => {

            let ele = <HTMLElement>e.target,

                dropdown: HTMLElement,
                btn = false,
                dismiss = false;

            // 순회
            do {
                // dropdown 찾기
                if (hasClass(ele, r_dropdown)) {
                    dropdown = ele;
                    break;
                }
                // 끄기 버튼
                else if (ele.hasAttribute('data-dismiss'))
                    dismiss = true;

                // 타켓 확인
                else if (ele.hasAttribute('data-toggle')) {
                    if (ele.getAttribute('data-toggle') === 'dropdown') btn = dismiss = true;
                    else return;
                }
            } while (ele = ele.parentElement);

            // ① dropdown 객체일 경우
            if (dropdown) {
                // 현재 열려진
                if (hasClass(dropdown, r_open)) {
                    dismiss && act(dropdown, false);
                }
                else {
                    btn && act(dropdown, true);
                }

            }
            // ① dropdown 객체가 아닌 경우에는 현재 열려진 거 닫기
            else if(active) {
                dropdown = active
                while(dropdown = dropdown.parentElement) {
                    hasClass(dropdown, r_dropdown) && (active = dropdown);
                }
                act(active, false);
            }

        });
    })();

}
