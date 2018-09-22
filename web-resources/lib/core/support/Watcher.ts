import {Arrays} from "../arrays";

type WatchAll = (nTarget, oTarget) => void
type Watch = (newVal, oldVal) => void
type WatchMap = {
    [key: string]: Watch
    '$'?: WatchAll
    '*'?: WatchAll
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

export class Watcher {

    private _snapshot = {}

    private _watchList: WatchName[] = []
    private _watchMap: { [index: string]: Watch[] } = {}
    private _applyHandler: WatchAll[] = []
    private _targetChangeHandler: Watch[] = [];     // target 자체가 바뀌었을때 호출

    constructor(public target?) {
    }


    set map(v: WatchMap) {
        this.register(v);
    }

    set all(v: WatchAll) {
        this._applyHandler.indexOf(v) === -1 && this._applyHandler.push(v);
    }

    /*
     *  watch할 프로퍼티를 등록한다.
     */
    register(p: string, v: Watch)
    register(v: WatchAll)
    register(v: WatchMap)
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

        // 타켓 자체가 바뀌었을때
        if (obj !== target)
            this._targetChangeHandler.forEach(v => v(obj, target));

        while (l-- > 0) {
            name = (wn = _watchList[l]).name;
            oldVal = _snapshot[name];
            newVal = _snapshot[name] = wn.copy(obj);
            if (!$equals(oldVal, newVal))
                _watchMap[name].forEach(v => v(newVal, oldVal));
        }

        // ① apply 핸들러
        this._applyHandler.forEach(h => h(obj, target));

        this.target = obj;

        return this;
    }
}
