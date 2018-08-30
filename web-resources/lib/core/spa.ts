import {Search, URLManager} from "./location";
import {Mapper} from "./spa/mapper";
import {_extend} from "./core";
import {HTML} from "./html";

let
    RESOLVE = Promise.resolve();


class Provider {
    private factory: iSPA.factory<any>
    module: iSPA.module<any>
    element: HTMLElement

    // 클래스가 그대로 들어와도 되고, 객체가 들어와도 된다.
    constructor(public path: string, f: iSPA.module<any> | iSPA.factory<any>) {
        if (typeof f !== 'function') this.module = f;
        else this.factory = f;
    }

    param(p?) {
        let module = this.getModule(), {defaultParam} = module,
            param = _extend({}, typeof defaultParam === 'function' ? new defaultParam : defaultParam);
        if (p) param = _extend(p, param);
        return param;
    }

    init(param) {
        return this.getModule().init(param).then((ele) => this.element = ele);
    }

    private getModule() {
        return this.module || (this.module = new this.factory());
    }
}


export class SPA {

    private index: number
    private isHash = false;

    private url = new URLManager('')        // Dummy
    private list: Provider[] = []
    private $active: Provider
    private _queue = <Promise<any>>Promise.resolve();

    constructor(public config: iSPA.config) {
    }

    register(url: string, module: iSPA.module<any> | iSPA.factory<any>) {
        this.list.push(new Provider(url, module));
        return this;
    }

    // 이 메서드를 통해 모듈변경이 이루어진다.
    run(path: string): Promise<any> {

        let {url, $active} = this,
            m = new URLManager(path),
            {pathname, search} = m;

        //  ① 모듈변경
        if (url.pathname !== pathname) {

            let {list, list: {length: l}} = this, _index = 0, provider: Provider;

            while (l-- > 0) {
                if (list[l].path === pathname) {
                    provider = list[l];
                    _index = l;
                    break;
                }
            }

            if(provider) {
                let {index, config} = this,
                    param = Search.toObject(search, provider.param());

                this.url = m;               // 현재 url 갱신
                this.index = _index;        // 모듈 인덱스 갱신
                this.$active = provider;      // 현재 모듈 갱신

                this._queue = this._queue
                    .then(() => config.before && config.before(pathname, param, _index, index))
                    .then(() => Promise.all([
                        $active && $active.module.close(),
                        provider.init(param)
                    ]))
                    .then(([, html]) => {
                        return RESOLVE.then(() => provider.module.load(param))
                            .then(() => config.onChange(provider.element, $active && $active.element))
                    })
                    .then(() => config.after && config.after(pathname, param, _index, index));
            }
        }

        // ② 모듈 재로딩
        else if ($active && !Search.equals(url.search, search)) {
            this._queue = this._queue.then(() =>
                $active.module.load(Search.toObject(search, $active.param())));
        }


        return this._queue;
    }

    onHash() {
        if (!this.isHash) {
            SPA.onHash(this);
            this.isHash = true;
        }
        return this;
    }


}

export namespace SPA {

    import createFragment = HTML.createFragment;

    export function onHash(spa: SPA) {
        let handler = () => {
            location.hash && spa.run(location.hash.slice(1));
        }
        window.addEventListener('hashchange', handler);
        handler();
        return spa;
    }


    function get(url) {
        return new Promise<string>((o, x) => {

                let xhr = new XMLHttpRequest();
                xhr.onreadystatechange = () => {
                    if (xhr.readyState === 4) {
                        if (xhr.status === 200) {
                            o(xhr.responseText);
                        }
                        else x(xhr);
                    }
                }
                xhr.open('GET', url, true);
                xhr.send(null);
            }
        );
    }

    // html 문서 가지고 오기
    // 이건 서버에서 매칭되는 컨트롤러가 만드시 있어야 한다.
    // /$template/{value}
    export function getElement(url: string): Promise<DocumentFragment> {
        return get('/templates/' + url).then((text) => createFragment(text))
    }

    export function getStyle(url: string): Promise<HTMLStyleElement> {
        return get(url).then((text) => {
            let style = document.createElement('style');
            style.type = 'text/css';
            style.innerHTML = text;
            return style;
        })
    }

}