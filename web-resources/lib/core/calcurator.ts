export namespace Calcurator {


    // num1이 num1c로 변할때 num2의 값
    export function ratio(num1: number, num1c: number, num2: number) {
        return num2 + (num2 * ((num1c - num1) / num1))
    }

}

export namespace ImageCal {

    function __tilt(rotate: number, r = Math.abs(rotate % 360)) {
        return r === 90 || r === 270
    }

    function __ratio(num1: number, num1c: number, num2: number) {
        return num2 + (num2 * ((num1c - num1) / num1))
    }

    // [x, y, width, height]
    export function alignment(w: number, h: number, rotate: number, W: number, H: number) {

        if(__tilt(rotate)) {
            let maxHeight = __ratio(w, H, h);

            if(maxHeight > W) {
                w = __ratio(h, W, w);
                return [(W - w) / 2, (H - W) / 2, w, W]
            } else {
                w = H;
                return [(W - w) / 2, (H - maxHeight) / 2, w, maxHeight];
            }
        }

        let maxHeight = __ratio(w, W, h);

        // 세로를 딱 맞춰야 할 경우
        if(maxHeight > H) {
            w = __ratio(h, H, w);
            return [(W - w) / 2, 0, w, H]
        } else {
            h = maxHeight;
            return [0,  (H - h) / 2, W, h];
        }
    }

}