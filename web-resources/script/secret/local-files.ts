import {$ready} from "../../lib/core/core";
import {Browser, iBrowserConfig, MediaContainer, MediaSeach} from "../web-browser/Browser";
import {Template} from "../../lib/core/template";
import {Search} from "../../lib/core/location";

let xhr = {
    dirs: (function () {
        let xhr = new XMLHttpRequest();
        return function (path: string): Promise<string[]> {
            return new Promise((o,x) => {
                xhr.onreadystatechange = function (aEvt) {
                    if (xhr.readyState == 4) {
                        if(xhr.status == 200) {
                            o(JSON.parse(xhr.responseText));
                        }
                    }
                };
                xhr.open('GET', '/secret/local-files/dirs?path=' + path, true);
                xhr.send(null);
            });
        }

    })(),
    list: (function () {
        let xhr = new XMLHttpRequest();
        return function (data): Promise<iMedia[]> {
            return new Promise((o,x) => {
                xhr.onreadystatechange = function (aEvt) {
                    if (xhr.readyState == 4) {
                        if(xhr.status == 200) {
                            o(JSON.parse(xhr.responseText));
                        }
                    }
                };
                xhr.open('GET', '/secret/local-files/list?' + data.toString(), true);
                xhr.send(null);
            });
        }

    })(),
    favorite: (function () {
        let xhr = new XMLHttpRequest();
        return function (data): Promise<iMedia[]> {
            return new Promise((o,x) => {
                xhr.onreadystatechange = function (aEvt) {
                    if (xhr.readyState == 4) {
                        if(xhr.status == 200) {
                            o();
                        }
                    }
                };
                xhr.open('POST', '/secret/local-files/favorite', true);
                xhr.setRequestHeader('Content-Type', 'application/json');
                xhr.send(JSON.stringify(data));
            });
        }

    })(),
}

class LocalSearch extends MediaSeach {
    name = 'string'
    path = ''
}

@Template({
    title(ele: HTMLAnchorElement, attrs, f: LocalFiles) {
        ele.textContent = f.filename;
        ele.href = f.path + f.filename + '.' + f.filetype;
    },
    rotate(ele: HTMLElement, attrs, f: MediaContainer) {
        return {
            rotate() {
                ele.textContent = f.rotate.toString();
            }
        }
    },
})
class LocalFiles extends MediaContainer {

    rotating() {
        let r = this.rotate + 90;
        if (r === 360) r = 0;
        return this.rotate = r;
    }

    apply() {
        return this;
    }
}


$ready(() => {


    let path = 'files',

        config: iBrowserConfig<LocalFiles, LocalSearch> = {

            Media: LocalFiles,

            Search: LocalSearch,

            events: {
                rotate(i, v, media) {
                    media.mediaElement.render(media.rotating());
                    media.apply();
                },
                favorite(i,v,media) {
                    xhr.favorite({target: media.path + '/' + media.filename + '.' + media.filetype})
                }
            },

            $load(map: LocalSearch, browser) {
                return xhr.list(map).then((l) => browser.setValues(l).apply());
            },

            directive: {

            }
        }

    if(location.search.indexOf("path=") !== -1)
        path = /path=([^&]+)/.exec(location.search)[1];

    xhr.dirs(path).then((s) => {
        new Browser(config).setTree(s).apply();
    })
});