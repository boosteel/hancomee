import "../../lib/core/component/toggle";
import {$ready} from "../../lib/core/core";
import {HTML} from "../../lib/core/html";
import selectAll = HTML.selectAll;
import {SPA} from "../../lib/core/spa";
import {_forEach, _reduce} from "../../lib/core/_func/array";

type H = HTMLElement;

$ready(() => {

    // ****************************** nav ****************************** //
    let menu = selectAll(document.querySelector('nav'),
        ['[data-url][]', '#product-toggle', '#products-menu', '.menu', '.menu-close'],
        (nav: H, _urls: iEleArray, toggle: HTMLAnchorElement, pCon: H, pMenu: H, closeBtn: H) => {

            let
                {classList: tc} = toggle,
                {classList: pc} = pCon,
                {classList: navC} = nav,

                $pMenu = {
                    on() {
                        tc.add('active');
                        pc.add('on');
                    },
                    close() {
                        tc.remove('active');
                        pc.remove('on');
                    }
                },

                // 스크롤 위치에 따른 nav 모양
                navStatic = (y: number) => {
                    if (y === 0) navC.add('screen-top');
                    else navC.remove('screen-top');
                }


            // 제품 라인 창
            toggle.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                if(tc.contains('active')) $pMenu.close();
                else $pMenu.on();
            });

            closeBtn.addEventListener('click', () => $pMenu.close());

            // 병신같은 ie는 scrollY가 안 먹는다.
            window.addEventListener('scroll', () => navStatic(window.pageYOffset));
            navStatic(window.pageYOffset);

            return {
                active(pathname) {
                    _forEach(_urls, (e) => {
                        let url = e.getAttribute('data-url')
                        if (pathname.indexOf(url) === 0)
                            e.classList.add('active')
                        else e.classList.remove('active');
                    })
                },
                // 메뉴 모두 닫기
                close() {
                    $pMenu.close();
                }
            }
        });


    // 모듈 이동 애니메이션
    let _resolve = Promise.resolve();

    function $ani(ele: HTMLElement, className: string[], remove = false) {
        if (!ele) return _resolve;
        return new Promise((o, x) => {
            let {classList} = ele,
                fn = () => {

                    remove && ele.parentElement.removeChild(ele);

                    ele.removeEventListener('animationend', fn);
                    classList.remove(className[0]);
                    classList.remove(className[1]);

                    // 로드 된 후에 액션
                    if (remove) classList.remove('load-action');
                    else classList.add('load-action');

                    o();
                };
            ele.addEventListener('animationend', fn);
            classList.add(className[0]);
            classList.add(className[1]);
        });
    }


    selectAll(document.body,
        ['main', 'footer'],
        (body: HTMLBodyElement, main: H, footer: H) => {

            let
                {classList: bc} = body,
                {classList: mc} = main,

                classNames = [
                    [['move-hide', 'move-left'], ['move-show', 'move-left']],
                    [['move-hide', 'move-right'], ['move-show', 'move-right']]
                ],

                spa = new SPA({
                    defaultURL: 'intro',
                    before({pathname}) {
                        bc.add('load');
                        window.scrollTo(0, 0);
                        menu.active(pathname);
                        menu.close()
                    },
                    onChange(ele, e, {index, beforeIndex, way}) {
                        let c = classNames[way > 0 ? 0 : 1];
                        main.appendChild(ele);
                        return Promise.all([
                            $ani(e, c[0], true), $ani(ele, c[1])
                        ]);
                    },
                    after(pathname) {
                        bc.remove('load');
                    }
                })
                    .register('intro', require('./src/intro').default())
                    .register('products/cl600', require('./src/products/cl600').default())
                    .register('products/cl300', require('./src/products/cl300').default())
                    .onHash();

        });

});