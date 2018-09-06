import {$ready} from "../../lib/core/core";
import {Selector} from "../../lib/core/dom/selector";
import {SPA} from "../../lib/core/spa";
import {List} from "./src/list";
import {DOM} from "../../lib/core/dom";
import className = DOM.className;
import {CModule} from "./src/calendar";
import select = Selector.select;

let {forEach, map, reduce} = Array.prototype;

$ready(() => {


    select(document.body, (aside, main) => {

        let
            // 페이지
            transfort = (function (ele1, ele2) {

                let current = ele1, wait = ele2, temp;

                main.appendChild(ele1);
                main.appendChild(ele2);

                main.addEventListener('animationend', (e) => {
                    if (current === e.target) current.className = 'on';
                    else wait.className = '';
                })

                return function (target: HTMLElement) {
                    wait.innerHTML = '';
                    wait.appendChild(target);
                    current.className = 'page-out';
                    wait.className = 'page-in'

                    // swap
                    temp = wait;
                    wait = current;
                    return current = temp;
                }
            })(document.createElement('div'), document.createElement('div')),


            // 사이드 메뉴 불켜기
            asideMenu = (function (list: NodeListOf<HTMLLIElement>) {
                let names = map.call(list, (li) => li.firstElementChild.getAttribute('href').slice(1)),
                    len = names.length;

                return function (url) {
                    let i = 0;
                    for (; i < len; i++) {
                        if (names[i] === url) list[i].className = 'active';
                        else list[i].className = '';
                    }
                }
            })(aside.querySelectorAll('li')),

            spa = new SPA({
                before(pathname) {
                    asideMenu(pathname);
                    main.className = 'load';
                },
                onChange(ele, e) {
                    transfort(ele);
                },
                after() {
                    main.className = '';
                }
            })
                .register('list', List)
                .register('main', List)
                .register('calendar', CModule)
                .onHash();


    }, 'aside', 'main');


});