let _elementsFromPoint = (function (fn) {

    let handler: (x: number, y: number) => Element[];

    // ① elementsFromPoint (○)
    if (fn) {
        handler = (x, y) => fn.call(document, x, y);
    }
    // ② elementsFromPoint (X)
    else {
        let _handler = function (target, x, y, array, pos) {
            if(target == null) return array;
            if (!target.parentElement) {
                array[pos] = target;
                return array;
            }
            let {style} = target, {visibility} = style;
            array[pos] = target;
            style.visibility = 'hidden';
            _handler(document.elementFromPoint(x, y), x, y, array, pos + 1);
            style.visibility = visibility;

            return array;
        }
        handler = (x, y) => _handler(document.elementFromPoint(x, y), x, y, [], 0);
    }

    return handler;

})(document.elementsFromPoint);


// 커서 위치(or MouseEvent)를 받아 그 지점에 위치한 엘리먼트 배열을 돌려준다.
// document.elementsFromPoint와 같은 역할
// :: ie9가 이를 지원하지 않으므로 만든 유틸메서드
export function elementsFromPoint(e: MouseEvent): Element[]
export function elementsFromPoint(x: number, y: number): Element[]
export function elementsFromPoint(x, y?): Element[] {
    if (typeof x !== 'number') {
        let event: MouseEvent = x;
        x = event.clientX;
        y = event.clientY;
    }
    return _elementsFromPoint(x, y);
}