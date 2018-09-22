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

            if (flag) active = dropdown;
            else active = null;
        };

    (function () {

        document.addEventListener('click', (e) => {

            let ele = <HTMLElement>e.target,

                dropdown: HTMLElement,
                btn = false,            // 토글버튼인지 확인
                dismiss = false;        // dropdown 이하에 dismiss 설정 확인

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

            // 현재 활성화된게 있고, 찾은 dropdown과 다르다면 무조건 끈다.
            if (active && active !== dropdown) act(active, false);


            // ① dropdown 객체를 찾았을때
            if (dropdown) {

                // 현재 열려져있다면 dismiss 체킹이 되어있을때만 없앤다.
                if (hasClass(dropdown, r_open)) {
                    dismiss && act(dropdown, false);
                }
                // 아니라면 btn을 클릭했을 경우에만 켠다.
                else {
                    btn && act(dropdown, true);
                }
            }

        });
    })();

}
