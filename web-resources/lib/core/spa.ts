import {Search, URLManager} from "./location";
import {Mapper} from "./spa/mapper";
import {_extend} from "./core";
import {HTML} from "./html";

let
    RESOLVE = Promise.resolve();


class SPAInfo implements iSPA.Info {
    constructor(public pathname: string,
                public param,
                public index: number,
                public beforeIndex: number,
                public way = beforeIndex === -1 ? index : index - beforeIndex) {
    }
}

class Provider {
    private _factory: iSPA.factory<any>
    private _module: iSPA.module<any>
    element: HTMLElement

    // 클래스가 그대로 들어와도 되고, 객체가 들어와도 된다.
    constructor(public path: string, f: iSPA.module<any> | iSPA.factory<any>) {
        if (typeof f !== 'function') this._module = f;
        else this._factory = f;
    }

    param(p?) {
        let param = this.module.getParam();
        if (p) param = _extend(p, param);
        return param;
    }

    init() {
        return this.module.init().then((ele) => this.element = ele);
    }

    get module() {
        return this._module || (this._module = new this._factory());
    }
}


export class SPA {

    private isHash = false;

    private url: URLManager = null        // Dummy
    private list: Provider[] = []
    private names: string[] = []
    private $active: Provider
    private _queue = <Promise<any>>Promise.resolve();


    param
    info: iSPA.Info

    constructor(public config: iSPA.config) {
    }

    // 모듈 등록
    register(url: string, module: iSPA.module<any> | iSPA.factory<any>) {
        this.names.push(url);
        this.list.push(new Provider(url, module));
        return this;
    }

    // 이 메서드를 통해 모듈변경이 이루어진다.
    run(path: string): Promise<any> {

        let {list, names,url, $active, info, config, config:{defaultURL}} = this,
            newURL = new URLManager(path),
            {pathname, search} = newURL;

        //  ① 모듈변경
        if (!url || url.pathname !== pathname) {

            let index = names.indexOf(pathname),
                provider = list[index];

            // 없는 모듈의 경우 :: defaultURL로 이동한다.
            if (index === -1) {
                if(info == null) location.hash = defaultURL;
            } else {

                let param = this.param = Search.toObject(search, provider.param()),
                    nInfo = this.info = new SPAInfo(pathname, param, index,
                        info ? info.index : -1);

                this.url = newURL;
                this.$active = provider;      // 현재 모듈 갱신
                this._queue = this._queue
                    .then(() => config.before && config.before(nInfo))
                    .then(() => Promise.all([
                        $active && $active.module.close(),
                        provider.init()
                    ]))
                    .then(([, html]) => {
                        return RESOLVE.then(() => provider.module.load(param, search, provider.element))
                            .then(() => config.onChange(provider.element, $active && $active.element, nInfo))
                    })
                    .then(() => config.after && config.after(nInfo))
                    .catch(function (e: Error) {
                        console.error(e.message)
                        console.error(e.stack)
                    });
            }
        }

        // ② 모듈 재로딩
        else if ($active && !Search.equals(url.search, search)) {
            this._queue = this._queue.then(() =>
                $active.module.load(
                    this.param = Search.toObject(search, $active.param()), search, $active.element)
            );
        }


        return this._queue;
    }

    onHash() {
        if (!this.isHash) {
            let handler = () => {
                this.run(location.hash.slice(1));
            }
            window.addEventListener('hashchange', handler);
            handler();
            this.isHash = true;
        }
        return this;
    }


}

export namespace SPA {

    import createFragment = HTML.createFragment;

    function get(url) {
        return new Promise<string>((o, x) => {

                let xhr = new XMLHttpRequest();
                xhr.onreadystatechange = () => {
                    if (xhr.readyState === 4) {
                        if (xhr.status === 200) {
                            o(xhr.responseText);
                        }
                        else o('');
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
    export function getFragment(url: string): Promise<DocumentFragment> {
        return get('/templates/' + url).then((text) => createFragment(text))
    }

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