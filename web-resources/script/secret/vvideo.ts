import {$ready, extend} from "../../lib/core/core";
import {DOM} from "../../lib/core/dom";
import {Events, EventsGroup} from "../../lib/core/events";
import className = DOM.className;
import {HTML} from "../../lib/core/html";
import compile = HTML.compile;
import {Search} from "../../lib/core/location";
import {Pager, PagerTable} from "../../lib/core/pager";
import "../../lib/core/component/toggle";
import {Branch} from "../../lib/core/component/Branch";
import createTree = Branch.createTree;
import select = HTML.select;


let xhr = {

    pick() {
        return new Promise<string>((o, x) => {
            let xhr = new XMLHttpRequest();
            xhr.onreadystatechange = () => {
                if (xhr.readyState === 4 && xhr.status === 200) {
                    o(xhr.responseText);
                }
            }
            xhr.open('GET', '/secret/vvideo/pick');
            xhr.send(null);
        })
    },
    pickout() {
        return new Promise<number>((o, x) => {
            let xhr = new XMLHttpRequest();
            xhr.onreadystatechange = () => {
                if (xhr.readyState === 4 && xhr.status === 200) {
                    o();
                }
            }
            xhr.open('DELETE', '/secret/vvideo/pick');
            xhr.send(null);
        })
    },
    paths() {
        return new Promise<string[]>((o, x) => {
            let xhr = new XMLHttpRequest();
            xhr.onreadystatechange = () => {
                if (xhr.readyState === 4 && xhr.status === 200) {
                    o(JSON.parse(xhr.responseText));
                }
            }
            xhr.open('GET', '/secret/vvideo/paths');
            xhr.send(null);
        })
    },
    values(querystring: string) {
        return new Promise<SERVER_DATA>((o, x) => {
            let xhr = new XMLHttpRequest();
            xhr.onreadystatechange = () => {
                if (xhr.readyState === 4 && xhr.status === 200) {
                    o(JSON.parse(xhr.responseText));
                }
            }
            xhr.open('GET', '/secret/vvideo/values?' + querystring);
            xhr.send(null);
        })
    },

    update(id, data) {
        return new Promise<void>((o, x) => {
            let xhr = new XMLHttpRequest();
            xhr.onreadystatechange = () => {
                if (xhr.readyState === 4 && xhr.status === 200) {
                    o();
                }
            }
            xhr.open('PUT', '/secret/vvideo/update/' + id, true);
            xhr.setRequestHeader('Content-Type', 'application/json')
            xhr.send(JSON.stringify(data));
            ;
        })
    }

}

interface SERVER_DATA {
    totalPages: number
    count: number
    values: Vvideo[]
    page: number
}

interface Vvideo {
    id: number
    index: number;
    blind: boolean
    favorite: number
    path: string
    title: string
    tag: string
    memo: string
    filename: string
    filetype: string

    href: string
    thumb: string
    url: string
}

class Query extends Search {

    _totalPages: number

    page = 1
    size = 100
    favorite = 0
    blind = 0

    path = ''
    title: string
    memo: string
    tag: string
}


$ready(() => {

    let
        query = new Query(),

        // 현재 불려진 모든 리스트의 비디오 주소가 들어가있다.
        hiddenText = <HTMLTextAreaElement>document.getElementById('hidden-text'),
        hiddenUrl = <HTMLTextAreaElement>document.getElementById('hidden-url'),

        values: Vvideo[],

        current = -1,
        total: number,
        page: number,
        totalPages: number,

        container = document.getElementById('list'),    // 리스트 컨테이너
        template = compile(document.getElementById('vvideo-template').innerText),


        // *************************  <aside>  ************************* //
        aside = (function (aside) {
            let treeCtrl;
            xhr.paths().then((names) => {
                treeCtrl = createTree(names);
                treeCtrl.handler = (path) => {
                    location.hash = 'path=' + path + '&page=1';
                };
                aside.appendChild(treeCtrl.element);
            });

            return {
                active(path: string) {
                    treeCtrl.active(path);
                }
            }
        })(document.querySelector('aside')),


        // *************************  <nav>  ************************* //
        nav =
            select('nav', function(nav, count, current, pager, fav, pick, pickOut, list) {

                let
                    pickNum,
                    pagerTable = new PagerTable(pager, 10, 10)
                    .setHandler((page, table) => {
                        query.extend({page: page}).hash();
                    }),

                    ctrl = {
                        refresh(result: SERVER_DATA) {
                            fav.setAttribute('data-favorite', query.favorite.toString());
                            pagerTable.render(new Pager(page = result.page, totalPages = result.totalPages));
                            current.textContent = page + ' / ' + totalPages;
                            count.textContent = (total = values.length) + '';
                            this.pick();
                        },
                        pick() {
                            xhr.pick().then((i) => pick.textContent = pickNum = i);
                        }
                    };

                // 모든 주소 복사
                list.addEventListener('click', () => {

                    hiddenText.select();
                    document.execCommand('copy');
                });


                // 모든 체크 지우기
                pickOut.addEventListener('click', () => {
                    if(pickNum !== '0') {
                        xhr.pickout().then(() => ctrl.pick());
                    }
                });

                Events.propertyMap(this, 'click', {
                    prev() {
                        page > 1 && query.extend({page: page - 1}).hash();
                    },
                    next() {
                        page < totalPages && query.extend({page: page + 1}).hash();
                    },
                    favorite(v, e: MouseEvent) {
                        if(query.favorite === v.favorite) v.favorite--;
                        query.extend({favorite: v.favorite, page: 1,
                            path: (e.ctrlKey ? '' : query.path)}).hash();
                    }
                }, class V {
                    favorite: number
                });

                return ctrl;
            }, '.count', '.current', '.pager', '.favorite', '.pick', '.pick-out', '.list'),


        // *************************  리스트 넘김 이벤트  ************************* //
        gEvent = new EventsGroup()
            .register(document, 'mousewheel', (e: MouseWheelEvent) => {
                let next = current + (e['wheelDelta'] < 0 ? 1 : -1);
                if (next > -1 && next < total) $editor(next);
                e.preventDefault();
            }).off(),


        // ********************* ▼ 전체화면 [제목, 메모, 태그] ▼ ********************* //
        $editor = (function (editor) {

            let
                $value: Vvideo,

                title = <HTMLInputElement>editor.querySelector('[name="title"]'),
                memo = <HTMLTextAreaElement>editor.querySelector('[name="memo"]'),
                tag = <HTMLInputElement>editor.querySelector('[name="tag"]'),
                commit = <HTMLButtonElement>editor.querySelector('.commit'),
                url = <HTMLInputElement>editor.querySelector('.url'),
                navi = <HTMLSpanElement>editor.querySelector('.navi'),

                check = () => {
                    let flag = $value.title !== title.value || $value.memo !== memo.value || $value.tag !== tag.value;
                    className(title, 'change', $value.title !== title.value);
                    className(memo, 'change', $value.memo !== memo.value);
                    className(tag, 'change', $value.tag !== tag.value);
                    className(editor, 'change', flag);
                };

            editor.addEventListener('keyup', check);

            // *** [Ajax] *** 제목, 내용, 태그 DB저장
            commit.addEventListener('click', () => {
                let value = $value,
                    m = memo.value, t = title.value, g = tag.value;
                xhr.update(value.id, {
                    memo: "'" + m.replace(/'/, "\'") + "'",
                    title: "'" + t.replace(/'/, "\'") + "'",
                    tag: "'" + g.replace(/'/, "\'") + "'",
                }).then(() => {
                    value.memo = m;
                    value.tag = g;
                    value.title = t;

                    check();
                });

            })

            return (i: number) => {

                // ① 현재 열려진게 있으면 원상복구
                if (current !== -1) {
                    let ele = document.getElementById('vvideo-' + current);
                    ele.className = ele.className.replace(/screen/, 'list');
                }

                // ② -1이 들어오면 전체화면 종료
                if (i < 0) {
                    gEvent.off();
                    document.body.appendChild(editor);
                }
                // ③ 인텍스가 들어오면 해당 비디오 전체화면
                else {
                    gEvent.on();
                    let data = $value = values[i],
                        ele = document.getElementById('vvideo-' + i);

                    navi.textContent = (i + 1) + ' / ' + total;
                    window.scrollTo(0, ele.offsetTop - (window.innerHeight / 3.5));

                    title.value = data.title;
                    memo.value = data.memo;
                    tag.value = data.tag;
                    url.value = data.url;

                    ele.querySelector('.editor').appendChild(editor);
                    ele.className = ele.className.replace(/list/, 'screen');

                    check();
                }
                current = i;
            }
        })(document.getElementById('editor')),

        // ********************* ▲ 전체화면 [제목, 메모, 태그] ▲ ********************* //


        // *************************  서버 연결  ************************* //
        refresh = () => {
            query = new Query().reset(location.hash.slice(1));
            xhr.values(query.toString()).then((list) => {

                let {values: result} = list,
                    url = [];
                values = [];
                container.innerHTML = (result || []).map((c, i) => {
                    let path = '/disc/' + c.path + '/' + encodeURIComponent(c.filename);
                    c['index'] = i;
                    c['href'] = path + '.' + c.filetype;
                    c['thumb'] = path + '.jpg';
                    url[i] = c['url'] = c.path + '/' + c.filename + '.' + c.filetype;
                    values[i] = c;
                    return template(c);
                }).join('');

                hiddenText.value = url.join('\n');

                nav.refresh(list);
                aside.active(query.path);

                window.scrollTo(0, 0);
            })
        };


    type E_OBJ = {
        vvideo: HTMLElement
        id: number
        favorite
        index: number
        target: HTMLElement
    }

    // *************************  Vvideo Events  ************************* //
    Events.propertyMap(container, 'click', {

        favorite(d: E_OBJ, e) {

            let {vvideo, favorite, index} = d,
                cFavorite = parseInt(vvideo.getAttribute('data-favorite'));

            if (favorite === cFavorite) favorite--;

            // *** [Ajax] *** 제목, 내용, 태그 DB저장
            xhr.update(values[index].id, {favorite: favorite}).then(() => {
                d.vvideo.setAttribute('data-favorite', favorite);
            })
        },
        screen(d: E_OBJ, e) {
            $editor(d.index);
        },
        close(d: E_OBJ, e) {
            let target = <HTMLElement>e.target;
            if (target.getAttribute('data-event') === 'close') {
                $editor(-1);
            }
        },
        // 인풋 클릭시 클립보드에 복사
        copy(d, e) {
            hiddenText.value = values[d.index].url;
            hiddenText.select();
            document.execCommand('copy');
        },
        pick(d,e) {
            let {id, vvideo} = d,
                pick = d.vvideo.getAttribute('data-pick') !== '1';
            xhr.update(id, {pick: pick}).then(() => {
                vvideo.setAttribute('data-pick', pick ? '1' : '0');
                nav.pick();
            });
        },
        shot(d, e: MouseEvent) {
            let {id, vvideo, target} = d,
                v = parseInt(vvideo.getAttribute('data-shot'));
            if(e.ctrlKey) v--;
            else v++;

            if(v > -1) {
                xhr.update(id, {shot: v}).then(() => {
                    vvideo.setAttribute('data-shot', target.textContent = v.toString());
                })
            }
        },
    });

    window.onhashchange = refresh
    refresh();

});