export class Mapper {


    constructor(public path: string[]) {
    }

    map(pathname: string): {}
    map(path: string[]): {}
    map(target) {
        if (typeof target === 'string') target = Mapper.toPath(target);

        return this.path.reduce((map, v, i) => {
            if (v[0] === '{') map[v.substring(1, v.length)] = target[i];
            return map;
        }, {});
    }

    // 우선순위를 점수로 계산한다.
    match(pathname: string): number
    match(path: string[]): number
    match(target) {

        if (typeof target === 'string') target = Mapper.toPath(target);

        let {path} = this, l = target.length, result = 0, v;

        if (path.length === l) {
            for (let i = 0; i < l; i++) {
                v = path[i];
                if (v[0] === '*' || v[0] === '{') result += i + 2;
                else if (v === target[i]) result += i + 3;
                else return 0;
            }
        }

        return result;
    }

}

export namespace Mapper {

    let r_erase = /^\/+|\/+$/,
        r_split = /\/+/;

    export function toMapper(str: string) {
        return new Mapper(toPath(str));
    }

    export function toPath(pathname: string) {
        return pathname ? pathname.replace(r_erase, '').split(r_split) : [];
    }

}
