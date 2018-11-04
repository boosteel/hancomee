import {$ready} from "../../lib/core/core";
import {SPA} from "../../lib/core/spa";
import {HTML} from "../../lib/core/html";
import selectAll = HTML.selectAll;
import {Events} from "../../lib/core/events";
import propertyMap = Events.propertyMap;
import select = HTML.select;

type H = HTMLElement

$ready(() => {

    selectAll(document.body, ['main', '.menu', '#profile'],
        (body: HTMLBodyElement, main: H, menu: H, profile: H) => {

            let
                initData: InitData = {
                    aside: select(profile, '{data-name}')
                },
                Modules = {
                    customer: require("./src/customer").default(initData),
                    account: require("./src/account").default(initData),
                    gallery: require("./src/gallery").default(initData),
                    main: require("./src/main").default(initData),
                    managing: require("./src/managing").default(initData),
                },
                Roots = {
                    intro: require("./root/intro").default(initData),
                    cal: require("./root/cal").default(initData),
                    register: require("./root/register").default(initData),
                    search: require("./root/search").default(initData),
                    customers: require("./root/customers").default(initData),
                },

                {classList: bodyClass} = body,
                {classList: mainClass} = main,

                isLoad = false,
                loading = () => {
                    return new Promise((o,x) => {
                        selectAll(document.getElementById('module-block'),
                            ['.text', '.p-bar'],
                            (block: HTMLElement, text: HTMLElement, bar: HTMLElement) => {

                                block.addEventListener('transitionend', () => {
                                    setTimeout(() => {
                                        block.style.display = 'none'
                                        o();
                                    }, 100);
                                });

                                bar.addEventListener('transitionend', (e) => {
                                    text.textContent = '진여수 전용 프로그램 로딩 완료'
                                    setTimeout(() => block.style.opacity = '0', 700);
                                    e.stopPropagation();
                                });

                                setTimeout(() => bar.style.width = '100%', 300);
                                setTimeout(() => text.textContent = '관리자 모듈 로딩', 2100);
                                setTimeout(() => text.textContent = '주요 모듈 생성', 1500);
                            });

                        isLoad = true;
                    })
                },

                spa = new SPA({
                    defaultURL: 'intro',
                    before() {
                        bodyClass.add('load');
                        if(!isLoad) return loading();
                    },
                    onChange(ele, e, {pathname}: iSPA.Info) {

                        if (Modules[pathname]) {
                            bodyClass.contains('whole') && bodyClass.remove('whole');
                        } else bodyClass.contains('whole') || bodyClass.add('whole');

                        e && main.removeChild(e);
                        main.appendChild(ele);
                    },
                    after() {
                        bodyClass.remove('load');
                    }
                }),
                p;

            for (p in Modules) spa.register(p, Modules[p]);
            for (p in Roots) spa.register(p, Roots[p]);

            spa.onHash();

            propertyMap(menu, 'click', {
                move({url}: {url: string}, e: Event) {
                    location.hash = url + '?id=' +  spa.param.id;
                    e.preventDefault();
                    e.stopPropagation()
                }
            })
        });

   //document.getElementById('module-block').style.display = 'none';
});