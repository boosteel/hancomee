import {Arrays} from "../arrays";


export class NameMap<T> {

    private map: { [index: string]: { data: T, names: string[] }[] } = {}
    private datas: T[] = [];        // 중복방지를 위한 리스트

    get(): T[]
    get(name: string): T[]
    get(name?): T[] {

        if(typeof name !== 'string') return this.datas;

        let {map} = this,
            [key, ...args] = name.split(/\./),
            list = map[key];

        if(!list) return [];

        return list.filter(v => Arrays.startWith(args, v.names)).map(v => v.data);
    }

    add(name: string, data: T) {
        if(this.datas.indexOf(data) === -1) {
            let {map} = this,
                [key, ...args] = name.split(/\./);

            (map[key] || (map[key] = [])).push({names: args, data: data});
            this.datas.push(data);
        }
        return this;
    }

    remove(name: string) {
        let {map, datas} = this,
            [key, ...args] = name.split(/\./),
            list = map[key];

        if(list) {
            map[key] = list.filter(v => {
                if(Arrays.startWith(args, v.names)) {
                    datas.splice(datas.indexOf(v.data), 1);
                    return false;
                }
                return true;
            });
        }

        return this;
    }

}