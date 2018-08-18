// 컨테이너 사이즈에 딱 맞추기
let
    _rate = (N: number, n: number) => (N - n) / n;

export let


    __cover = (W: number, H: number, w: number, h: number) => {
        let height = h + (_rate(W, w) * h);

        if (height < H) return {w: w + (_rate(H, h) * w), h: H};
        return {w: W, h: height};
    },

    // 외부사이즈에 딱 맞추기 (여백 있음)
    __adjust = (W: number, H: number, w: number, h: number) => {
        let height = h + (_rate(W, w) * h);

        if (height > H) return {w: w + (_rate(H, h) * w), h: H};
        return {w: W, h: height};
    },

    // 외부 사이즈(W,H)에 딱 맞추기
    // 마지막 인자가 true면 무조건 외부사이즈에 맞춤. 아니면 본래 사이즈
    _adjust = (W: number, H: number, w: number, h: number, forceSize = true) => {
        let size: { w: number, h: number }, pos: { x: number, y: number };

        // 강제 맞춤옵션이거나, 이미지가 대지보다 클 경우
        if (forceSize || W < w || H < h) size = __adjust(W, H, w, h);
        else size = {w: w, h: h};

        pos = __center(W, H, size.w, size.h);
        return {w: size.w, h: size.h, x: pos.x, y: pos.y};
    },

    // from에서 to로 변할때 val의 변환값
    __resize = (from: number, to: number, val: number) => {
        let ratio = (to - from) / from;
        return Math.floor(val + (val * ratio));
    },

    // 가로 사이즈에 딱 맞추기
    __adjustWidth = (W: number, H: number, w: number, h: number) => {
        return {w: W, h: h + Math.round(_rate(W, w) * h)};
    },

    // 세로사이즈에 딱 맞추기

    __adjustHeigth = (W: number, H: number, w: number, h: number) => {
        return {w: w + Math.round(_rate(H, h) * w), h: H};
    },

    // 가운데 맞춤
    __center = (W: number, H: number, w: number, h: number) => {
        return {x: Math.round((W - w) / 2), y: Math.round((H - h) / 2)};
    },
    __transform = (value: string) => {
        if (value && value.indexOf('rotate') !== -1) return parseInt(/\d+/.exec(value)[0]);
        else return 0;
    };


/*
 *  핀터레스트같은 꽉 채워진 퍼즐같은 이미지 만들기
 */
interface MosaicUnit {
    width: number,
    height: number
}

type handler<T> = (this: T, unit: T, top: number, left: number, width: number, height: number, index: number, colNum: number) => void;


/*
 *  ## 단순히 이미지를 (좌 -> 우)로 박스 쌓듯이 쌓는다.
 *
 *  전체 가로사이즈와 분할갯수를 가지고 이미지 위치를 설정한다.
 *  재사용을 위해 마지막 높이값을 반환한다.
 */
export function __puzzle<T extends MosaicUnit>(values: T[],
                                               split: number,           //
                                               outerWidth: number,      // 전체 가로 사이즈
                                               call: handler<T>,        // 콜백함수
                                               tops: number[] = []      // 시작높이
) {

    let width = Math.round(outerWidth / split),
        index = split;

    while (index-- > 0)
        if (tops[index] == null) tops[index] = 0;

    values.forEach(function (v, i) {
        let newHeight = __resize(v.width, width, v.height),
            pos = i % split;
        call.call(v, v, tops[pos], width * pos, width, newHeight, index++, pos);
        tops[pos] = tops[pos] + newHeight; // 높이 보정
    });

    return tops;
}

/*
 *  ## [튜닝버전] 높이를 봐가면서 쌓기
 */
export function __puzzleTune<T extends MosaicUnit>(values: T[],
                                                   split: number,           //
                                                   outerWidth: number,      // 전체 가로 사이즈
                                                   call: handler<T>,        // 콜백함수
                                                   tops: number[] = []      // 시작높이
) {

    let width = Math.floor(outerWidth / split),
        index = split;

    while (index-- > 0)
        if (tops[index] == null) tops[index] = 0;

    values.forEach(function (v, i) {
        let newHeight = __resize(v.width, width, v.height),
            pos = _min(tops);
        call.call(v, v, tops[pos], width * pos, width, newHeight, index++, pos);
        tops[pos] = tops[pos] + newHeight; // 높이 보정
    });

    return tops;
}

function _min(array: number[]) {
    let result = 0, i = 1, l = array.length, val = array[0];
    for (; i < l; i++) {
        if (array[i] < val) {
            val = array[result = i];
        }
    }
    return result;
}