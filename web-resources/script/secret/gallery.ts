import {Browser, iBrowserConfig, MediaContainer, MediaSeach} from "../web-browser/Browser";
import {Template} from "../../lib/core/template";
import {$ready} from "../../lib/core/core";
import "../../lib/core/support/toggle";
import {PagerTable, Pager} from "../../lib/core/pager";
import {Events} from "../../lib/core/events";
import {DOM} from "../../lib/core/dom";
import className = DOM.className;

interface SERVER_DATA {
    totalPages: number
    count: number
    values
    page: number
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

    update(id, data) {
        let xhr = new XMLHttpRequest();
        return new Promise((o, x) => {
            xhr.onreadystatechange = function (aEvt) {
                if (xhr.readyState == 4) {
                    if (xhr.status == 200) {
                        o(JSON.parse(xhr.responseText));
                    }
                }
            };
            xhr.open('PUT', '/secret/gallery/update/' + id, true);
            xhr.setRequestHeader('Content-Type', 'application/json')
            xhr.send(JSON.stringify(data));
        });
    },

    list: (function () {
        let xhr = new XMLHttpRequest();
        return function (data): Promise<SERVER_DATA> {
            return new Promise((o, x) => {
                xhr.onreadystatechange = function (aEvt) {
                    if (xhr.readyState == 4) {
                        if (xhr.status == 200) {
                            o(JSON.parse(xhr.responseText));
                        }
                    }
                };
                xhr.open('GET', '/secret/gallery/values?' + data.toString(), true);
                xhr.send(JSON.stringify(data));
            });
        }

    })(),
}

class LocalSearch extends MediaSeach {
    _totalPages: number
    page: number
    favorite = 0
    size = 100
    blind = false
    order = ">uploadtime"
}

@Template({
    galFavorite(ele: HTMLElement, attrs, f: GalleryFiles) {
        ele.setAttribute('data-template-compile', '');
        return {
            favorite() {
                ele.setAttribute('data-favorite', f.favorite.toString());
            }
        }
    },
    galRotate(ele: HTMLElement, attrs, f:GalleryFiles) {
      return {
          rotate() {
              ele.textContent = f.rotate.toString();
          }
      }
    },
    galShot(ele: HTMLElement, attrs, f: GalleryFiles) {
        return {
            shot() {
                className(ele, 'zero', !f.shot);
                ele.textContent = f.shot.toString();
            }
        }
    },
    galPath(a: HTMLAnchorElement, attrs, f: GalleryFiles) {
        a.href = '#path=/' + encodeURIComponent(f.path);
    },
    galUser(a: HTMLAnchorElement, attrs, f: GalleryFiles) {
        a.textContent = '[' + f.user + ']';
        a.href = '#search=@' + f.user;
    },
    galTitle(ele: HTMLElement, attrs, f: GalleryFiles) {
        ele.textContent = f.title;
    },
})
class GalleryFiles extends MediaContainer {
    id: number
    user: string

    title: string
    favorite: number
    blind: boolean
    shot: number
    tags: string

    uuid: string


    apply() {
        return this;
    }
}


$ready(() => {

    let

        config: iBrowserConfig<GalleryFiles, LocalSearch> = {

            Media: GalleryFiles,

            Search: LocalSearch,

            events: {
                favorite(i, v, media: GalleryFiles, e) {
                    let favorite = parseInt(v);
                    if (media.favorite === favorite) favorite--;
                    xhr.update(media.id, {prop: 'favorite', value: favorite}).then(() => {
                        media.favorite = favorite;
                        media.apply();
                    })
                },
                shot(i,v,media: GalleryFiles, e: MouseEvent) {

                    let {shot} = media;
                    if(e.ctrlKey) shot--;
                    else shot++;

                    if(shot < 0) return;

                    xhr.update(media.id, {prop: 'shot', value: shot}).then(() => {
                        media.shot = shot;
                        media.apply();
                    })
                },
                rotate(i, v, media: GalleryFiles, e) {
                    let r = media.rotate + 90;
                    if (r === 360) r = 0;
                    xhr.update(media.id, {prop: 'rotate', value: r}).then(() => {
                        media.mediaElement.render(media.rotate = r);
                        media.apply();
                    })

                }
            },

            $load(map: LocalSearch, browser) {
                return xhr.list(map).then((l) => {
                    browser.setValues(l.values).apply();
                    let {search} = browser;
                    search.page = l.page;
                    search._totalPages = l.totalPages;
                });
            },

            directive: {

                // Pager
                galPager(ele: HTMLElement, attrs, browser) {
                    let pagerTable = new PagerTable(ele, 10, 10)
                        .setHandler((page, table) => {
                            location.hash = browser.search.extend({page: page}).toString();
                        });
                    return {
                        '#hash'() {
                            let {search} = browser;
                            pagerTable.render(new Pager(search.page, search._totalPages));
                        }
                    }
                },
                galNav(ele: HTMLElement, attrs, browser) {
                    let current = <HTMLElement>ele.querySelector('.current');
                    ele.addEventListener('click', (e) => {
                        let target = <HTMLElement>e.target,
                            num;
                        if (num = target.getAttribute('data-nav')) {
                            let {search} = browser;
                            let n = search.page + parseInt(num);
                            if (n > 0 && n < search._totalPages + 1)
                                search.extend({page: n}).hash();
                        }

                    })
                    return {
                        '#hash'() {
                            current.textContent = browser.search.page.toString();
                        }
                    }
                },
                galFavorite(ele: HTMLElement, attrs, browser) {
                    Events.bind(ele, 'click', '[data-value]', function (e, target) {
                        let favorite = parseInt(target.getAttribute('data-value')),
                            {search} = browser;
                        search.favorite === favorite && favorite--;
                        search.extend({page: 1, favorite: favorite}).hash();
                    })
                    return {
                        '#hash'() {
                            ele.setAttribute('data-favorite', browser.search.favorite.toString())
                        }
                    }
                }
            }
        }

    xhr.dirs().then((s) => {
        new Browser(config).setTree(s).apply();
    })
});