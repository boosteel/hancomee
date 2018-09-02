import {$ready} from "../lib/core/core";
import {CountLoop} from "../lib/core/loop";
import {Template} from "../lib/core/template";
import {DOM} from "../lib/core/dom";
import className = DOM.className;


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

    private timeout = 1000;

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
                    else {
                        this.xhr = new XMLHttpRequest();
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

        //   https://cafe.naver.com/hungrya?iframe_url=/ArticleList.nhn%3Fsearch.clubid=25678061%26userDisplay=50%26search.boardtype=L%26search.specialmenutype=%26search.questionTab=A%26search.totalCount=501%26search.page=2
        naverCafe = (kr: string, name: string, cId: number, mId: number) => {
            return {
                name: kr,
                link: 'https://cafe.naver.com/' + name + '?' +
                'iframe_url=/ArticleList.nhn%3F' +
                'search.clubid=' + cId + '%26' +
                'search.menuid=' + mId + '%26' +
                'userDisplay=50%26' +
                'search.boardtype=L%26' +
                'search.specialmenutype=%26' +
                'search.questionTab=A%26' +
                'search.totalCount=501%26' +
                'search.page=1',

                url: '/audiobay/naver?page=1&clubId=' + cId + '&name=' + name + '&menuId=' + mId
            }
        },

        list = [
            {
                name: '와싸다닷컴',
                link: 'http://www.wassada.com/bbs_list.php?tb=board_uusell',
                url: '/audiobay/wassada?page=1',

            },
            {
                name: '하이파이클럽',
                link: 'https://www.hificlub.co.kr/web10/jmkt/jmkt_list_n16.asp?jmkt_gb=1',
                url: '/audiobay/hificlub?page=1',

            },
            naverCafe('피씨파이카페', 'cyrus7', 15058188, 59),
            naverCafe('중고나라', 'joonggonara', 10050146, 411),
            naverCafe('하이파이코리아', 'hifikorea', 23218064, 48),
            naverCafe('헝그리오디오', 'hungrya', 25678061, 14),
            naverCafe('두두오 일반', 'audiodudu', 28248719, 46),
            naverCafe('두두오 고급', 'audiodudu', 28248719, 53),
            {
                name: '실용오디오',
                link: 'https://www.enjoyaudio.com/zbxe/index.php?mid=audiosell',
                url: '/audiobay/enjoyaudio?page=1',

            },
            naverCafe('깡통소리', 'hiend', 25469486, 48),
            naverCafe('네임오디오 카페', 'naimaudiokorea', 26214223, 86),
        ]
            .map((r) => {
                let d = new Data(r);
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

    Template.each(document.body, {
        input(ele: HTMLInputElement, attrs) {

            /*
             *  url값으로 filter를 셋팅한다.
             */
            let value = decodeURIComponent(location.search.replace(/^\?/, ''));

            if (value) {
                filter = new RegExp(value.replace(/\s+/g, '|'), 'gi');
                ele.value = value;
            }

            ele.addEventListener('keypress', (e: KeyboardEvent) => {

                if (e.keyCode === 13) {
                    let keyword = ele.value.trim();
                    if (keyword && keyword !== value) {
                        try {
                            filter = new RegExp(keyword.replace(/\s+/g, '|'), 'gi');
                        } catch (e) {
                            filter = null;
                        }
                    } else {
                        filter = null;
                    }
                    list.forEach(l => l.apply());
                }
            })
        }
    });

    $refresh();

})