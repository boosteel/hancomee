import {Arrays} from "../arrays";

type WatchAll<T> = (nTarget: T, oTarget?:T) => void
type Watch<T> = (this: T, newVal, oldVal, obj: T) => void
type WatchMap<T> = {
    [key: string]: Watch<T>
    '$'?: WatchAll<T>
    '*'?: WatchAll<T>
}

// 얕은 비교
function $equals(o, n) {

    // 둘 중 하나가 Array
    if (Array.isArray(o)) {
        if (!Array.isArray(n))
            return false;
        else if (!Arrays.equals(o, n))
            return false;
    }
    else if (o !== n)
        return false;
    return true;
};

// .으로 프로퍼티 읽어오기
class WatchName {

    private list: string[]
    private length

    constructor(public name: string) {
        this.length = (this.list = name.split('.')).length;
    }

    copy(obj) {
        if (obj == null) return obj;
        let {list, length} = this, i = 0;
        for (; i < length; i++) {
            if ((obj = obj[list[i]]) == null) return null;
        }
        return Array.isArray(obj) ? obj.slice() : obj;
    }
}

export class Watcher<T> {

    private _snapshot = {}

    private _watchList: WatchName[] = []
    private _watchMap: { [index: string]: Watch<T>[] } = {}
    private _applyHandler: WatchAll<T>[] = []
    private _targetChangeHandler: Watch<T>[] = [];     // target 자체가 바뀌었을때 호출

    constructor(public target?: T) {
    }


    set map(v: WatchMap<T>) {
        this.register(v);
    }

    set all(v: WatchAll<T>) {
        this._applyHandler.indexOf(v) === -1 && this._applyHandler.push(v);
    }

    /*
     *  watch할 프로퍼티를 등록한다.
     */
    register(p: string, v: Watch<T>)
    register(v: WatchAll<T>)
    register(v: WatchMap<T>)
    register(a, b?) {

        // applyHandler
        if (typeof a === 'function')
            this.all = a;

        else if (typeof a === 'string') {
            this.add(a, b);
        }
        // watchHandler
        else {
            let p;
            for (p in a) {
                this.add(p, a[p]);
            }
        }

        return this;
    }

    private add(p: string, v) {

        // 타겟이 바뀌었을때
        if (p === '$')
            this._targetChangeHandler.indexOf(v) === -1 && this._targetChangeHandler.push(v);
        else if (p === '*')
            this.all = v;
        else {
            let {_watchMap} = this;
            if (!_watchMap[p]) {
                this._watchList.push(new WatchName(p));
                _watchMap[p] = [];
            }
            _watchMap[p].push(v);
        }
    }

    apply(obj = this.target) {

        let {target, _snapshot, _watchMap, _watchList, _watchList: {length: l}} = this,
            wn: WatchName, name, oldVal, newVal;

        this.target = obj;

        // 타켓 자체가 바뀌었을때
        if (obj !== target)
            this._targetChangeHandler.forEach(v => v.call(obj, obj, target, obj));

        while (l-- > 0) {
            name = (wn = _watchList[l]).name;
            oldVal = _snapshot[name];
            newVal = _snapshot[name] = wn.copy(obj);
            if (!$equals(oldVal, newVal))
                _watchMap[name].forEach(v => v.call(obj, newVal, oldVal, obj));
        }

        // ① apply 핸들러
        this._applyHandler.forEach(h => h(obj, target));


        return this;
    }
}
