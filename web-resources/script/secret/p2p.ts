import {$ready} from "../../lib/core/core";
import "../../lib/core/support/toggle";
import {Search} from "../../lib/core/location";
import {Pager, PagerTable} from "../../lib/core/pager";
import {DOM} from "../../lib/core/dom";
import className = DOM.className;
import {HTML} from "../../lib/core/html";
import replaceHTML = HTML.replaceHTML;

interface RESULT {
    values: SERVER_DATA[]
    count: number
    page: number
    totalPages: number
}

interface SERVER_DATA {

    id: number

    site: string
    url: string
    title: string
    thumb: string
    uuid: string

    good: boolean
    visited: boolean
}


let xhr = {
    dirs: (function () {
        let xhr = new XMLHttpRequest();
        return function (): Promise<string[]> {
            return new Promise((o, x) => {
                xhr.onreadystatechange = function (aEvt) {
                    if (xhr.readyState == 4) {
                        if (xhr.status == 200) {
                            o(JSON.parse(xhr.responseText));
                        }
                    }
                };
                xhr.open('GET', '/secret/gallery/paths', true);
                xhr.send(null);
            });
        }

    })(),

    visited(id) {
        let xhr = new XMLHttpRequest();
        return new Promise((o, x) => {
            xhr.onreadystatechange = function (aEvt) {
                if (xhr.readyState == 4) {
                    if (xhr.status == 200) {
                        o();
                    }
                }
            };
            xhr.open('PUT', '/secret/p2p/visited/' + id, true);
            xhr.send(null);
        });
    },

    good(id, val) {
        let xhr = new XMLHttpRequest();
        return new Promise((o, x) => {
            xhr.onreadystatechange = function (aEvt) {
                if (xhr.readyState == 4) {
                    if (xhr.status == 200) {
                        o();
                    }
                }
            };
            xhr.open('PUT', '/secret/p2p/good/' + id + '/' + val, true);
            xhr.send(null);
        });
    },

    list: (function () {
        let xhr = new XMLHttpRequest();
        return function (data): Promise<RESULT> {
            return new Promise((o, x) => {
                xhr.onreadystatechange = function (aEvt) {
                    if (xhr.readyState == 4) {
                        if (xhr.status == 200) {
                            o(JSON.parse(xhr.responseText));
                        }
                    }
                };
                xhr.open('GET', '/secret/p2p/values?' + data.toString(), true);
                xhr.send(JSON.stringify(data));
            });
        }

    })(),
}

class LocalSearch extends Search {
    site = ''
    size = 100
    page = 1
    order: string
    search: string
    good: boolean
}


$ready(() => {

    let
        search: LocalSearch,
        totalPages: number,
        page: number,

        main = <HTMLElement>document.getElementById('main'),
        template = document.getElementById('template').innerHTML,

        onlyGood = <HTMLElement>document.querySelector('.only-good'),
        count = <HTMLElement>document.querySelector('nav .count'),

        beforeBtn = <HTMLAnchorElement>document.querySelector('.btn.before'),
        currentBtn = <HTMLButtonElement>document.querySelector('.btn.current'),
        afterBtn = <HTMLAnchorElement>document.querySelector('.btn.after'),
        pager = <HTMLElement>document.querySelector('.pager'),

        pagerTable = new PagerTable(pager, 10, 10)
            .setHandler((page, table) => {
                search.extend({page: page}).hash();
            }),

        run = () => {
            search = new LocalSearch().reset(location.hash.slice(1));

            let isGood = !!search.good;
            className(onlyGood, 'active', search.good = isGood);


            xhr.list(search).then((x) => {

                window.scrollTo(0, 0);

                let {values} = x;
                count.textContent = values.length.toString();
                main.innerHTML = values.map((v, i) => {
                    v['index'] = i+1;
                    return replaceHTML(template, v)
                }).join('');

                currentBtn.textContent = (page = x.page) + ' / ' + x.totalPages;
                totalPages = x.totalPages;

                pagerTable.render(new Pager(page, totalPages));
            })
        };

    onlyGood.addEventListener('click', () => {
        if(onlyGood.className.indexOf('active') === -1)
            location.hash = 'page=1&good=1&';
        else
            location.hash = 'page=1&good=0';
    });

    beforeBtn.addEventListener('click', () => {
        if (page > 1) search.extend({page: page - 1}).hash();
    });


    afterBtn.addEventListener('click', () => {
        if (page < totalPages) search.extend({page: page + 1}).hash();
    });

    main.addEventListener('click', (e) => {
        let target = <HTMLElement>e.target,
            key = target.getAttribute('data-update');

        if (key === 'visited') {
            if (target.getAttribute('data-value') === '0') {
                xhr.visited(target.getAttribute('data-id')).then(() => {
                    target.setAttribute('data-value', '1');
                })
            }
        }
        else if (key === 'good') {
            let v = target.getAttribute('data-value') === '1';
            xhr.good(target.getAttribute('data-id'), !v).then(() => {
                target.setAttribute('data-value', v ? '0' : '1');
            });
            e.preventDefault();
        }
    });

    window.addEventListener('hashchange', run);
    run();

});