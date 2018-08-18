import {Search, URLManager} from "./location";
import {Mapper} from "./spa/mapper";

let
    filter = {
        before(i) {
            return typeof i.before === 'function'
        },
        after(i) {
            return typeof i.after === 'function'
        },
    }


class Provider extends Mapper {
    private module: iSPA.module
    private factory: iSPA.factory

    // 클래스가 그대로 들어와도 되고, 객체가 들어와도 된다.
    constructor(path: string[], f: iSPA.module | iSPA.factory) {
        super(path);
        if (typeof f !== 'function') this.module = f;
        else this.factory = f;
    }

    get() {
        return this.module || (this.module = new this.factory());
    }
}


export class SPA {

    private index: number

    private url = new URLManager('')        // Dummy
    private list: Provider[] = []
    private $active: iSPA.module

    private intercepters: iSPA.intercepter[] = []

    private _queue = <Promise<any>>Promise.resolve();

    /*
     *  { before: ~, after: ~ }
     *  모듈이 변경될때, 전후로 불려질 인터셉터
     */
    addIntercepter(intercepter: iSPA.intercepter) {
        let {intercepters} = this;
        intercepters.indexOf(intercepter) === -1 && intercepters.push(intercepter);
        return this;
    }

    register(url: string, module: iSPA.module) {
        this.list.push(new Provider(Mapper.toPath(url), module));
        return this;
    }

    // 이 메서드를 통해 모듈변경이 이루어진다.
    run(path: string): Promise<any> {
        let {url, $active} = this,
            m = new URLManager(path),
            {pathname, search} = m;

        //  ① pathname 체크 ==> 다를경우 새로운 모듈 로딩
        if (url.pathname !== pathname) {

            let temp = 0, count = 0, _index = 0, provider: Provider, param;

            // ③ 모듈 검색 (우선순위에 의한 선택)
            this.list.forEach((v, i) => {
                if (count < (temp = v.match(m.paths()))) {
                    provider = v;
                    _index = i;
                    count = temp;
                }
            });

            // ④ pathname에 해당하는 모듈이 있을 경우
            if (provider) {
                let {index, intercepters} = this,
                    module = provider.get();

                // ④-1 같은 모듈일 경우 load()   ex) {}나 *등으로 매핑된 모듈이 해당
                if (module === $active) {
                    this._queue = this._queue.then(() => this.$active.load(Search.toObject(search)));
                }

                // ④-2 모듈이 바뀐 경우는 allChange()
                else {
                    this.url = m;               // 현재 url 갱신
                    this.index = _index;        // 모듈 인덱스 갱신
                    this.$active = module;      // 현재 모듈 갱신

                    param = Search.toObject(search, provider.map(m.paths()));

                    this._queue = this._queue

                    // ① 열려진 모듈이 있으면 먼저 닫는다.
                        .then(() => $active && $active.close())

                        // ② 모듈 init
                        .then(() => provider.get().init(param).then((html) => {

                            // ③ intercepters 중에 before가 등록된 것만 실행
                            return Promise.all(intercepters.filter(filter.before)
                                .map(i => i.before(html, param, _index, index)))

                            // ④ 모듈 load
                                .then(() => module.load(param))

                                // ⑤ intercepters 중에 after가 등록된 것만 실행
                                .then(() => Promise.all(intercepters.filter(filter.after)
                                    .map(i => i.after(html, param, _index, index))))
                        }));
                }
            }
        }

        /*
         *  ② search 체크 ==> 모듈 재로딩
         */
        else if ($active && !Search.equals(url.search, search))
            this._queue = this._queue.then(() => this.$active.load(Search.toObject(search)));

        return this._queue;
    }


}

export namespace SPA {

    export function onHash(spa: SPA) {
        let handler = () => {
            location.hash && spa.run(location.hash.slice(1));
        }
        window.addEventListener('hashchange', handler);
        handler();
        return spa;
    }

}