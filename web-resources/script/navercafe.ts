import {$ready} from "../lib/core/core";
import {CountLoop} from "../lib/core/loop";
import {Template} from "../lib/core/template";
import {DOM} from "../lib/core/dom";
import className = DOM.className;

interface INFO {
    name: string
    url: string
    id: number
}
interface DATA {
    soldout: boolean
    title: string
    url: string
    user: string
    count: number
}

type CONFIG = {
    name: string
    url: string
    link: string
}

let $$resolve = Promise.resolve(),
    filter: RegExp = (function (key) {
        return key ? new RegExp(key, 'gi') : null;
    })(decodeURIComponent(location.search.replace(/^\?/, '')));

@Template(
    {
        ul(ele: HTMLUListElement, attrs, data: Data) {
            return () => {
                let {values, checks} = data, v: DATA, title: string,
                    html = [],
                    i = 0, l = 20;

                for (; i < l; i++) {

                    if (v = values[i]) {

                        let classes = [], ii = 0;

                        if (v.soldout) classes[ii++] = 'sold-out';
                        if(checks.length && checks.indexOf(v.url) === -1) classes[ii++] = 'new';

                        if (filter && filter.test(v.title)) {
                            title = '<span class="catch"><a href="' + v.url + '" target="_blank">' +
                                v.title.replace(filter, (a) => '<b>' + a + '</b>') +
                                '</a></span></li>';
                        } else {
                            title = '<span><a href="' + v.url + '" target="_blank">' + v.title + '</a></span></li>';
                        }

                        html[i] = '<li' + (classes.length ? ' class="' + classes.join(' ') + '"' : '') + '>' +
                            (v.count > 200 ? '<i class="hit">' + v.count + '</i>' : '<i>' + v.count + '</i>') +
                            title
                    } else
                        html[i] = '<li><i></i><a></a></li>';
                }

                ele.innerHTML = html.join('');
            }
        },

        a(ele: HTMLAnchorElement, attrs, data: Data) {
            ele.href = data.config.link;
            ele.textContent = data.config.name
        }
    },
)
class Data {
    $template: HTMLElement

    private xhr = new XMLHttpRequest();
    private loading = false;
    private _resolve = $$resolve

    checks: string[] = []
    values: DATA[] = [];

    constructor(public config: CONFIG) {

    }

    refresh(): Promise<any> {
        if (this.loading) return this._resolve;

        className(this.$template, ['loading'], true);

        return this._resolve = new Promise<any>((o, x) => {
            let {xhr} = this;

            this.loading = true;
            xhr.onreadystatechange = () => {
                if (xhr.readyState == 4) {
                    if (xhr.status == 200) {
                        this.values = JSON.parse(xhr.responseText);
                        className(this.$template, ['loading'], false);
                        this.apply();
                        this.loading = false;
                        this.checks = this.values.map(s => s.url)
                    }
                    o();
                }
            };
            xhr.open('GET', this.config.url, true);
            xhr.send(null);
        })

    }

    apply() {
        return this;
    }
}


$ready(() => {

    let

        container = document.querySelector('.row'),
        t = document.querySelector('.time-count'),

        xhr = new XMLHttpRequest(),
        id = /navercafe\/([^\/]+)/.exec(location.pathname)[1],
        value = decodeURIComponent(location.search.replace(/^\?/, '')),
        values = value ? value.split(/,/) : [];

    xhr.open('GET', '/navercafe/data/info?id=' + id, true);
    xhr.onreadystatechange = () => {
        if (xhr.readyState == 4) {
            if (xhr.status == 200) {
                let
                    r: INFO = JSON.parse(xhr.responseText),

                    anchor = <HTMLAnchorElement>document.querySelector('.navbar-brand'),

                    list = values.filter(l => !!l).map( l => {
                        l = l.trim();
                        let d = new Data({name: l, link: '',
                            url: '/navercafe/data/list?id=' + r.id +
                            '&name=' + r.url + '&searchBy=1&page=1&word=' + l});
                        container.appendChild(d.$template);
                        return d;
                    }),

                    loop = new CountLoop(1000, (count, loop) => {
                        t.textContent = (30 - count).toString();
                        if (count == 30) {
                            loop.stop();
                            $refresh();
                        }
                    }),

                    $refresh = () => Promise.all(list.map(l => l.refresh())).then(() => loop.start());

                document.title = r.name;
                anchor.textContent = r.name + ' 검색';
                anchor.target = '_blank';
                anchor.href = 'http://cafe.naver.com/' + r.url;

                $refresh();

            }
        }
    };
    xhr.send(null);

})