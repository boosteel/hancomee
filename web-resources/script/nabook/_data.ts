import {$extend} from "../../lib/core/core";
import {_reduce, _reduceN} from "../../lib/core/_func/array";

let
    $assemble = {
        datetime(val) {
            return
        }
    },
    $disassmble = {
        datetime(val) {
            return typeof val === 'number' ? new Date(val) : val;
        }
    }

function $get(url: string): Promise<any> {
    return new Promise((resolve, error) => {
        let xhr = new XMLHttpRequest();
        xhr.onreadystatechange = () => {
            if (xhr.readyState === 4) {
                if (xhr.status === 200) resolve(JSON.parse(xhr.responseText));
                else error(xhr);
            }
        }
        xhr.open('GET', url, true);
        xhr.send(null);
    });
}

function $post(url: string, data): Promise<any> {
    return new Promise((resolve, error) => {
        let xhr = new XMLHttpRequest();
        xhr.onreadystatechange = () => {
            if (xhr.readyState === 4) {
                if (xhr.status === 200) resolve(JSON.parse(xhr.responseText));
                else error(xhr);
            }
        }
        xhr.open('POST', url, true);
        xhr.setRequestHeader('Content-Type', 'application/json');
        xhr.send(JSON.stringify(data));
    });
}

function $delete(url: string): Promise<any> {
    return new Promise((resolve, error) => {
        let xhr = new XMLHttpRequest();
        xhr.onreadystatechange = () => {
            if (xhr.readyState === 4) {
                if (xhr.status === 200) resolve();
                else error(xhr);
            }
        }
        xhr.open('DELETE', url, true);
        xhr.send(null);
    });
}

export class DataMap {
    names: string[] = []
    idMap: {[index: number]: Data} = {}
    newsMap: {[index: string]: Data[]} = {}


    update(id, h: (v: Data) => void) {
        h(this.idMap[id]);
        return this;
    }

    filter(h: (v: Data, p: string) => any): Data[] {
        let p, {newsMap} = this, array = [];
        for(p in newsMap) {
            newsMap[p].forEach( v => h(v, p) === true && array.push(v));
        }
        return array;
    }

    each(h: (v: Data, p: string) => void) {
        let p, {newsMap} = this;
        for(p in newsMap) {
            newsMap[p].forEach( v => h(v, p));
        }
        return this;
    }

    add(data: Data) {
        let {newsMap, names, idMap} = this,
            {id, news} = data,
            array = newsMap[news];

        if(!array) {
            names.push(news);
            array = newsMap[news] = [];
        }

        array.push(data);
        idMap[id] = data;

        return this;
    }

    remove(data: Data) {
        let array = this.newsMap[data.news];
        array.splice(array.indexOf(data), 1);
        delete this.idMap[data.id];
        return this;
    }
}


export class Data {
    id: number
    datetime: Date
    url: string
    news: string
    subject: string
    value: string
    section: string
    chk: boolean

    constructor(data) {
        this.reset(data);
    }

    reset(data) {
        $extend(this, data, $disassmble);
        return this;
    }

    toJSON() {
        return $extend({}, this, $assemble);
    }
}

export namespace Data {

    export function list(): Promise<DataMap> {
        return $get('/nabook/list').then((r: Data[]) => {
            let dataMap = new DataMap();
            r.forEach( v => dataMap.add(new Data(v)))
            return dataMap;
        });
    }


    export function save(data): Promise<number> {
        return $post('/nabook/save', data);
    }

    export function update(data): Promise<number> {
        return $post('/nabook/update', data);
    }
    
    export function sections() {
        return $get('/nabook/sections').then( (v: {name: string, count: number}[]) => {
            return _reduceN(v, (r, v) => r[v.name] = v.count, {})
        } );
    }

    export function section(id, section) {
        return new Promise((resolve, error) => {
            let xhr = new XMLHttpRequest();
            xhr.onreadystatechange = () => {
                if (xhr.readyState === 4) {
                    if (xhr.status === 200) resolve(JSON.parse(xhr.responseText));
                    else error(xhr);
                }
            }
            xhr.open('PUT', '/nabook/section/' + id + '/' + section, true);
            xhr.send(null);
        });
    }
}

