

/*
 *  버튼과 인풋을 일원화시킨다.
 */

type Handler = (input: HTMLInputElement, btn: HTMLButtonElement) => void


export function focusBtn(input: HTMLInputElement, btn: HTMLButtonElement, handler: {focus: Handler, blur: Handler}) {

    let temp = false;

    input.addEventListener('focusin', () => {
        handler.focus(input, btn);
    });
    input.addEventListener('focusout', () => {
        handler.blur(input, btn);
    });
    btn.addEventListener('mousedown', () => {
        temp = document.activeElement !== input;
    })
    btn.addEventListener('click', () => {
        temp && input.focus();
        temp = false;
    })
}