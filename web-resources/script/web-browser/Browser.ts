import {Tree} from "../../lib/core/support/Tree";
import {Events, EventsGroup} from "../../lib/core/events";
import {DOM} from "../../lib/core/dom";
import {Directive, Template, Watcher} from "../../lib/core/template";
import {MediaElement} from "./core/MediaElement";
import {MediaController} from "./core/MediaController";
import {Search} from "../../lib/core/location";
import {extend} from "../../lib/core/core";
import className = DOM.className;

// ********************************** ▼ TYPES ▼ ********************************** //
type iMediaEventHandler<T> = (index: number, value: string, media: T, e: Event) => any

interface iMediaContainerFactory<T extends MediaContainer> {
    new(mediaElement: iMediaElement, media: iMedia, index: number): T
}

type iMediaSearch<T extends MediaSeach> = new() => T

// ********************************** ▲ TYPES ▲ ********************************** //


export interface iBrowserConfig<T extends MediaContainer, S extends MediaSeach> {
    Media: iMediaContainerFactory<T>
    Search: iMediaSearch<S>
    events: { [index: string]: iMediaEventHandler<T> }
    $load: (map: S, browser: Browser<T, S>) => Promise<any>
    directive?: Directive<Browser<T, S>>
}

/*
 *  해시 쿼리를 담는 Search 객체
 *  path를 반드시 가지고 있어야 한다.
 */
export class MediaSeach extends Search {
    path = ''
    size = 100

}

/*
 *  Browser를 이용하기 위해서는 이 컨테이너를 상속받아야 한다.
 *
 *  thumbElement: 썸네일 엘리먼트
 *  $template: 미디어 컨테이너
 *
 */
@Template({
    mediaContent(ele: HTMLElement, attrs, lf: MediaContainer) {
        ele.appendChild(lf.mediaElement.element);
    },

})
export class MediaContainer {

    static events = null;
    static container = <HTMLElement>DOM.createHTML('<div class="col-sm-2 media-thumbnail"></div>');

    thumbElement: HTMLElement
    $template: HTMLElement

    path: string
    filename: string
    filetype: string
    filesize: number
    rotate: number

    constructor(public mediaElement: iMediaElement, media: iMedia, index: number) {
        let p;
        for (p in media)
            this[p] = media[p];

        this.thumbElement = <HTMLElement>MediaContainer.container.cloneNode(false);
        this.$template.setAttribute('data-media-index', index.toString());
        this.thumbElement.appendChild(this.$template);
    }

    onScreen(screen: HTMLElement) {
        screen.appendChild(this.$template);
        this.mediaElement.onScreen().render(this.rotate);
        return this;
    }

    offScreen() {
        this.thumbElement.appendChild(this.$template);
        this.mediaElement.offScreen().render(this.rotate);
        window.scrollTo(0, this.thumbElement.offsetTop - (window.innerHeight / 3.5));
        return this;
    }

    apply() {
        return this;
    }
}

let BodyDirective: Directive<Browser<any, any>> = {

    /*
     *  body는 반드시 [browser] 어트리뷰트를 가져야 한다.
     *
     *  data-media-click 어트리뷰트를 가진 엘리먼트를 클릭하면 browser가 제어하는 click이벤트를 받을 수 있다.
     *
     */
    browser(ele: HTMLElement, attrs, browser) {
        let {config: {events}, eventMap} = browser;
        /*
         *  [data-media-action] 엘리먼트만 이벤트에 참여하게 된다.
         */
        Events.bind(ele, 'click', (e) => {
            let target: any = e.target;
            while (target && target !== ele) {

                if (target.hasAttribute('data-media-click')) {
                    let type = target.getAttribute('data-media-click'),
                        value = target.getAttribute('data-media-value');

                    while (!target.hasAttribute('data-media-index'))
                        if (!(target = target.parentElement)) return;

                    let
                        index = parseInt(target.getAttribute('data-media-index')),
                        media = browser.list[index];

                    events[type] && events[type].call(this, index, value, media, e);
                    eventMap[type] && eventMap[type].call(this, index, value, media, e);

                    return;
                }
                target = target.parentElement;
            }
        });

    },


    /*
     *  폴더 트리 생성
     *  ① 해시에 변화가 있으면, $load() 메서드를 실행시켜준다.
     *  ② browser.setTree()를 통해 폴더 트리를 갱신할 수 있다.
     */
    aside(ele: HTMLElement, attrs, browser) {
        let
            {$template, config:{Search, $load}} = browser,
            c = ['loading'],
            tree = new Tree('tree')
                .appendTo(ele)
                /*
                 *  <a>클릭시 이벤트를 인터셉트해서 정규화된 쿼리문을 hash로 설정한다.
                 */
                .setIntercepter((href, tree, e) => {
                    // 트리를 클릭하면 Search가 초기화 된다.
                    browser.search = new Search().extend({path: href}).hash();
                    e.preventDefault();
                }).reset(browser.tree),
            $change = () => {
                let hash = location.hash.slice(1), {search} = browser;

                className($template, c, true);

                $load(search.reset(hash), browser).then(() => {
                    tree.active(search.path).open(search.path);
                    browser.watcher.apply('#hash');
                    window.scrollTo(0, 0);
                    className($template, c, false);
                });

            };

        window.addEventListener('hashchange', () => $change());
        $change();

        return {
            tree() {
                let {search} = browser;
                tree.reset(browser.tree).active(search.path).open(search.path);
            }
        }
    },

    /*
     *  ※미디어의 전체화면
     *
     *  ① 미디어를 전체화면으로 뿌려준다.
     *  ② 휠 이벤트 등을 통해 미디어 리스트를 순회한다.
     *  ③ Media 종류에 따라 각 Media Controller를 on/off한다.
     */
    screen(screen: HTMLElement, attrs, browser) {

        let
            active: MediaContainer,
            count: HTMLElement = screen.querySelector('.count'),

            ctrls = MediaController.create(screen),
            events = new EventsGroup()
                .register(screen, 'mousewheel', (e: MouseWheelEvent) => {
                    $move(e['wheelDelta'] < 0 ? 1 : -1);
                    e.preventDefault();
                })
                .register(Events.keyDown(screen, [38], () => $move(-1)))
                .register(Events.keyDown(screen, [40], () => $move(1)))
                .register(Events.keyDown(screen, [27], () => $off()))
                .register(screen, 'click', (e: MouseEvent) => {
                    if (e.target['hasAttribute']('media-content')) {
                        $off();
                    }
                }).off(),

            $move = (num: number) => {
                let
                    {list} = browser,
                    index = list.indexOf(active),
                    next = num + index;

                if (next > -1 && next < list.length) {
                    $off();
                    $on(list[next]);
                }
            },
            $on = (container: MediaContainer) => {
                if (active !== container) {
                    let {mediaElement} = container, {list} = browser;
                    ctrls.forEach(c => c.test(container) ? c.on(mediaElement) : c.off());
                    events.on();
                    active = container.onScreen(screen);
                    screen.className = 'on';
                    count.textContent = list.indexOf(container) + 1 + ' / ' + list.length;
                }
            },
            $off = () => {
                active && active.offScreen();
                active = null;
                ctrls.forEach(c => c.off());
                events.off();
                screen.className = '';
            }

        browser.eventMap.screen = (i, val, media) => $on(media);
    },

    /*
     *  미디어 썸네일을 관리한다.
     */
    mediaList(ele: HTMLElement, attrs, body) {

        return {
            list() {
                ele.innerHTML = '';
                if (body.list) {
                    ele.appendChild(body.list.reduce((frag, v) => {
                        frag.appendChild(v.thumbElement);
                        return frag;
                    }, document.createDocumentFragment()));
                }
            }
        }
    },

    '$$'(ele: HTMLElement, attrs, body) {
        console.log('$$')
    }
};

export class Browser<C extends MediaContainer, S extends MediaSeach> {

    watcher: Watcher<Browser<any, any>>;
    list: C[] = []
    tree: string[] = []

    eventMap: { [index: string]: iMediaEventHandler<any> } = {};

    search: S

    constructor(public config: iBrowserConfig<C, S>, public $template = <HTMLElement>document.body) {

        this.search = new config.Search();

        // compile!!
        Template.each(
            $template,
            extend({}, BodyDirective, config.directive),
            this.watcher = new Watcher(this)
        );

    }

    setTree(tree: string[]) {
        this.tree = tree;
        return this;
    }

    setValues(values: iMedia[]) {
        let {Media} = this.config;
        if(values) {
            this.list = values
                .map((v, i) => {
                    let e = MediaElement.create(v);
                    e.element.setAttribute('data-media-click', 'screen');
                    return new Media(e, v, i)
                });
        } else this.list = [];

        return this;
    }

    apply() {
        this.watcher.apply();
        return this;
    }
}
